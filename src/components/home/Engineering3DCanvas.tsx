"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Engineering3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        setIsLoading(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      setIsLoading(false);
      return;
    }

    // Scene, Camera, Renderer
    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to blend into editorial layout

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(14, 10, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    currentMount.appendChild(renderer.domElement);

    // Engineering Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x245b85, 1.6); // Professional blue keylight
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10243a, 1.2);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // Group for all engineering components
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 1. Engineering Coordinate Grid Plane (Subtle Technical Grid)
    const gridHelper = new THREE.GridHelper(20, 20, 0x245b85, 0xd1d6da);
    gridHelper.position.y = -3;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    modelGroup.add(gridHelper);

    // 2. Chiller / Air Handling Unit (AHU) Block
    const ahuGeo = new THREE.BoxGeometry(4.5, 3.2, 3.2);
    const ahuEdges = new THREE.EdgesGeometry(ahuGeo);
    const ahuMaterial = new THREE.MeshStandardMaterial({
      color: 0x10243a,
      roughness: 0.3,
      metalness: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    const ahuMesh = new THREE.Mesh(ahuGeo, ahuMaterial);
    ahuMesh.position.set(-4, -1.4, 0);
    modelGroup.add(ahuMesh);

    const ahuWireframe = new THREE.LineSegments(
      ahuEdges,
      new THREE.LineBasicMaterial({ color: 0x6093b7, linewidth: 1.5 })
    );
    ahuMesh.add(ahuWireframe);

    // 3. Main Primary Supply Air Duct (Rectangular Galvanized Steel Duct)
    const mainDuctGeo = new THREE.BoxGeometry(7, 1.4, 1.4);
    const ductMaterial = new THREE.MeshStandardMaterial({
      color: 0x245b85,
      roughness: 0.2,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const mainDuct = new THREE.Mesh(mainDuctGeo, ductMaterial);
    mainDuct.position.set(1.5, -0.6, 0);
    modelGroup.add(mainDuct);

    const mainDuctEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mainDuctGeo),
      new THREE.LineBasicMaterial({ color: 0x9fbed3 })
    );
    mainDuct.add(mainDuctEdges);

    // 4. Vertical Duct Riser (Turning Upwards)
    const riserGeo = new THREE.CylinderGeometry(0.7, 0.7, 4.5, 24);
    const riserMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8f0f5,
      roughness: 0.4,
      metalness: 0.5,
      wireframe: false,
    });
    const riserDuct = new THREE.Mesh(riserGeo, riserMaterial);
    riserDuct.position.set(4.5, 1.6, 0);
    modelGroup.add(riserDuct);

    // 5. Branch Ducts & Diffuser Outlets (Feeding Zones)
    const branch1Geo = new THREE.BoxGeometry(4, 0.8, 0.8);
    const branch1 = new THREE.Mesh(branch1Geo, ductMaterial);
    branch1.position.set(2.5, 3.5, 2.2);
    branch1.rotation.y = Math.PI / 2;
    modelGroup.add(branch1);

    const branch2Geo = new THREE.BoxGeometry(3.5, 0.8, 0.8);
    const branch2 = new THREE.Mesh(branch2Geo, ductMaterial);
    branch2.position.set(2.5, 3.5, -2.2);
    branch2.rotation.y = Math.PI / 2;
    modelGroup.add(branch2);

    // 6. Airflow Velocity Streamlines (Moving Particles along Duct Path)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = -0.6 + (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      speeds[i] = 0.04 + Math.random() * 0.05;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x6093b7,
      size: 0.14,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    modelGroup.add(particles);

    setIsLoading(false);

    // Animation Loop
    let animationFrameId: number;
    let isMounted = true;

    const animate = () => {
      if (!isMounted) return;

      // Subtle slow architectural rotation
      modelGroup.rotation.y += 0.002;

      // Update Airflow Particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        array[i * 3] += speeds[i]; // Move along duct x-axis
        if (array[i * 3] > 4.5) {
          array[i * 3] = -2; // Reset at AHU outlet
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[440px] lg:h-[520px] bg-airtech-offwhite/50 border border-steel-200 rounded-sm overflow-hidden flex items-center justify-center">
      {/* Technical HUD Coordinate Metadata Header */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-[11px] font-mono text-steel-500 z-10 pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>AIRTECH 3D SIMULATION ENGINE • V2.4</span>
        </div>
        <div className="hidden sm:block">
          <span>MODEL: AHU-CHILLER-PRIMARY-DUCT-LAYOUT</span>
        </div>
      </div>

      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60 pointer-events-none"></div>

      {/* WebGL Canvas Container */}
      {webGlSupported ? (
        <div ref={mountRef} className="w-full h-full relative z-0" />
      ) : (
        /* Fallback if WebGL is unavailable */
        <div className="text-center p-8 z-10">
          <div className="text-sm font-semibold text-airtech-navy mb-1">
            HVAC Primary Airflow & Ducting Schematic
          </div>
          <p className="text-xs text-airtech-muted max-w-sm">
            Interactive 3D model paused. AIRTECH engineering calculations comply with ASHRAE 90.1, ASHRAE 170 and NBC 2016.
          </p>
        </div>
      )}

      {/* Technical Metric Overlay Badges */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 text-[10px] font-mono text-airtech-navy z-10 pointer-events-none">
        <span className="bg-white/90 border border-steel-300 px-2 py-1 rounded-sm shadow-subtle">
          STATIC PRESSURE: 450 Pa
        </span>
        <span className="bg-white/90 border border-steel-300 px-2 py-1 rounded-sm shadow-subtle">
          AIR VELOCITY: 7.2 m/s
        </span>
        <span className="bg-white/90 border border-steel-300 px-2 py-1 rounded-sm shadow-subtle">
          REYNOLDS NO: 184,200 (TURBULENT)
        </span>
      </div>
    </div>
  );
}
