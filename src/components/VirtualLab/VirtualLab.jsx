

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Matter from "matter-js";
import {
  ChevronRight,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Download,
  X,
  Plus,
  Minus,
} from "lucide-react";

// Experiment definitions
const experiments = [
  {
    id: "projectile-motion",
    name: "Projectile Motion",
    icon: "🎯",
    description: "Explore the path of an object thrown into the air",
    color: "from-[#E83B00] to-[#FF7349]",
    controlParams: [
      {
        id: "angle",
        name: "Launch Angle",
        min: 0,
        max: 90,
        default: 45,
        unit: "°",
      },
      {
        id: "velocity",
        name: "Initial Velocity",
        min: 1,
        max: 50,
        default: 20,
        unit: "m/s",
      },
      {
        id: "gravity",
        name: "Gravity",
        min: 1,
        max: 20,
        default: 9.8,
        unit: "m/s²",
      },
      { id: "mass", name: "Mass", min: 1, max: 10, default: 5, unit: "kg" },
    ],
    setup: (scene, params, canvas) => {
      // Create ground
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x90ee90,
        roughness: 0.8,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      ground.receiveShadow = true;
      scene.add(ground);

      // Add grid
      const grid = new THREE.GridHelper(100, 100, 0x000000, 0x888888);
      grid.position.y = 0.01;
      scene.add(grid);

      // Add projectile
      const radius = Math.cbrt((3 * params.mass) / (4 * Math.PI));
      const ballGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xe83b00,
        roughness: 0.5,
        metalness: 0.2,
      });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.set(0, radius, 0);
      ball.castShadow = true;
      scene.add(ball);

      // Add directional arrow
      const arrowDirection = new THREE.Vector3(
        Math.cos((params.angle * Math.PI) / 180) * 5,
        Math.sin((params.angle * Math.PI) / 180) * 5,
        0
      );
      const arrowOrigin = new THREE.Vector3(0, radius, 0);
      const arrowHelper = new THREE.ArrowHelper(
        arrowDirection.normalize(),
        arrowOrigin,
        5,
        0xff7349,
        1,
        0.5
      );
      scene.add(arrowHelper);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(20, 30, 20);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.left = -50;
      directionalLight.shadow.camera.right = 50;
      directionalLight.shadow.camera.top = 50;
      directionalLight.shadow.camera.bottom = -50;
      scene.add(directionalLight);

      // Return objects that will be manipulated during simulation
      return {
        ball,
        arrowHelper,
        initialPosition: { x: 0, y: radius, z: 0 },
        trailPoints: [],
        trail: null,
      };
    },
    simulate: (objects, params, time, isRunning, resetTrail) => {
      if (!isRunning) return false;

      const { ball, arrowHelper, initialPosition, trailPoints } = objects;

      // Calculate position based on projectile motion equations
      const angle = (params.angle * Math.PI) / 180;
      const v0 = params.velocity;
      const g = params.gravity;

      const x = v0 * Math.cos(angle) * time;
      const y =
        initialPosition.y + v0 * Math.sin(angle) * time - 0.5 * g * time * time;

      // Update ball position if above ground
      if (y > initialPosition.y) {
        ball.position.x = x;
        ball.position.y = y;

        // Add point to trail
        trailPoints.push(new THREE.Vector3(x, y, 0));

        // Update trail visualization
        if (resetTrail) {
          // Remove old trail if it exists
          if (objects.trail) {
            objects.scene.remove(objects.trail);
          }
          trailPoints.length = 0;
        }

        if (trailPoints.length > 1) {
          // Remove old trail
          if (objects.trail) {
            objects.scene.remove(objects.trail);
          }

          // Create new trail
          const trailGeometry = new THREE.BufferGeometry().setFromPoints(
            trailPoints
          );
          const trailMaterial = new THREE.LineBasicMaterial({
            color: 0xff7349,
          });
          objects.trail = new THREE.Line(trailGeometry, trailMaterial);
          objects.scene.add(objects.trail);
        }
      } else if (trailPoints.length > 0) {
        // Ball has hit the ground, stop updating
        return true; // Return true to indicate simulation should stop
      }

      return false;
    },
    reset: (objects, params) => {
      const { ball, initialPosition, trailPoints } = objects;

      // Reset ball position
      ball.position.x = initialPosition.x;
      ball.position.y = initialPosition.y;
      ball.position.z = initialPosition.z;

      // Clear trail
      trailPoints.length = 0;
      if (objects.trail) {
        objects.scene.remove(objects.trail);
        objects.trail = null;
      }

      // Update arrow direction
      const arrowDirection = new THREE.Vector3(
        Math.cos((params.angle * Math.PI) / 180) * 5,
        Math.sin((params.angle * Math.PI) / 180) * 5,
        0
      );
      objects.arrowHelper.setDirection(arrowDirection.normalize());
    },
  },
  {
    id: "pendulum",
    name: "Pendulum Motion",
    icon: "🔄",
    description: "Study the movement of a simple pendulum",
    color: "from-[#0066CC] to-[#0099FF]",
    controlParams: [
      {
        id: "length",
        name: "String Length",
        min: 1,
        max: 20,
        default: 10,
        unit: "m",
      },
      { id: "mass", name: "Mass", min: 1, max: 10, default: 5, unit: "kg" },
      {
        id: "angle",
        name: "Initial Angle",
        min: 0,
        max: 90,
        default: 30,
        unit: "°",
      },
      {
        id: "gravity",
        name: "Gravity",
        min: 1,
        max: 20,
        default: 9.8,
        unit: "m/s²",
      },
    ],
    setup: (scene, params) => {
      // Add ceiling
      const ceilingGeometry = new THREE.BoxGeometry(20, 0.5, 5);
      const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
      });
      const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
      ceiling.position.y = 15;
      ceiling.castShadow = true;
      ceiling.receiveShadow = true;
      scene.add(ceiling);

      // Add string
      const stringGeometry = new THREE.CylinderGeometry(
        0.05,
        0.05,
        params.length,
        8
      );
      stringGeometry.translate(0, -params.length / 2, 0);
      const stringMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
      });
      const string = new THREE.Mesh(stringGeometry, stringMaterial);
      string.position.y = 15;
      string.castShadow = true;

      // Create pivot point for rotation
      const pivot = new THREE.Object3D();
      pivot.position.y = 15;
      scene.add(pivot);

      // Add string to pivot
      pivot.add(string);

      // Add bob
      const radius = Math.cbrt((3 * params.mass) / (4 * Math.PI));
      const bobGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const bobMaterial = new THREE.MeshStandardMaterial({
        color: 0x0066cc,
        roughness: 0.3,
        metalness: 0.6,
      });
      const bob = new THREE.Mesh(bobGeometry, bobMaterial);
      bob.castShadow = true;
      bob.position.y = -params.length;

      // Add bob to string (through pivot)
      string.add(bob);

      // Set initial angle
      pivot.rotation.z = (params.angle * Math.PI) / 180;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(20, 30, 20);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      return {
        pivot,
        string,
        bob,
        initialAngle: (params.angle * Math.PI) / 180,
        trailPoints: [],
        trail: null,
      };
    },
    simulate: (objects, params, time, isRunning, resetTrail) => {
      if (!isRunning) return false;

      const { pivot, bob, string, initialAngle, trailPoints } = objects;

      // Calculate angle based on pendulum equation
      const L = params.length;
      const g = params.gravity;
      const period = 2 * Math.PI * Math.sqrt(L / g);
      const angle = initialAngle * Math.cos(Math.sqrt(g / L) * time);

      // Update pivot rotation
      pivot.rotation.z = angle;

      // Calculate bob position for trail
      const bobX = L * Math.sin(angle);
      const bobY = 15 - L * Math.cos(angle);

      // Add point to trail
      if (time % 0.1 < 0.05) {
        // Add points at intervals to avoid too many points
        trailPoints.push(new THREE.Vector3(bobX, bobY, 0));
      }

      // Update trail visualization
      if (resetTrail) {
        // Remove old trail if it exists
        if (objects.trail) {
          objects.scene.remove(objects.trail);
        }
        trailPoints.length = 0;
      }

      if (trailPoints.length > 1) {
        // Remove old trail
        if (objects.trail) {
          objects.scene.remove(objects.trail);
        }

        // Create new trail
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(
          trailPoints
        );
        const trailMaterial = new THREE.LineBasicMaterial({ color: 0x0099ff });
        objects.trail = new THREE.Line(trailGeometry, trailMaterial);
        objects.scene.add(objects.trail);
      }

      return false;
    },
    reset: (objects, params) => {
      const { pivot, trailPoints, string, bob } = objects;

      // Reset pendulum angle
      pivot.rotation.z = (params.angle * Math.PI) / 180;

      // Update the string length
      string.scale.y = params.length / string.geometry.parameters.height;

      // Position bob at the end of the string
      bob.position.y = -params.length;

      // Clear trail
      trailPoints.length = 0;
      if (objects.trail) {
        objects.scene.remove(objects.trail);
        objects.trail = null;
      }
    },
  },
  {
    id: "circuit",
    name: "Electric Circuit",
    icon: "⚡",
    description: "Analyze current and voltage in a simple circuit",
    color: "from-[#FF4500] to-[#FF8C00]",
    controlParams: [
      {
        id: "voltage",
        name: "Battery Voltage",
        min: 1,
        max: 24,
        default: 12,
        unit: "V",
      },
      {
        id: "resistance1",
        name: "Resistor 1",
        min: 1,
        max: 100,
        default: 10,
        unit: "Ω",
      },
      {
        id: "resistance2",
        name: "Resistor 2",
        min: 1,
        max: 100,
        default: 20,
        unit: "Ω",
      },
      {
        id: "resistance3",
        name: "Resistor 3",
        min: 1,
        max: 100,
        default: 30,
        unit: "Ω",
      },
    ],
    setup: (scene, params) => {
      // This experiment uses 2D rendering with Three.js

      // Create the circuit board
      const boardGeometry = new THREE.PlaneGeometry(20, 15);
      const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2,
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      board.rotation.x = -Math.PI / 2;
      board.position.y = 0;
      scene.add(board);

      // Create components using basic shapes
      // Battery
      const batteryGeometry = new THREE.BoxGeometry(3, 1, 1.5);
      const batteryMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500,
      });
      const battery = new THREE.Mesh(batteryGeometry, batteryMaterial);
      battery.position.set(-6, 0.75, 0);
      scene.add(battery);

      // Resistors
      const createResistor = (x, z, value) => {
        const resistorGroup = new THREE.Group();

        const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: 0xa0522d,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        resistorGroup.add(body);

        // Add color bands based on resistance value
        const bandWidth = 0.1;
        const colors = [
          0x000000, 0x8b4513, 0xff0000, 0xffa500, 0xffff00, 0x008000, 0x0000ff,
          0x8a2be2, 0x808080, 0xffffff,
        ];

        // First digit
        const firstDigit = Math.floor(value / 10);
        const band1Geometry = new THREE.BoxGeometry(bandWidth, 0.55, 0.55);
        const band1Material = new THREE.MeshStandardMaterial({
          color: colors[firstDigit] || 0x000000,
        });
        const band1 = new THREE.Mesh(band1Geometry, band1Material);
        band1.position.x = -0.7;
        resistorGroup.add(band1);

        // Second digit
        const secondDigit = value % 10;
        const band2Geometry = new THREE.BoxGeometry(bandWidth, 0.55, 0.55);
        const band2Material = new THREE.MeshStandardMaterial({
          color: colors[secondDigit] || 0x000000,
        });
        const band2 = new THREE.Mesh(band2Geometry, band2Material);
        band2.position.x = -0.4;
        resistorGroup.add(band2);

        // Multiplier (always 1 in this simple case)
        const band3Geometry = new THREE.BoxGeometry(bandWidth, 0.55, 0.55);
        const band3Material = new THREE.MeshStandardMaterial({
          color: 0x000000,
        });
        const band3 = new THREE.Mesh(band3Geometry, band3Material);
        band3.position.x = -0.1;
        resistorGroup.add(band3);

        // Tolerance (gold = 5%)
        const band4Geometry = new THREE.BoxGeometry(bandWidth, 0.55, 0.55);
        const band4Material = new THREE.MeshStandardMaterial({
          color: 0xffd700,
        });
        const band4 = new THREE.Mesh(band4Geometry, band4Material);
        band4.position.x = 0.7;
        resistorGroup.add(band4);

        resistorGroup.position.set(x, 0.75, z);
        scene.add(resistorGroup);

        return resistorGroup;
      };

      const resistor1 = createResistor(0, -3, params.resistance1);
      const resistor2 = createResistor(0, 0, params.resistance2);
      const resistor3 = createResistor(0, 3, params.resistance3);

      // Wires using line segments
      const wiresMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

      // Horizontal wires
      const createHorizontalWire = (x1, x2, z, y = 0.75) => {
        const points = [
          new THREE.Vector3(x1, y, z),
          new THREE.Vector3(x2, y, z),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, wiresMaterial);
        scene.add(line);
        return line;
      };

      // Vertical wires
      const createVerticalWire = (z1, z2, x, y = 0.75) => {
        const points = [
          new THREE.Vector3(x, y, z1),
          new THREE.Vector3(x, y, z2),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, wiresMaterial);
        scene.add(line);
        return line;
      };

      // Create all wires
      const wires = [];
      wires.push(createHorizontalWire(-6, -2, -3)); // Battery to junction
      wires.push(createHorizontalWire(-2, -2, 0)); // Junction vertical
      wires.push(createHorizontalWire(-2, -2, 3)); // Junction vertical
      wires.push(createVerticalWire(-3, 3, -2)); // Left vertical wire

      wires.push(createHorizontalWire(-2, -1, -3)); // To resistor 1
      wires.push(createHorizontalWire(-2, -1, 0)); // To resistor 2
      wires.push(createHorizontalWire(-2, -1, 3)); // To resistor 3

      wires.push(createHorizontalWire(1, 2, -3)); // From resistor 1
      wires.push(createHorizontalWire(1, 2, 0)); // From resistor 2
      wires.push(createHorizontalWire(1, 2, 3)); // From resistor 3

      wires.push(createVerticalWire(-3, 3, 2)); // Right vertical wire

      wires.push(createHorizontalWire(2, 6, 0)); // Back to battery

      // Current indicators (arrows)
      const createCurrentArrow = (position, direction) => {
        const arrowHelper = new THREE.ArrowHelper(
          direction.normalize(),
          position,
          1,
          0xffff00,
          0.3,
          0.2
        );
        scene.add(arrowHelper);
        return arrowHelper;
      };

      const currentArrows = [];
      currentArrows.push(
        createCurrentArrow(
          new THREE.Vector3(-4, 0.75, -3),
          new THREE.Vector3(1, 0, 0)
        )
      );

      currentArrows.push(
        createCurrentArrow(
          new THREE.Vector3(-0.5, 0.75, -3),
          new THREE.Vector3(1, 0, 0)
        )
      );

      currentArrows.push(
        createCurrentArrow(
          new THREE.Vector3(-0.5, 0.75, 0),
          new THREE.Vector3(1, 0, 0)
        )
      );

      currentArrows.push(
        createCurrentArrow(
          new THREE.Vector3(-0.5, 0.75, 3),
          new THREE.Vector3(1, 0, 0)
        )
      );

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Create text for measurements
      const createMeasurementText = (text, position) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 256;
        canvas.height = 128;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "24px Arial";
        context.fillStyle = "#FFFFFF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
        });

        const geometry = new THREE.PlaneGeometry(3, 1.5);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = Math.PI;

        scene.add(mesh);
        return { mesh, canvas, context };
      };

      // Create voltage and current displays
      const voltageDisplay = createMeasurementText(
        `${params.voltage}V`,
        new THREE.Vector3(-6, 0.1, -2)
      );

      const currentDisplays = [
        createMeasurementText("0.0A", new THREE.Vector3(0, 0.1, -4.5)),
        createMeasurementText("0.0A", new THREE.Vector3(0, 0.1, -1.5)),
        createMeasurementText("0.0A", new THREE.Vector3(0, 0.1, 1.5)),
      ];

      return {
        battery,
        resistors: [resistor1, resistor2, resistor3],
        currentArrows,
        voltageDisplay,
        currentDisplays,
        wires,
      };
    },
    simulate: (objects, params, time, isRunning) => {
      if (!isRunning) return false;

      // Calculate circuit quantities
      const batteryVoltage = params.voltage;
      const r1 = params.resistance1;
      const r2 = params.resistance2;
      const r3 = params.resistance3;

      // Parallel circuit - calculate total resistance
      const totalResistance = 1 / (1 / r1 + 1 / r2 + 1 / r3);

      // Calculate total current
      const totalCurrent = batteryVoltage / totalResistance;

      // Calculate individual branch currents
      const current1 = batteryVoltage / r1;
      const current2 = batteryVoltage / r2;
      const current3 = batteryVoltage / r3;

      // Update current arrows - scale them based on current
      objects.currentArrows[1].setLength(0.5 + current1 / 10);
      objects.currentArrows[2].setLength(0.5 + current2 / 10);
      objects.currentArrows[3].setLength(0.5 + current3 / 10);

      // Update current displays
      updateTextDisplay(objects.currentDisplays[0], `${current1.toFixed(2)}A`);
      updateTextDisplay(objects.currentDisplays[1], `${current2.toFixed(2)}A`);
      updateTextDisplay(objects.currentDisplays[2], `${current3.toFixed(2)}A`);

      // Update voltage display
      updateTextDisplay(objects.voltageDisplay, `${batteryVoltage}V`);

      // Helper function to update text displays
      function updateTextDisplay(display, text) {
        const { context, canvas } = display;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "24px Arial";
        context.fillStyle = "#FFFFFF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        display.mesh.material.map.needsUpdate = true;
      }

      return false;
    },
    reset: (objects, params) => {
      // Update resistor values
      updateTextDisplay(objects.voltageDisplay, `${params.voltage}V`);
      updateTextDisplay(objects.currentDisplays[0], "0.0A");
      updateTextDisplay(objects.currentDisplays[1], "0.0A");
      updateTextDisplay(objects.currentDisplays[2], "0.0A");

      // Reset arrow sizes
      objects.currentArrows.forEach((arrow) => {
        arrow.setLength(1);
      });

      // Helper function to update text displays
      function updateTextDisplay(display, text) {
        const { context, canvas } = display;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "24px Arial";
        context.fillStyle = "#FFFFFF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        display.mesh.material.map.needsUpdate = true;
      }
    },
  },
];

