import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Github, Linkedin, FileText, X, MapPin, Copy, Check, ArrowUpRight } from 'lucide-react';
import profileImage from '../../assets/profile.jpg';
import resumeFile from '../../assets/resume.pdf';
import { useSystem } from '../../hooks/useSystem';
import HyperText from '../effects/HyperText';

const EMAIL = 'vrishank.w02@gmail.com';

// Contact card built on a native <dialog>: showModal() gives us the focus trap,
// Esc-to-close, an inert page behind it and focus returning to the opener.
const ContactModal = ({ isOpen, onClose }) => {
  const { playClick } = useSystem();
  const dialogRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);

  const finishClose = useCallback(() => {
    setClosing(false);
    dialogRef.current?.close(); // fires the native 'close' event -> onClose
  }, []);

  // Every close path (Esc, backdrop, x) plays the exit animation first.
  const requestClose = useCallback(() => {
    const d = dialogRef.current;
    if (!d?.open || closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finishClose();
    setClosing(true);
  }, [closing, finishClose]);

  // Esc: stop the instant close and run the animated one instead
  useEffect(() => {
    const d = dialogRef.current;
    if (!isOpen || !d) return;
    const onCancel = (e) => {
      e.preventDefault();
      requestClose();
    };
    d.addEventListener('cancel', onCancel);
    return () => d.removeEventListener('cancel', onCancel);
  }, [isOpen, requestClose]);

  // Safety net in case animationend never fires (e.g. tab hidden mid-close)
  useEffect(() => {
    if (!closing) return;
    const id = setTimeout(finishClose, 500);
    return () => clearTimeout(id);
  }, [closing, finishClose]);

  // Backdrop click only counts when the press started AND ended on the backdrop,
  // so dragging to select text inside the card doesn't close it.
  const downOnBackdrop = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      const opener = document.activeElement; // the Contact button, before focus moves
      dialog.showModal();
      const o = opener && opener !== document.body ? opener.getBoundingClientRect() : null;
      if (o) {
        // the card powers on from the button that opened it
        const r = dialog.getBoundingClientRect();
        dialog.style.setProperty('--dx', `${o.left + o.width / 2 - (r.left + r.width / 2)}px`);
        dialog.style.setProperty('--dy', `${o.top + o.height / 2 - (r.top + r.height / 2)}px`);
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  if (!isOpen) return null;

  const close = requestClose;

  const copyEmail = async () => {
    playClick();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      return;
    } catch {
      // Async clipboard blocked (permissions / embedded browser): try the legacy path.
    }

    // Created inside the dialog so the modal's focus trap doesn't reject it.
    const field = document.createElement('textarea');
    field.value = EMAIL;
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    dialogRef.current.appendChild(field);
    field.select();
    try {
      if (document.execCommand('copy')) setCopied(true);
    } finally {
      field.remove();
    }
  };

  const iconButton =
    'flex h-10 w-10 items-center justify-center border border-white/10 text-gray-400 transition-colors hover:border-fuchsia-400 hover:text-fuchsia-400 cursor-pointer';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="contact-title"
      onClose={onClose}
      data-closing={closing || undefined}
      // a press that lands on the <dialog> itself (not its children) is a backdrop press
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) requestClose();
      }}
      onAnimationEnd={(e) => {
        // ignore child animations (photoScan etc.)
        if (closing && e.target === e.currentTarget && e.animationName === 'contactOut') finishClose();
      }}
      data-lenis-prevent className="contact-dialog m-auto w-[calc(100vw-2rem)] max-w-[720px] max-h-[calc(100dvh-2rem)] overflow-y-auto bg-neutral-900 text-white border border-white/10 p-0 shadow-2xl cursor-auto"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
          contact.exe
        </span>
        <button
          type="button"
          onClick={() => {
            playClick();
            close();
          }}
          aria-label="Close contact card"
          className="flex items-center gap-2 transition-colors hover:text-white cursor-pointer"
        >
          esc <X size={14} />
        </button>
      </div>

      <div className="grid sm:grid-cols-[220px_1fr]">
        {/* Photo */}
        <div className="contact-photo relative aspect-[16/10] sm:aspect-auto sm:min-h-[300px] overflow-hidden bg-black group">
          <div
            className="absolute inset-0 bg-neutral-800"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 10%)' }}
          >
            <img
              src={profileImage}
              alt="Vrishank Warrier"
              className="h-full w-full object-cover object-top sm:object-center grayscale transition-all duration-700 group-hover:grayscale-0 scale-105 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          {/* one-off scanline sweep when the card opens */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-fuchsia-400/30 to-transparent animate-[photoScan_700ms_ease-out_1_both] motion-reduce:hidden" />
          <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-fuchsia-400/40" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-fuchsia-400/40" />
        </div>

        {/* Details + actions */}
        <div className="contact-details flex flex-col gap-5 p-5 sm:p-6">
          <div>
            <h2 id="contact-title" className="text-3xl font-black uppercase leading-none tracking-tighter">
              <span className="block">
                <HyperText text="Vrishank" triggerOnLoad />
              </span>
              <span className="block">
                <HyperText text="Warrier" triggerOnLoad />
              </span>
            </h2>
            <p className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-400">
              <span className="h-[2px] w-6 bg-fuchsia-400" />
              Software Engineer
            </p>
          </div>

          <div className="space-y-1 font-mono text-xs text-gray-400">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0" /> Mumbai · IST (UTC+5:30)
            </p>
            <p className="select-all break-all text-sm text-white">{EMAIL}</p>
          </div>

          <div className="space-y-2.5">
            {/* Primary + secondary */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center justify-center gap-2 bg-white px-3 py-3 text-xs font-black uppercase tracking-[0.15em] text-black transition-colors hover:bg-fuchsia-400 cursor-pointer"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span aria-live="polite">{copied ? 'Copied ✓' : 'Copy email'}</span>
              </button>
              <a
                href={`mailto:${EMAIL}`}
                onClick={playClick}
                className="flex items-center justify-center gap-1.5 border border-white/20 px-3 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-fuchsia-400 hover:text-fuchsia-400 cursor-pointer"
              >
                Email me <ArrowUpRight size={14} />
              </a>
            </div>

            <a
              href={resumeFile}
              download="Vrishank_Warrier_Resume.pdf"
              onClick={playClick}
              className="flex items-center justify-center gap-2 border border-white/10 px-3 py-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-300 transition-colors hover:border-fuchsia-400 hover:text-fuchsia-400 cursor-pointer"
            >
              <FileText size={16} /> Download resume
            </a>

            {/* Socials: small icon buttons */}
            <div className="flex gap-2.5 pt-1">
              <a
                href="https://github.com/shadovxw"
                target="_blank"
                rel="noreferrer"
                onClick={playClick}
                aria-label="GitHub"
                className={iconButton}
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/vrishank-warrier-ab529628a/"
                target="_blank"
                rel="noreferrer"
                onClick={playClick}
                aria-label="LinkedIn"
                className={iconButton}
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ContactModal;
