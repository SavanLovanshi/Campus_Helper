// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const NavbarPhysics = () => {
    return (
        <nav className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Physics Lab</h1>
                <div className="flex gap-4">
                    <Link to="/lab-manual">Lab Manual</Link>
                    <Link to="/physics-calculator">Physics Calc</Link>
                    <Link to="/virtual-lab">Virtual Lab</Link>
                    <Link to="/game">Game</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavbarPhysics;
