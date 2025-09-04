import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate, useLocation } from "react-router-dom";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
    ChevronRight,
    BookOpen,
    Video,
    Calculator,
    MessageCircle,
    Compass,
    ChevronDown,
    Send,
    ArrowRight,
    UserPlus,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

const Cse = ({ onNavigate, user }) => {
    const [email, setEmail] = useState("");
    const [activeFeature, setActiveFeature] = useState("lab-manual");
    const heroCanvasRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = [
        { name: "JavaScript", path: "/cse/java-script" },
        { name: "C", path: "/cse/c" },
        { name: "Oops", path: "/oops" },
        { name: "Ask Doubts", path: "/ask-doubts" },
        // { name: "Cse Calc", path: "/Cse-calculator" },
        // { name: "Virtual Lab", path: "/virtual-lab" },
        // { name: "Game", path: "/game" },
    ];


    // Hero 3D animation
    useEffect(() => {
        if (!heroCanvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const canvas = heroCanvasRef.current;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Create Cse objects
        const objects = [];

        // Atom model
        const atomGroup = new THREE.Group();

        // Nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const nucleusMaterial = new THREE.MeshStandardMaterial({
            color: 0xe83b00,
            roughness: 0.4,
            metalness: 0.3,
            emissive: 0xe83b00,
            emissiveIntensity: 0.2,
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        atomGroup.add(nucleus);

        // Electron orbits
        const createOrbit = (radius, rotation) => {
            const orbitGeometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
            const orbitMaterial = new THREE.MeshStandardMaterial({
                color: 0x0099ff,
                transparent: true,
                opacity: 0.6,
                roughness: 0.3,
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = rotation.x;
            orbit.rotation.y = rotation.y;
            atomGroup.add(orbit);

            // Add electron
            const electronGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const electronMaterial = new THREE.MeshStandardMaterial({
                color: 0x0099ff,
                emissive: 0x0099ff,
                emissiveIntensity: 0.5,
                roughness: 0.3,
            });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);

            // Position electron on orbit
            electron.position.x = radius;

            // Add electron to orbit group
            const electronGroup = new THREE.Group();
            electronGroup.add(electron);
            electronGroup.rotation.x = rotation.x;
            electronGroup.rotation.y = rotation.y;

            atomGroup.add(electronGroup);

            return { orbit, electronGroup };
        };

        const orbit1 = createOrbit(0.8, { x: 0, y: 0 });
        const orbit2 = createOrbit(1.2, { x: Math.PI / 3, y: Math.PI / 6 });
        const orbit3 = createOrbit(1.6, { x: -Math.PI / 4, y: Math.PI / 3 });

        scene.add(atomGroup);
        objects.push({
            group: atomGroup,
            update: (time) => {
                atomGroup.rotation.y = time * 0.2;
                atomGroup.rotation.z = time * 0.1;

                orbit1.electronGroup.rotation.z = time * 1.5;
                orbit2.electronGroup.rotation.z = time * 1.2;
                orbit3.electronGroup.rotation.z = time * 0.9;
            },
        });

        // Pendulum
        const pendulumGroup = new THREE.Group();
        pendulumGroup.position.set(-3, 0, -2);

        const pivotGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const pivotMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
        pivot.position.y = 1.5;
        pendulumGroup.add(pivot);

        const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1.5, 8);
        stringGeometry.translate(0, -0.75, 0);
        const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.y = 1.5;

        const bobGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const bobMaterial = new THREE.MeshStandardMaterial({
            color: 0xff7349,
            roughness: 0.4,
            metalness: 0.3,
        });
        const bob = new THREE.Mesh(bobGeometry, bobMaterial);
        bob.position.y = -1.5;
        string.add(bob);

        pendulumGroup.add(string);
        scene.add(pendulumGroup);

        objects.push({
            group: pendulumGroup,
            update: (time) => {
                string.rotation.z = Math.sin(time * 1.2) * 0.5;
            },
        });

        // Projectile motion
        const projectileGroup = new THREE.Group();
        projectileGroup.position.set(3, -1, -3);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(3, 3);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x90ee90,
            roughness: 0.8,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        projectileGroup.add(ground);

        // Ball
        const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({
            color: 0xe83b00,
            roughness: 0.5,
        });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        projectileGroup.add(ball);

        // Arrow
        const arrowHelper = new THREE.ArrowHelper(
            new THREE.Vector3(1, 1, 0).normalize(),
            new THREE.Vector3(0, 0, 0),
            0.5,
            0xe83b00
        );
        projectileGroup.add(arrowHelper);

        scene.add(projectileGroup);

        objects.push({
            group: projectileGroup,
            update: (time) => {
                // Simulate projectile motion
                const cycle = (time % 3) / 3;
                const x = cycle * 2;
                const y = 2 * cycle * (1 - cycle);

                ball.position.x = x;
                ball.position.y = y;

                // Update arrow only at the start of the cycle
                if (cycle < 0.1) {
                    arrowHelper.position.set(0, 0, 0);
                } else {
                    arrowHelper.position.set(ball.position.x, ball.position.y, 0);
                }
            },
        });

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // Handle window resize
        const handleResize = () => {
            if (!canvas) return;

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        // Animation loop
        let animationId;
        const animate = (time) => {
            time = time * 0.001; // Convert to seconds

            animationId = requestAnimationFrame(animate);

            // Update objects
            objects.forEach((obj) => obj.update(time));

            // Update controls
            controls.update();

            // Render
            renderer.render(scene, camera);
        };

        animate(0);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);

            // Dispose geometries and materials
            objects.forEach((obj) => {
                obj.group.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            });

            renderer.dispose();
        };
    }, []);

    // Features data
    const features = [
        {
            id: "lab-manual",
            title: "Java Script Debugging",
            description:
                "Comprehensive guides for all Cse experiments with step-by-step instructions and interactive diagrams.",
            icon: <BookOpen className="w-6 h-6 text-white" />,
            color: "from-blue-500 to-blue-600",
            buttonText: "Open Lab Manual",
            path: "/cse/java-script",
        },
        {
            id: "virtual-lab",
            title: "C Learning",
            description:
                "Perform experiments virtually with accurate simulations of physical phenomena like projectile motion, pendulums, and circuits.",
            icon: < Video className="w-6 h-6 text-white" />,
            color: "from-orange-500 to-orange-600",
            buttonText: "Enter Virtual Lab",
            path: "/cse/c",
        },
        {
            id: "meeting",
            title: "Live Sessions",
            description:
                "Join virtual meetings with tutors to get real-time help with difficult concepts or lab procedures.",
            icon: <Video className="w-6 h-6 text-white" />,
            color: "from-green-500 to-green-600",
            buttonText: "Join Session",
            path: "/meeting",
        },
        {
            id: "Cse-calculator",
            title: "Cse Calculator",
            description:
                "Quickly solve complex Coding equations with our specialized calculators for mechanics, electricity, thermodynamics and more.",
            icon: <Calculator className="w-6 h-6 text-white" />,
            color: "from-purple-500 to-purple-600",
            buttonText: "Use Calculator",
            path: "/Cse-calculator",
        },
        {
            id: "ask-doubts",
            title: "Ask Doubts",
            description:
                "Post your questions and get answers from tutors and other students in our collaborative learning community.",
            icon: <MessageCircle className="w-6 h-6 text-white" />,
            color: "from-red-500 to-red-600",
            buttonText: "Ask a Question",
            path: "/ask-doubts",
        },
        {
            id: "bot",
            title: "Cse Assistant Bot",
            description:
                "Get instant help from our AI-powered Coding assistant that can answer questions and guide you through problems.",
            icon: <Compass className="w-6 h-6 text-white" />,
            color: "from-teal-500 to-teal-600",
            buttonText: "Chat with Bot",
            path: "/bot",
        },
    ];

    const stats = [
        { value: "50+", label: "Interactive Experiments" },
        { value: "1000+", label: "Programming Problems" },
        { value: "24/7", label: "Learning Support" },
        { value: "98%", label: "Success Rate" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        alert(`Thanks for subscribing with: ${email}`);
        setEmail("");
    };

    return (
        <div className=" bg-gradient-to-br from-gray-50 to-white">

            {/* Navbar Section */}
            <nav className="bg-orange-200 text-black px-4 py-2 flex justify-center items-center gap-4 overflow-x-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`px-4 py-2 rounded transition-all duration-300 
        ${location.pathname === item.path ? 'bg-orange-500 text-white' : 'hover:bg-orange-300'}`}
                    >
                        {item.name}
                    </button>
                ))}
            </nav>


            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* 3D Canvas Background */}
                <div className="absolute inset-0 z-0">
                    <canvas ref={heroCanvasRef} className="w-full h-full" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 sm:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                Interactive Cse Learning
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                Master Cse Through{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E83B00] to-[#FF7349]">
                                    Interactive Experiments
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 max-w-lg">
                                Experience Cse like never before with our comprehensive
                                virtual lab, interactive calculators, and expert assistance.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => onNavigate("/virtual-lab")}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white font-medium text-lg
                    shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-1"
                                >
                                    Start Learning
                                </button>

                                <button
                                    onClick={() => {
                                        const featuresSection = document.getElementById("features");
                                        featuresSection.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="px-8 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-lg
                    hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <span>Explore Features</span>
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 p-6 rounded-2xl shadow-xl">
                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                            </div>

                            <div className="relative space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#E83B00] to-[#FF7349] flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Learn by Doing</h3>
                                        <p className="text-gray-500">
                                            Perform experiments virtually
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                        <Calculator className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Calculate & Analyze</h3>
                                        <p className="text-gray-500">
                                            Apply Cse formulas easily
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                        <MessageCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Get Instant Help</h3>
                                        <p className="text-gray-500">Ask questions anytime</p>
                                    </div>
                                </div>

                                <div className="px-5 py-4 bg-white rounded-xl shadow border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                <div className="w-6 h-6 bg-[#E83B00] rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium">Projectile Motion</p>
                                                <p className="text-sm text-gray-500">
                                                    Current Experiment
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onNavigate("/virtual-lab")}
                                            className="p-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <p className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E83B00] to-[#FF7349]">
                                    {stat.value}
                                </p>
                                <p className="text-gray-600 mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wave Separator */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240">
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,138.7C672,117,768,75,864,80C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything You Need to Master Cse
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Our comprehensive platform provides all the tools you need to
                            understand and excel in Cse through practical learning.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            {features.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveFeature(feature.id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-300
                    ${activeFeature === feature.id
                                            ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center
                      ${activeFeature === feature.id
                                                    ? "bg-white/20"
                                                    : `bg-gradient-to-r ${feature.color}`
                                                }`}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-medium">{feature.title}</h3>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="md:col-span-2">
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className={`h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden
                    transition-all duration-500 ${activeFeature === feature.id
                                            ? "opacity-100"
                                            : "hidden opacity-0"
                                        }`}
                                >
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                        <p className="text-gray-600 mb-6">{feature.description}</p>

                                        <button
                                            onClick={() => onNavigate(feature.path)}
                                            className={`px-6 py-3 rounded-xl text-white font-medium
                        bg-gradient-to-r ${feature.color} hover:shadow-lg transition-all duration-300`}
                                        >
                                            {feature.buttonText}
                                        </button>
                                    </div>

                                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                                                {feature.icon}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="rounded-3xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                            <div className="p-12 lg:p-16">
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                    Ready to Transform Your Cse Learning Experience?
                                </h2>
                                <p className="text-white/90 text-lg mb-8">
                                    Join thousands of students who have improved their
                                    understanding of Cse through our interactive platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => onNavigate("/auth")}
                                        className="px-8 py-3 rounded-xl bg-white text-[#E83B00] font-medium
                      hover:shadow-lg transition-all duration-300"
                                    >
                                        Get Started Free
                                    </button>
                                    <button
                                        onClick={() => onNavigate("/virtual-lab")}
                                        className="px-8 py-3 rounded-xl bg-white/20 text-white font-medium
                      hover:bg-white/30 transition-all duration-300"
                                    >
                                        Try Demo
                                    </button>
                                </div>
                            </div>
                            <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                                <div className="absolute inset-0 bg-white/10"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                                                <ChevronRight className="w-8 h-8 text-[#E83B00]" />
                                            </div>
                                        </div>
                                        <p className="text-white font-medium">Watch Demo Video</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 pb-48 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            Stay Updated with Latest Cse Resources
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Subscribe to our newsletter to receive weekly updates on new
                            experiments, formulas, and learning tips.
                        </p>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E83B00]"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white font-medium
                  hover:shadow-lg shadow-orange-200 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>Subscribe</span>
                                    <Send className="w-4 h-4" />
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}

            {/* Custom CSS for background grid pattern */}
            <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
        </div>
    );
};

export default Cse;