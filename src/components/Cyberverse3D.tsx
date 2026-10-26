import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DistrictId, PlayerStats } from '../types/game';
import { sounds } from '../utils/audio';

// Reusable math helpers to avoid garbage collection inside animation loop
const _tempVec3A = new THREE.Vector3();
const _tempVec3B = new THREE.Vector3();

interface Cyberverse3DProps {
  player: PlayerStats;
  currentDistrict: DistrictId;
  onInteract: (triggerId: string, triggerType: 'mission' | 'boss' | 'terminal' | 'npc') => void;
  onOpenMap: () => void;
}

export const Cyberverse3D: React.FC<Cyberverse3DProps> = ({
  player,
  currentDistrict,
  onInteract,
  onOpenMap,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [nearbyTrigger, setNearbyTrigger] = useState<{ id: string; name: string; type: 'mission' | 'boss' | 'terminal' | 'npc'; distance: number } | null>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickStartRef = useRef<{ x: number; y: number } | null>(null);

  // References for live game loop without react re-renders
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const virtualInputRef = useRef<{ x: number; y: number; jump: boolean; sprint: boolean }>({
    x: 0,
    y: 0,
    jump: false,
    sprint: false,
  });
  const nearbyTriggerRef = useRef<{ id: string; name: string; type: 'mission' | 'boss' | 'terminal' | 'npc'; distance: number } | null>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' && nearbyTriggerRef.current) {
        sounds.playTerminalClick();
        onInteract(nearbyTriggerRef.current.id, nearbyTriggerRef.current.type);
      }
      if (e.key.toLowerCase() === 'm') {
        sounds.playTerminalClick();
        onOpenMap();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract, onOpenMap]);

  // Touch controls for mobile / virtual joystick
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    joystickStartRef.current = { x: touch.clientX, y: touch.clientY };
    setJoystickActive(true);
    setJoystickPos({ x: 0, y: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - joystickStartRef.current.x;
    const dy = touch.clientY - joystickStartRef.current.y;
    const maxDist = 45;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxDist);

    const nx = (Math.cos(angle) * clampedDist) / maxDist;
    const ny = (Math.sin(angle) * clampedDist) / maxDist;

    setJoystickPos({ x: nx * 30, y: ny * 30 });
    virtualInputRef.current.x = nx;
    virtualInputRef.current.y = ny;
  };

  const handleTouchEnd = () => {
    joystickStartRef.current = null;
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    virtualInputRef.current.x = 0;
    virtualInputRef.current.y = 0;
  };

  const triggerAction = useCallback(() => {
    if (nearbyTriggerRef.current) {
      sounds.playTerminalClick();
      onInteract(nearbyTriggerRef.current.id, nearbyTriggerRef.current.type);
    }
  }, [onInteract]);

  const triggerJump = useCallback(() => {
    virtualInputRef.current.jump = true;
    setTimeout(() => {
      virtualInputRef.current.jump = false;
    }, 150);
  }, []);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene and Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060914);
    scene.fog = new THREE.FogExp2(0x060914, 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    camera.position.set(0, 5, 8);

    // Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0x00f3ff, 0x11052c, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(15, 25, 12);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.camera.left = -30;
      keyLight.shadow.camera.right = 30;
      keyLight.shadow.camera.top = 30;
      keyLight.shadow.camera.bottom = -30;
    }
    scene.add(keyLight);

    // Neon Rim Lights
    const neonCyanLight = new THREE.PointLight(0x00f3ff, 3.5, 35);
    neonCyanLight.position.set(-10, 6, -10);
    scene.add(neonCyanLight);

    const neonMagentaLight = new THREE.PointLight(0xff007f, 3.5, 35);
    neonMagentaLight.position.set(10, 6, 10);
    scene.add(neonMagentaLight);

    // 5. Procedural Ground Canvas Texture (Neon Circuit Grid)
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 1024;
    groundCanvas.height = 1024;
    const gctx = groundCanvas.getContext('2d')!;
    gctx.fillStyle = '#050711';
    gctx.fillRect(0, 0, 1024, 1024);

    // Grid lines
    gctx.strokeStyle = '#0e1834';
    gctx.lineWidth = 2;
    for (let i = 0; i < 1024; i += 64) {
      gctx.beginPath();
      gctx.moveTo(i, 0);
      gctx.lineTo(i, 1024);
      gctx.stroke();

      gctx.beginPath();
      gctx.moveTo(0, i);
      gctx.lineTo(1024, i);
      gctx.stroke();
    }

    // Glowing Neon Circuit Traces
    gctx.strokeStyle = '#00f3ff';
    gctx.lineWidth = 3;
    gctx.shadowColor = '#00f3ff';
    gctx.shadowBlur = 10;
    for (let c = 0; c < 8; c++) {
      gctx.beginPath();
      const sx = Math.floor(Math.random() * 16) * 64;
      const sy = Math.floor(Math.random() * 16) * 64;
      gctx.moveTo(sx, sy);
      gctx.lineTo(sx + 128, sy);
      gctx.lineTo(sx + 128, sy + 128);
      gctx.stroke();
    }

    const groundTex = new THREE.CanvasTexture(groundCanvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(8, 8);
    groundTex.colorSpace = THREE.SRGBColorSpace;
    groundTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.35,
      metalness: 0.65,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Contact shadow plane for hero character
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const heroShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 1.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    heroShadow.rotation.x = -Math.PI / 2;
    heroShadow.position.y = 0.02;
    scene.add(heroShadow);

    // 6. BUILD PROCEDURAL 3-12 PART CYBER HERO CHARACTER (THREE.Group)
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, 0);

    // Material Library for Hero
    const suitMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(player.customization.suitColor || '#1e293b'),
      roughness: 0.45,
      metalness: 0.7,
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.85,
    });

    const visorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(player.customization.visorColor || '#00f3ff'),
      emissive: new THREE.Color(player.customization.visorColor || '#00f3ff'),
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.9,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(player.customization.accentColor || '#ff007f'),
      emissive: new THREE.Color(player.customization.accentColor || '#ff007f'),
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });

    // Torso / Pelvis
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.4), suitMat);
    torsoMesh.position.y = 1.25;
    torsoMesh.castShadow = !isSoftwareGl;
    heroGroup.add(torsoMesh);

    // Chest Plate
    const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.45, 0.44), armorMat);
    chestMesh.position.set(0, 1.35, 0.03);
    heroGroup.add(chestMesh);

    // Chest Reactor / Core
    const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 12), trimMat);
    coreMesh.rotation.x = Math.PI / 2;
    coreMesh.position.set(0, 1.38, 0.24);
    heroGroup.add(coreMesh);

    // Head
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), armorMat);
    headMesh.position.y = 1.95;
    heroGroup.add(headMesh);

    // Cyber Visor
    const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.14, 0.2), visorMat);
    visorMesh.position.set(0, 1.96, 0.18);
    heroGroup.add(visorMesh);

    // Neural Deck / Backpack (Overclock Core)
    const packMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.22), armorMat);
    packMesh.position.set(0, 1.35, -0.28);
    heroGroup.add(packMesh);

    // Thruster exhaust lights on backpack
    const ventL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.1, 8), visorMat);
    ventL.position.set(-0.16, 1.05, -0.32);
    heroGroup.add(ventL);

    const ventR = ventL.clone();
    ventR.position.x = 0.16;
    heroGroup.add(ventR);

    // Limbs with pivot joints for procedural walking animation
    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.22, 0.85, 0);
    const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.85, 0.26), suitMat);
    leftLegMesh.position.y = -0.42;
    leftLegGroup.add(leftLegMesh);
    const leftBootMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.38), armorMat);
    leftBootMesh.position.set(0, -0.78, 0.06);
    leftLegGroup.add(leftBootMesh);
    heroGroup.add(leftLegGroup);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.22, 0.85, 0);
    const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.85, 0.26), suitMat);
    rightLegMesh.position.y = -0.42;
    rightLegGroup.add(rightLegMesh);
    const rightBootMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.38), armorMat);
    rightBootMesh.position.set(0, -0.78, 0.06);
    rightLegGroup.add(rightBootMesh);
    heroGroup.add(rightLegGroup);

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.48, 1.55, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.75, 0.22), suitMat);
    leftArmMesh.position.y = -0.38;
    leftArmGroup.add(leftArmMesh);
    heroGroup.add(leftArmGroup);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.48, 1.55, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.75, 0.22), suitMat);
    rightArmMesh.position.y = -0.38;
    rightArmGroup.add(rightArmMesh);
    heroGroup.add(rightArmGroup);

    scene.add(heroGroup);

    // 7. BUILD BYTE (Sarcastic Companion Drone)
    const byteGroup = new THREE.Group();
    const byteBodyMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.9,
      roughness: 0.15,
    });
    const byteEyeMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00f3ff,
      emissiveIntensity: 2.5,
    });

    const byteSphere = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), byteBodyMat);
    byteGroup.add(byteSphere);

    // Ring around BYTE
    const byteRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.04, 8, 24),
      new THREE.MeshStandardMaterial({
        color: 0xff007f,
        emissive: 0xff007f,
        emissiveIntensity: 1.2,
      })
    );
    byteGroup.add(byteRing);

    // Eye / Optical Scanner
    const byteEye = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), byteEyeMat);
    byteEye.rotation.x = Math.PI / 2;
    byteEye.position.z = 0.28;
    byteGroup.add(byteEye);

    // Antenna
    const byteAntenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6),
      byteBodyMat
    );
    byteAntenna.position.y = 0.45;
    byteGroup.add(byteAntenna);

    const byteTip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), trimMat);
    byteTip.position.y = 0.62;
    byteGroup.add(byteTip);

    byteGroup.position.set(1.5, 2.5, 0);
    scene.add(byteGroup);

    // 8. PROCEDURAL CYBER CITY DISTRICTS, TOWERS, BILLBOARDS & TERMINALS
    const interactiveObjects: {
      mesh: THREE.Object3D;
      id: string;
      name: string;
      type: 'mission' | 'boss' | 'terminal' | 'npc';
      radius: number;
    }[] = [];

    // Helper: Create Glowing Holographic Billboard
    const createBillboard = (text: string, subtext: string, color: string, w: number, h: number) => {
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 512;
      bCanvas.height = 256;
      const bctx = bCanvas.getContext('2d')!;

      bctx.fillStyle = '#060a18';
      bctx.fillRect(0, 0, 512, 256);

      bctx.strokeStyle = color;
      bctx.lineWidth = 8;
      bctx.strokeRect(6, 6, 500, 244);

      bctx.font = 'bold 36px "Chakra Petch", monospace';
      bctx.fillStyle = color;
      bctx.shadowColor = color;
      bctx.shadowBlur = 12;
      bctx.textAlign = 'center';
      bctx.fillText(text, 256, 110);

      bctx.font = '22px "Fira Code", monospace';
      bctx.fillStyle = '#ffffff';
      bctx.shadowBlur = 4;
      bctx.fillText(subtext, 256, 170);

      const tex = new THREE.CanvasTexture(bCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.95 });
      const board = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      return board;
    };

    // Helper: Create Interactive Terminal Pod
    const createTerminalPod = (
      x: number,
      z: number,
      id: string,
      name: string,
      type: 'mission' | 'boss' | 'terminal' | 'npc',
      glowColor: number,
      title: string,
      subtitle: string
    ) => {
      const podGroup = new THREE.Group();
      podGroup.position.set(x, 0, z);

      // Base pedestal
      const baseMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.4, 0.4, 8),
        armorMat
      );
      baseMesh.position.y = 0.2;
      podGroup.add(baseMesh);

      // Screen console
      const column = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 1.4, 8),
        suitMat
      );
      column.position.y = 1.0;
      podGroup.add(column);

      // Hologram screen
      const screenMat = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
      });
      const screen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.1), screenMat);
      screen.position.set(0, 1.8, 0.2);
      screen.rotation.x = -0.2;
      podGroup.add(screen);

      // Vertical holographic light pillar
      const beamMat = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.25,
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.4, 14, 12), beamMat);
      beam.position.y = 7;
      podGroup.add(beam);

      // Billboard sign
      const billboard = createBillboard(
        title,
        subtitle,
        '#' + glowColor.toString(16).padStart(6, '0'),
        3.2,
        1.6
      );
      billboard.position.set(0, 3.2, 0);
      podGroup.add(billboard);

      scene.add(podGroup);
      interactiveObjects.push({
        mesh: podGroup,
        id,
        name,
        type,
        radius: 3.5,
      });
    };

    // Terminal 1: Neon Academy - SENTRY-7 Memory Repair (Variables)
    createTerminalPod(
      -8,
      -8,
      'neon-intro-vars',
      'Patrol Robot SENTRY-7',
      'mission',
      0x00f3ff,
      'MISSION: REPAIR ROBOT',
      'Variables & Types'
    );

    // Terminal 2: Neon Academy Gate Logic (Conditionals)
    createTerminalPod(
      8,
      -10,
      'neon-gate-logic',
      'Academy Gate Terminal',
      'mission',
      0x34d399,
      'GATEWAY PROTOCOL',
      'if / else Conditionals'
    );

    // Terminal 3: Boss Encounter - Semicolon Monster
    createTerminalPod(
      0,
      -22,
      'neon-boss-semicolon',
      'Arena: The Semicolon Monster',
      'boss',
      0xff007f,
      'BOSS: SEMICOLON MONSTER',
      'Syntax Errors & Bugs'
    );

    // Terminal 4: Linux Underground Terminal Console
    createTerminalPod(
      -18,
      6,
      'linux-ls-grep',
      'Linux Kernel Catacombs',
      'terminal',
      0xf59e0b,
      'LINUX UNDERGROUND',
      'grep, ls, chmod & bash'
    );

    // Terminal 5: Cyber Defense City - Phishing Detection
    createTerminalPod(
      18,
      6,
      'cyber-phishing-drill',
      'Cyber Defense Operations',
      'mission',
      0xef4444,
      'CYBER DEFENSE HQ',
      'Phishing & Zero Trust'
    );

    // Terminal 6: Python Port Delivery Bot
    createTerminalPod(
      -14,
      -16,
      'python-delivery-bot',
      'Dock Drone Automation',
      'mission',
      0x06b6d4,
      'PYTHON PORT DOCKS',
      'Loops & Manifest Lists'
    );

    // Terminal 7: Network Nexus Router
    createTerminalPod(
      14,
      -16,
      'network-routing-flow',
      'Nexus Backbone Router',
      'mission',
      0x8b5cf6,
      'NETWORK NEXUS',
      'Ports, Firewall & Subnets'
    );

    // Procedural Cyber Skyscraper Buildings surrounding the district hub
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x090e1f,
      roughness: 0.25,
      metalness: 0.8,
    });
    const windowMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const buildingPositions = [
      { x: -30, z: -30, w: 12, h: 45, d: 14 },
      { x: 30, z: -30, w: 14, h: 55, d: 14 },
      { x: -32, z: 20, w: 14, h: 40, d: 16 },
      { x: 32, z: 20, w: 16, h: 50, d: 14 },
      { x: 0, z: -40, w: 24, h: 65, d: 12 },
      { x: -25, z: -5, w: 8, h: 30, d: 10 },
      { x: 25, z: -5, w: 8, h: 32, d: 10 },
    ];

    buildingPositions.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.x, b.h / 2, b.z);

      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), buildingMat);
      bMesh.castShadow = !isSoftwareGl;
      bMesh.receiveShadow = !isSoftwareGl;
      bGroup.add(bMesh);

      // Glowing grid accent on building faces
      const gridAcc = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.1, b.h + 0.1, b.d + 0.1), windowMat);
      bGroup.add(gridAcc);

      scene.add(bGroup);
    });

    // Elevated Cyber Skyways and Hovering Traffic Speeders
    const skywayMat = new THREE.MeshStandardMaterial({
      color: 0x070b18,
      metalness: 0.9,
      roughness: 0.2,
    });
    const skywayRailMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.8,
    });

    const skywayMesh = new THREE.Mesh(new THREE.BoxGeometry(140, 1.2, 4.5), skywayMat);
    skywayMesh.position.set(0, 14, -25);
    const railL = new THREE.Mesh(new THREE.BoxGeometry(140, 0.4, 0.2), skywayRailMat);
    railL.position.set(0, 14.8, -27);
    const railR = new THREE.Mesh(new THREE.BoxGeometry(140, 0.4, 0.2), skywayRailMat);
    railR.position.set(0, 14.8, -23);
    scene.add(skywayMesh);
    scene.add(railL);
    scene.add(railR);

    // Hovering Speeders
    const speeders: { mesh: THREE.Group; speed: number; startX: number }[] = [];
    for (let s = 0; s < 4; s++) {
      const spGroup = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.6, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
      );
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.3, 1.0),
        new THREE.MeshBasicMaterial({ color: s % 2 === 0 ? 0x00f3ff : 0xff007f })
      );
      head.position.x = s % 2 === 0 ? 1.2 : -1.2;
      spGroup.add(body);
      spGroup.add(head);

      const zOffset = s % 2 === 0 ? -26 : -24;
      spGroup.position.set((s - 2) * 35, 14.8, zOffset);
      scene.add(spGroup);
      speeders.push({
        mesh: spGroup,
        speed: (s % 2 === 0 ? 1 : -1) * (14 + s * 3),
        startX: (s - 2) * 35,
      });
    }

    // Floating Data Particle Cloud (Cyber Rain)
    const particleCount = isSoftwareGl ? 80 : 300;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 80;
      particlePositions[p * 3 + 1] = Math.random() * 20;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 9. GAME LOOP STATE
    const clock = new THREE.Clock();
    let heroVelocityY = 0;
    let isGrounded = true;
    let walkCycle = 0;
    let frameId = 0;

    // Movement & Damping
    const playerPos = new THREE.Vector3(0, 0, 0);
    const cameraTarget = new THREE.Vector3(0, 1.5, 0);
    const cameraOffset = new THREE.Vector3(0, 5, 8.5);

    // Pacing helper for software WebGL
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Read Input
      let moveX = 0;
      let moveZ = 0;
      const keys = keysRef.current;
      const vInput = virtualInputRef.current;

      if (keys['w'] || keys['arrowup']) moveZ -= 1;
      if (keys['s'] || keys['arrowdown']) moveZ += 1;
      if (keys['a'] || keys['arrowleft']) moveX -= 1;
      if (keys['d'] || keys['arrowright']) moveX += 1;

      // Add touch joystick input
      if (Math.abs(vInput.x) > 0.05 || Math.abs(vInput.y) > 0.05) {
        moveX += vInput.x;
        moveZ += vInput.y;
      }

      const inputLen = Math.hypot(moveX, moveZ);
      const isMoving = inputLen > 0.1;
      const isSprinting = keys['shift'] || vInput.sprint;
      const moveSpeed = isSprinting ? 9.5 : 5.8;

      if (isMoving) {
        const normX = moveX / inputLen;
        const normZ = moveZ / inputLen;
        playerPos.x += normX * moveSpeed * delta;
        playerPos.z += normZ * moveSpeed * delta;

        // Keep inside bounds
        playerPos.x = THREE.MathUtils.clamp(playerPos.x, -36, 36);
        playerPos.z = THREE.MathUtils.clamp(playerPos.z, -36, 36);

        // Rotate character towards movement direction
        const targetAngle = Math.atan2(normX, normZ);
        heroGroup.rotation.y = THREE.MathUtils.damp(
          heroGroup.rotation.y,
          targetAngle,
          14,
          delta
        );

        // Procedural Walk / Run Animation
        walkCycle += delta * (isSprinting ? 16 : 10);
        leftLegGroup.rotation.x = Math.sin(walkCycle) * 0.65;
        rightLegGroup.rotation.x = -Math.sin(walkCycle) * 0.65;
        leftArmGroup.rotation.x = -Math.sin(walkCycle) * 0.65;
        rightArmGroup.rotation.x = Math.sin(walkCycle) * 0.65;
        torsoMesh.position.y = 1.25 + Math.abs(Math.sin(walkCycle * 2)) * 0.08;
      } else {
        // Return limbs to idle
        leftLegGroup.rotation.x = THREE.MathUtils.damp(leftLegGroup.rotation.x, 0, 10, delta);
        rightLegGroup.rotation.x = THREE.MathUtils.damp(rightLegGroup.rotation.x, 0, 10, delta);
        leftArmGroup.rotation.x = THREE.MathUtils.damp(leftArmGroup.rotation.x, 0, 10, delta);
        rightArmGroup.rotation.x = THREE.MathUtils.damp(rightArmGroup.rotation.x, 0, 10, delta);
        torsoMesh.position.y = 1.25;
      }

      // Jump / Gravity Physics
      const wantsJump = keys[' '] || vInput.jump;
      if (wantsJump && isGrounded) {
        heroVelocityY = 7.0;
        isGrounded = false;
        sounds.playLaserShot();
      }

      if (!isGrounded) {
        playerPos.y += heroVelocityY * delta;
        heroVelocityY -= 18.0 * delta; // Gravity
        if (playerPos.y <= 0) {
          playerPos.y = 0;
          heroVelocityY = 0;
          isGrounded = true;
        }
      }

      // Update hero position and contact shadow
      heroGroup.position.copy(playerPos);
      heroShadow.position.x = playerPos.x;
      heroShadow.position.z = playerPos.z;

      // Animate BYTE (Sarcastic companion drone floating around player)
      const byteTargetX = playerPos.x + Math.sin(time * 1.5) * 1.6 + 1.2;
      const byteTargetY = playerPos.y + 2.4 + Math.sin(time * 3) * 0.25;
      const byteTargetZ = playerPos.z + Math.cos(time * 1.5) * 1.6 + 0.8;

      byteGroup.position.x = THREE.MathUtils.damp(byteGroup.position.x, byteTargetX, 8, delta);
      byteGroup.position.y = THREE.MathUtils.damp(byteGroup.position.y, byteTargetY, 8, delta);
      byteGroup.position.z = THREE.MathUtils.damp(byteGroup.position.z, byteTargetZ, 8, delta);

      byteRing.rotation.x += delta * 1.5;
      byteRing.rotation.y += delta * 2.0;
      byteGroup.lookAt(playerPos.x, playerPos.y + 1.6, playerPos.z);

      // Smooth Camera Follow with Damping
      cameraTarget.set(playerPos.x, playerPos.y + 1.6, playerPos.z);
      _tempVec3A.copy(cameraTarget).add(cameraOffset);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _tempVec3A.x, 7, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _tempVec3A.y, 7, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _tempVec3A.z, 7, delta);
      camera.lookAt(cameraTarget);

      // Animate Cyber Rain Particles
      const pAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const pArray = pAttr.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pArray[i] -= delta * 3.5;
        if (pArray[i] < 0) {
          pArray[i] = 18;
        }
      }
      pAttr.needsUpdate = true;

      // Animate Skyway Hovering Speeders
      speeders.forEach((sp) => {
        sp.mesh.position.x += sp.speed * delta;
        if (sp.speed > 0 && sp.mesh.position.x > 70) {
          sp.mesh.position.x = -70;
        } else if (sp.speed < 0 && sp.mesh.position.x < -70) {
          sp.mesh.position.x = 70;
        }
      });

      // Proximity Trigger Detection for Interactive Pods
      let closestTrigger: { id: string; name: string; type: 'mission' | 'boss' | 'terminal' | 'npc'; distance: number } | null = null;
      let minDistance = Infinity;

      interactiveObjects.forEach((obj) => {
        const dist = playerPos.distanceTo(obj.mesh.position);
        if (dist <= obj.radius && dist < minDistance) {
          minDistance = dist;
          closestTrigger = {
            id: obj.id,
            name: obj.name,
            type: obj.type,
            distance: dist,
          };
        }
      });

      if (closestTrigger !== nearbyTriggerRef.current) {
        nearbyTriggerRef.current = closestTrigger;
        setNearbyTrigger(closestTrigger);
      }

      // Render Scene
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Start loop
    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      groundTex.dispose();
      shadowTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [player.customization, currentDistrict]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#060914]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Cyber Scanlines Overlay */}
      <div className="cyber-scanlines absolute inset-0 pointer-events-none opacity-40" />

      {/* Interactive Trigger Prompt HUD */}
      {nearbyTrigger && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="flex items-center gap-3 bg-[#0d152bbd] border-2 border-[#00f3ff] rounded-xl px-5 py-3 shadow-[0_0_20px_rgba(0,243,255,0.4)] backdrop-blur-md animate-bounce">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00f3ff] text-black font-cyber font-bold text-sm">
              E
            </span>
            <div>
              <p className="text-xs uppercase font-cyber tracking-wider text-[#00f3ff]">
                Nearby Interaction
              </p>
              <p className="font-cyber font-bold text-white text-base">
                {nearbyTrigger.name}
              </p>
            </div>
            <button
              onClick={triggerAction}
              className="ml-2 px-3 py-1.5 rounded-lg bg-[#00f3ff] text-black font-cyber font-bold text-xs uppercase hover:bg-white active:scale-95 transition-all shadow-[0_0_10px_rgba(0,243,255,0.5)]"
            >
              Open
            </button>
          </div>
        </div>
      )}

      {/* Android Mobile Touch Controls: Analog Joystick & Action Buttons */}
      <div className="absolute bottom-28 left-6 z-20 md:hidden pointer-events-auto">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-28 h-28 rounded-full border-2 border-[#00f3ff]/40 bg-[#070d1e]/80 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.2)]"
        >
          <div
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              transition: joystickActive ? 'none' : 'transform 0.15s ease-out',
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00f3ff] to-[#0077ff] border-2 border-white shadow-[0_0_10px_#00f3ff]"
          />
          <div className="absolute text-[10px] uppercase font-cyber tracking-widest text-[#00f3ff]/60 pointer-events-none">
            MOVE
          </div>
        </div>
      </div>

      {/* Android Mobile Action Buttons (Right side: Jump & Interact) */}
      <div className="absolute bottom-28 right-6 z-20 md:hidden flex flex-col gap-3 pointer-events-auto">
        {nearbyTrigger && (
          <button
            onClick={triggerAction}
            className="w-14 h-14 rounded-full bg-[#00f3ff] text-black border-2 border-white font-cyber font-bold text-xs flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.6)] active:scale-90 transition-transform"
          >
            <span>ACTION</span>
            <span className="text-[9px]">TAP</span>
          </button>
        )}
        <button
          onClick={triggerJump}
          className="w-14 h-14 rounded-full bg-[#ff007f] text-white border-2 border-white font-cyber font-bold text-xs flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.6)] active:scale-90 transition-transform"
        >
          <span>JUMP</span>
          <span className="text-[9px]">SPACE</span>
        </button>
      </div>

      {/* Desktop Controls Legend (Subtle top right) */}
      <div className="hidden md:flex absolute top-5 right-5 z-20 flex-col gap-1 bg-[#070d1ebd] border border-[#1e294b] rounded-lg p-2.5 text-[11px] font-cyber text-slate-300">
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-[#1e294b] text-[#00f3ff] font-bold">WASD</kbd>
          <span>Move Cyber Guardian</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-[#1e294b] text-[#00f3ff] font-bold">SPACE</kbd>
          <span>Jump</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-[#1e294b] text-[#00f3ff] font-bold">E</kbd>
          <span>Interact with Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-[#1e294b] text-[#00f3ff] font-bold">M</kbd>
          <span>Cyberverse Map</span>
        </div>
      </div>
    </div>
  );
};
