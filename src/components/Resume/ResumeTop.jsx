'use client';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import React from 'react';

const ResumeTop = () => {
    return (
        <Link to={"/"} className="text-blue-600 flex items-center gap-2" >
            <FaArrowLeft size={14} />
            <span>Back</span>
        </Link >
    );
};

export default ResumeTop;