const VirtualPhysicsLab = () => {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [params, setParams] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0);
  const [showExperimentDialog, setShowExperimentDialog] = useState(false);

  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const experimentObjectsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const simulationSpeedRef = useRef(1.0); // Simulation speed multiplier

  // Initialize Three.js scene
  useEffect(() => {
    if (!selectedExperiment || !canvasRef.current) return;

    console.log("Initializing experiment:", selectedExperiment.name);

    // Setup Three.js
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60, // Field of view
      canvas.clientWidth / canvas.clientHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    camera.position.set(10, 15, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0xf0f4f8);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Initialize experiment
    const experimentObjects = selectedExperiment.setup(scene, params, canvas);
    experimentObjects.scene = scene; // Add scene to objects for reference
    experimentObjectsRef.current = experimentObjects;

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }

      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Update simulation time
      if (isSimulating) {
        const now = Date.now();
        const deltaTime = (now - lastTimeRef.current) / 1000; // Convert to seconds
        lastTimeRef.current = now;

        // Update simulation time with speed multiplier
        setTime((prevTime) => {
          const newTime = prevTime + deltaTime * simulationSpeedRef.current;

          // Run simulation step
          if (experimentObjectsRef.current && selectedExperiment) {
            const shouldStop = selectedExperiment.simulate(
              experimentObjectsRef.current,
              params,
              newTime,
              isSimulating,
              false
            );

            // If simulation indicates it should stop
            if (shouldStop) {
              setIsSimulating(false);
            }
          }

          return newTime;
        });
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Clean up Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Clean up scene
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [selectedExperiment, params]);

  const handleExperimentSelect = (experiment) => {
    setSelectedExperiment(experiment);
    setShowExperimentDialog(true);

    // Initialize parameters with default values
    const initialParams = {};
    experiment.controlParams.forEach((param) => {
      initialParams[param.id] = param.default;
    });

    setParams(initialParams);
    setTime(0);
    setIsSimulating(false);
  };

  const handleStartStop = () => {
    if (!isSimulating) {
      // Starting simulation
      lastTimeRef.current = Date.now();
    }
    setIsSimulating(!isSimulating);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setTime(0);

    // Reset experiment
    if (experimentObjectsRef.current && selectedExperiment) {
      selectedExperiment.reset(experimentObjectsRef.current, params);

      // Run simulation with time=0 to update visuals
      selectedExperiment.simulate(
        experimentObjectsRef.current,
        params,
        0,
        false,
        true // Reset trail
      );
    }
  };

  const handleParamChange = (paramId, value) => {
    setParams((prev) => ({
      ...prev,
      [paramId]: value,
    }));

    // Reset simulation when parameters change
    handleReset();
  };

  const handleCloseDialog = () => {
    setShowExperimentDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E83B00] to-[#FF7349] mb-2">
          Virtual Physics Lab
        </h1>
        <p className="text-gray-600">
          Select an experiment to explore physics concepts through interactive
          simulations
        </p>
      </div>

      {/* Experiment Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => (
          <div
            key={experiment.id}
            onClick={() => handleExperimentSelect(experiment)}
            className={`p-6 rounded-lg shadow-md cursor-pointer transform hover:scale-102 transition-all duration-300 
              bg-white hover:shadow-xl ${
                selectedExperiment?.id === experiment.id
                  ? "ring-2 ring-[#E83B00]"
                  : ""
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{experiment.icon}</span>
                <h2 className="text-lg font-semibold text-gray-800">
                  {experiment.name}
                </h2>
              </div>
              <ChevronRight className="text-[#E83B00] w-5 h-5" />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {experiment.description}
            </p>
          </div>
        ))}
      </div>

      {/* Experiment Dialog */}
      {showExperimentDialog && selectedExperiment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl transform transition-all duration-300 ease-in-out">
            {/* Dialog Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedExperiment.icon}</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E83B00] to-[#FF7349] bg-clip-text text-transparent">
                  {selectedExperiment.name}
                </h2>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Canvas Container */}
              <div className="flex-grow p-4">
                <div className="w-full h-[500px] bg-gray-100 rounded-lg relative overflow-hidden">
                  <canvas ref={canvasRef} className="w-full h-full" />

                  {/* Simulation Controls Overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 rounded-lg p-2 flex gap-2">
                    <button
                      onClick={handleStartStop}
                      className={`p-2 rounded-lg flex items-center gap-2 ${
                        isSimulating
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                    >
                      {isSimulating ? <Pause size={20} /> : <Play size={20} />}
                      {isSimulating ? "Pause" : "Start"}
                    </button>

                    <button
                      onClick={handleReset}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center gap-2"
                    >
                      <RefreshCw size={20} />
                      Reset
                    </button>

                    <div className="text-gray-700 p-2">
                      Time: {time.toFixed(2)}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div className="w-full md:w-80 p-4 bg-gray-50 rounded-lg m-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sliders size={20} className="text-[#E83B00]" />
                  Experiment Controls
                </h3>

                <div className="space-y-6">
                  {selectedExperiment.controlParams.map((param) => (
                    <div key={param.id} className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          {param.name}
                        </label>
                        <span className="text-sm text-gray-500">
                          {params[param.id]} {param.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleParamChange(
                              param.id,
                              Math.max(param.min, params[param.id] - 1)
                            )
                          }
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>

                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          value={params[param.id]}
                          onChange={(e) =>
                            handleParamChange(
                              param.id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="flex-grow h-2 rounded-lg appearance-none bg-gray-300 cursor-pointer accent-[#E83B00]"
                        />

                        <button
                          onClick={() =>
                            handleParamChange(
                              param.id,
                              Math.min(param.max, params[param.id] + 1)
                            )
                          }
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <button
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg 
                    hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 
                    flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualPhysicsLab;
