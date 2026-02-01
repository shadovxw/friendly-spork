import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 30;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // === MAIN WIREFRAME SPHERE ===
        const sphereGeometry = new THREE.IcosahedronGeometry(8, 1);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // === ROTATING TORUS ===
        const torusGeometry = new THREE.TorusGeometry(12, 0.5, 16, 100);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.rotation.x = Math.PI / 4;
        scene.add(torus);

        // === OUTER WIREFRAME RING ===
        const ringGeometry = new THREE.TorusGeometry(16, 0.3, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        // === PARTICLE FIELD ===
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 800;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particleField = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleField);

        // === FLOATING CUBES ===
        const cubes = [];
        for (let i = 0; i < 8; i++) {
            const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            const cubeMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00ffff : 0x9d4edd,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.x = (Math.random() - 0.5) * 40;
            cube.position.y = (Math.random() - 0.5) * 40;
            cube.position.z = (Math.random() - 0.5) * 40;

            cube.rotation.x = Math.random() * Math.PI;
            cube.rotation.y = Math.random() * Math.PI;

            cubes.push(cube);
            scene.add(cube);
        }

        // === MOUSE MOVEMENT HANDLER ===
        const handleMouseMove = (event) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // === RESIZE HANDLER ===
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // === ANIMATION LOOP ===
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Rotate main sphere
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.003;

            // Rotate torus
            torus.rotation.z += 0.004;
            torus.rotation.y += 0.002;

            // Rotate outer ring
            ring.rotation.z += 0.001;

            // Rotate particle field
            particleField.rotation.y += 0.0005;

            // Animate floating cubes
            cubes.forEach((cube, i) => {
                cube.rotation.x += 0.005 + i * 0.001;
                cube.rotation.y += 0.003 + i * 0.001;

                // Floating motion
                cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
            });

            // Mouse parallax effect (subtle)
            const targetX = mouseRef.current.x * 2;
            const targetY = mouseRef.current.y * 2;

            camera.position.x += (targetX - camera.position.x) * 0.02;
            camera.position.y += (targetY - camera.position.y) * 0.02;

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);

            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }

            renderer.dispose();
            sphereGeometry.dispose();
            sphereMaterial.dispose();
            torusGeometry.dispose();
            torusMaterial.dispose();
            ringGeometry.dispose();
            ringMaterial.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();

            cubes.forEach(cube => {
                cube.geometry.dispose();
                cube.material.dispose();
            });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-[5]"
            style={{ pointerEvents: 'none' }}
        />
    );
};

export default ThreeBackground;
