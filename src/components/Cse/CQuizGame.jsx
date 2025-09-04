"use client";
import { useEffect, useState } from "react";
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const outputQuestions = [
    {
        question: `#include <stdio.h>\n\nint main() {\n    int a = 5, b = 2;\n    printf("%d", a++ * ++b);\n    return 0;\n}`,
        options: ["10", "12", "14", "15"],
        answer: "12",
        explanation: "a++ * ++b => 5 * 3 (a becomes 6 after), so result is 15. But b was 2, ++b becomes 3."
    },
    {
        question: `#include <stdio.h>\n\nint main() {\n    int x = 4;\n    printf("%d", x >> 1);\n    return 0;\n}`,
        options: ["1", "2", "4", "8"],
        answer: "2",
        explanation: "Right shifting 4 by 1 gives 2 because 4 in binary is 100, and 100 >> 1 = 10 (which is 2)."
    },
    {
        question: `#include <stdio.h>\n\nint main() {\n    int x = 10;\n    printf("%d", x++ + x++);\n    return 0;\n}`,
        options: ["21", "20", "19", "22"],
        answer: "21",
        explanation: "`x++ + x++` means 10 + 11, x becomes 12 after. So, answer is 21."
    },
    {
        question: `#include <stdio.h>\n\nint main() {\n    int a = 3;\n    printf("%d", a == 3 ? 5 : 10);\n    return 0;\n}`,
        options: ["3", "5", "10", "0"],
        answer: "5",
        explanation: "Ternary operator checks if a == 3, which is true, so it prints 5."
    }
];

const tfQuestions = [
    {
        question: "Functions in C can return multiple values. (T/F)",
        answer: "False",
        explanation: "Functions in C can return only one value. To return multiple values, use pointers."
    },
    {
        question: "The 'main' function in C must always return an int.",
        answer: "True",
        explanation: "The standard main function returns an int to indicate success/failure to the OS."
    },
    {
        question: "The sizeof(char) in C is always 1 byte.",
        answer: "True",
        explanation: "According to the C standard, sizeof(char) is always 1 byte."
    },
    {
        question: "The break statement can be used outside loops or switch-case. (T/F)",
        answer: "False",
        explanation: "`break` is only valid inside loops and switch statements. Outside use results in an error."
    }
];

export default function CQuizGame() {
    const [step, setStep] = useState("output");
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState("");
    const [msg, setMsg] = useState("");
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timer, setTimer] = useState(0);
    const [chancesLeft, setChancesLeft] = useState(3);

    const current = step === "output" ? outputQuestions[index] : tfQuestions[index];

    const resetGame = () => {
        setStep("output");
        setIndex(0);
        setSelected("");
        setMsg("");
        setScore(0);
        setShowExplanation(false);
        setTimer(0);
        setChancesLeft(3);
    };

    const handleSubmit = () => {
        const isCorrect = selected === current.answer;

        if (isCorrect) {
            setScore(prev => prev + 1);
            setMsg("✅ Correct");
        } else {
            setMsg("❌ Incorrect");

            if (score > 0) {
                setScore(prev => prev - 1);
            } else {
                if (chancesLeft === 1) {
                    setTimeout(() => {
                        alert("You've exhausted all 3 chances. Restarting the game.");
                        resetGame();
                    }, 1000);
                    return;
                } else {
                    setChancesLeft(prev => prev - 1);
                }
            }
        }

        setShowExplanation(true);
        setTimer(3);
    };

    useEffect(() => {
        if (timer === 0 || !showExplanation) return;

        const countdown = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(countdown);
                    goToNext();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [timer, showExplanation]);

    const goToNext = () => {
        setSelected("");
        setMsg("");
        setShowExplanation(false);
        const nextIndex = index + 1;

        if (step === "output" && nextIndex < outputQuestions.length) {
            setIndex(nextIndex);
        } else if (step === "output") {
            setStep("tf");
            setIndex(0);
        } else if (nextIndex < tfQuestions.length) {
            setIndex(nextIndex);
        } else {
            setMsg("🎉 All 8 Levels Completed!");
        }
    };

    return (
        <div className="min-h-screen bg-orange-100 text-orange-800 px-6 py-10">
            <div className="max-w-2xl mx-auto shadow-xl rounded-2xl bg-white p-6 border border-orange-300">
                <h1 className="text-3xl font-bold text-center mb-6 tracking-tight text-orange-600">
                    🔥 C Quiz - <span className="text-orange-700">{step === "output" ? "Code Output" : "True/False"}</span>
                </h1>

                <div className="text-sm text-orange-600 text-right mb-2">
                    Level {step === "output" ? index + 1 : index + 5} of 8
                </div>

                <div className="bg-orange-50 p-5 rounded-lg font-mono text-base whitespace-pre-wrap text-orange-700 mb-6 border border-orange-200">
                    {current.question}
                </div>

                <div className="space-y-3">
                    {(step === "output" ? current.options : ["True", "False"]).map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setSelected(opt)}
                            disabled={showExplanation}
                            className={`w-full px-4 py-2 rounded-lg text-left transition-all duration-300 
                            ${selected === opt
                                    ? (opt === current.answer ? "bg-green-500 text-green-800" : "bg-red-500 text-red-800")
                                    : "bg-orange-200 hover:bg-orange-300"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {selected && !showExplanation && (
                    <button
                        onClick={handleSubmit}
                        className="mt-4 w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Submit Answer
                    </button>
                )}

                {showExplanation && (
                    <div className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                            {msg.startsWith("✅") ? <CheckCircle className="text-orange-600" /> : <XCircle className="text-red-500" />}
                            {msg}
                        </div>
                        <p className="mt-2 text-sm text-orange-600 italic">{current.explanation}</p>
                        <p className="text-xs mt-1 text-orange-500">
                            ⏳ Moving to next question in {timer} seconds...
                        </p>
                    </div>
                )}


                {/* 🎯 Score & Chances */}
                <div className="mt-10 flex justify-between items-center">
                    <div className="bg-orange-100 px-6 py-3 rounded-xl shadow-md border border-orange-300">
                        <p className="text-orange-700 font-semibold">
                            Score: <span className="font-bold text-orange-900 text-2xl">{score}</span>
                        </p>
                    </div>
                    <div className="bg-orange-100 px-6 py-3 rounded-xl shadow-md border border-orange-300">
                        <p className="text-orange-700 font-semibold">
                            Chances Left: <span className="font-bold text-red-500 text-2xl">{chancesLeft}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
