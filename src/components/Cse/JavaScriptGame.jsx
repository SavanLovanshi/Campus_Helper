"use client";
import { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import { CheckCircle, XCircle, ClipboardCopy } from "lucide-react";
import React from "react";

const levels = [
    {
        code: "function greet(name) {\n console.log(\"Hello, \" + nme);\n}",
        solution: "function greet(name) {\n console.log(\"Hello, \" + name);\n}",
        hint: "Check the variable spelling.",
    },
    {
        code: "let numbers = [1, 2, 3];\n console.log(numbars[1]);",
        solution: "let numbers = [1, 2, 3];\n console.log(numbers[1]);",
        hint: "Check the array variable name.",
    },
    {
        code: "if (true) {\n console.log(\"Yes\");\n} else {\n console.log(\"No\")",
        solution: "if (true) {\n console.log(\"Yes\");\n} else {\n console.log(\"No\");\n}",
        hint: "Check the missing semicolon and curly brace.",
    },
    {
        code: "let x = 10;\nlet y = \"10\";\nconsole.log(x == y);",
        solution: "let x = 10;\nlet y = \"10\";\nconsole.log(x === y);",
        hint: "Use strict equality to compare.",
    },
    {
        code: "const num = \"5\";\nconst result = num * 2;\nconsole.log(rusult);",
        solution: "const num = \"5\";\nconst result = num * 2;\nconsole.log(result);",
        hint: "Check the spelling of the variable in the console.log.",
    },
];

export default function JavaScriptGame() {
    const [index, setIndex] = useState(0);
    const [userCode, setUserCode] = useState(levels[0].code);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [copied, setCopied] = useState(false);

    const current = levels[index];

    useEffect(() => {
        Prism.highlightAll();
    }, [userCode]);

    const handleSubmit = () => {
        const correct = userCode.trim() === current.solution.trim();
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        } else {
            setScore(Math.max(0, score - 1));
            setShowHint(true);
        }

        setShowExplanation(true);

        setTimeout(() => {
            setShowExplanation(false);
            setShowHint(false);

            if (correct) {
                const next = index + 1;
                if (next < levels.length) {
                    setIndex(next);
                    setUserCode(levels[next].code);
                } else {
                    setIsCorrect(null);
                    setUserCode("// 🎉 All Levels Completed!");
                }
            }
        }, 4000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(userCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fbe8d3] to-[#fcd5b5] text-gray-900 px-6 py-10">
            <div className="max-w-3xl mx-auto bg-[#fff2e6] rounded-2xl p-6 shadow-2xl">
                <h1 className="text-3xl font-bold text-center mb-6 text-orange-700">
                    🧠 Fix the Code - <span className="text-orange-600">JavaScript Debugger</span>
                </h1>

                <div className="text-sm text-orange-600 text-right mb-2">
                    Level {index + 1} of {levels.length}
                </div>

                <div className="relative">
                    <pre className="bg-[#ffe9d6] rounded-lg p-4 text-sm overflow-x-auto text-black mb-4">
                        <code className="language-javascript">{userCode}</code>
                    </pre>
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 text-orange-600 bg-white border border-orange-300 rounded-md p-1 px-2 text-xs hover:bg-orange-100 transition"
                    >
                        {copied ? "✅ Copied" : "📋 Copy"}
                    </button>
                </div>

                <textarea
                    className="w-full bg-orange-100 text-black p-3 rounded-lg font-mono mb-4 border border-orange-300"
                    rows={10}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                />

                {!showExplanation && (
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Submit Fix
                    </button>
                )}

                {showExplanation && (
                    <div className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                            {isCorrect ? (
                                <>
                                    <CheckCircle className="text-green-600" />
                                    <span className="text-green-700">Correct Fix</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="text-red-600" />
                                    <span className="text-red-700">Incorrect Fix</span>
                                </>
                            )}
                        </div>
                        {showHint && (
                            <p className="mt-2 text-sm text-orange-700 italic">Hint: {current.hint}</p>
                        )}
                    </div>
                )}

                <div className="mt-8 text-center text-xl">
                    <div className="inline-block bg-orange-100 px-6 py-3 rounded-xl shadow-md border border-orange-300">
                        <p className="text-orange-700 font-semibold">
                            Score: <span className="font-bold text-orange-900 text-2xl">{score}</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
