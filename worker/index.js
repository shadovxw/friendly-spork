import { SYSTEM_PROMPT } from './knowledge.js';

// Cloudflare Worker entry point.
// - POST /api/chat  -> talks to the configured LLM and returns { reply }
// - everything else -> served from the built static site (the ASSETS binding)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat') {
      if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405);
      }
      return handleChat(request, env);
    }

    // Serve the React app / static files for any other route.
    return env.ASSETS.fetch(request);
  },
};

async function handleChat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  // Guardrails: keep only the last few turns and cap each message length.
  const incoming = Array.isArray(body?.messages) ? body.messages : [];
  const messages = incoming
    .slice(-10)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
    .map((m) => ({ role: m.role, text: m.text.slice(0, 1000) }));

  if (messages.length === 0) {
    return json({ error: 'No message provided.' }, 400);
  }

  try {
    // Provider is swappable via the AI_PROVIDER var. Default: Google Gemini (free tier).
    const provider = (env.AI_PROVIDER || 'gemini').toLowerCase();
    const reply =
      provider === 'ollama'
        ? await callOllama(messages, env)
        : await callGemini(messages, env);

    return json({ reply });
  } catch (err) {
    return json({ error: err.message || 'The assistant is unavailable right now.' }, 502);
  }
}

// --- Google Gemini (free tier) ---------------------------------------------
async function callGemini(messages, env) {
  if (!env.GEMINI_API_KEY) {
    throw new Error('Chat is not configured yet (missing GEMINI_API_KEY).');
  }

  const model = env.GEMINI_MODEL || 'gemini-2.0-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini error ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  if (!reply) throw new Error('Empty response from the model.');
  return reply.trim();
}

// --- Local Ollama (optional self-host) -------------------------------------
// Set AI_PROVIDER=ollama and OLLAMA_URL (e.g. a Cloudflare Tunnel to your laptop)
// to route through a locally-hosted model instead.
async function callOllama(messages, env) {
  const base = env.OLLAMA_URL || 'http://localhost:11434';
  const model = env.OLLAMA_MODEL || 'llama3.2';

  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.text })),
      ],
    }),
  });

  if (!res.ok) throw new Error(`Ollama error ${res.status}`);
  const data = await res.json();
  const reply = data?.message?.content?.trim();
  if (!reply) throw new Error('Empty response from Ollama.');
  return reply;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
