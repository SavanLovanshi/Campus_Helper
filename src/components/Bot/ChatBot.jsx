import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mic,
  Plus,
  Loader2,
  MessageCircle,
  Smile,
  Image,
  Wifi,
  WifiOff,
  Copy,
  Check,
} from "lucide-react";



const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [images, setImages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Gemini API Key
  const GEMINI_API_KEY = "AIzaSyBoBX0gXgwDgFE_ejE0-32OyBepd4YNizs";

  // Function to format text with HTML
  const formatText = (text) => {
    // Replace ** with bold tags
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Replace * with bullet points (if at the beginning of a line)
    text = text.replace(/^\s*\*(.*)/gm, "• $1");

    // Replace *** with bold (special formatting for physics terms)
    text = text.replace(/\*\*\*(.*?):/g, "<strong>$1:</strong>");

    // Preserve line breaks
    text = text.replace(/\n/g, "<br>");

    return text;
  };

  // Handle copying text
  const copyToClipboard = (text, index) => {
    const plainText = text.replace(/<[^>]*>/g, ""); // Remove HTML tags
    navigator.clipboard.writeText(plainText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  // Hardcoded physics Q&A for offline mode
  const physicsQA = {
    "optical fiber": {
      question: "How does an optical fiber work?",
      answer:
        "An optical fiber works based on total internal reflection. It consists of a core with higher refractive index surrounded by a cladding with lower refractive index. Light travels through the core by repeatedly bouncing off the core-cladding boundary. The numerical aperture (NA) determines the maximum angle at which light can enter the fiber and still undergo total internal reflection.",
    },
    brewster: {
      question: "What is Brewster's Law?",
      answer:
        "Brewster's Law states that when light is incident on a transparent dielectric surface at the Brewster angle (θp), the reflected light is completely polarized parallel to the surface. The tangent of the Brewster angle equals the ratio of the refractive indices of the two media (tan θp = n2/n1). This principle is used in polarizers and laser systems.",
    },
    "newton rings": {
      question: "Explain Newton's Rings experiment",
      answer:
        "Newton's Rings is an interference pattern created when a convex lens is placed on a flat glass surface. The pattern consists of alternating dark and bright circular rings. These rings are formed due to constructive and destructive interference of light reflected from the air gap between the lens and glass plate.",
    },
    "manual solver": {
      question: "Can you solve lab manual questions?",
      answer:
        "Yes! I can help you solve physics lab manual questions. I can assist with numerical calculations, experiment procedures, and data analysis for various physics experiments including optical fiber, Brewster's law, and more.",
    },
  };

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Add welcome message
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your Physics Lab Assistant. I can help you with experiments, calculations, and understanding physics concepts. What would you like to know?",
      },
    ]);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const findMatchingAnswer = (input) => {
    const lowercaseInput = input.toLowerCase();
    for (const [key, qa] of Object.entries(physicsQA)) {
      if (lowercaseInput.includes(key)) {
        return qa;
      }
    }
    return null;
  };

  const generateOfflineResponse = (input) => {
    const qa = findMatchingAnswer(input);
    if (qa) {
      return qa.answer;
    }
    return "I'm currently in offline mode. I can help you with basic physics concepts including optical fiber, Brewster's law, Newton's rings, and lab manual calculations. Please check your internet connection for more comprehensive answers.";
  };

  const callGeminiAPI = async (userInput) => {
    try {
      // Check if the input is about physics definitions
      if (
        userInput.toLowerCase().includes("physics") &&
        (userInput.toLowerCase().includes("what is") ||
          userInput.toLowerCase().includes("definition") ||
          userInput.toLowerCase().includes("explain"))
      ) {
        // Return a pre-formatted physics definition
        return `<strong>Physics is the natural science that studies matter, its motion, and behavior through space and time, along with related concepts such as energy and force.</strong> Here's a breakdown:<br><br>
<strong>Matter:</strong> Anything that has mass and takes up space. This includes everything from subatomic particles to planets and galaxies.<br><br>
<strong>Motion:</strong> How objects move, including their velocity, acceleration, and momentum.<br><br>
<strong>Energy:</strong> The capacity to do work. Energy comes in many forms, such as kinetic, potential, thermal, and electromagnetic.<br><br>
<strong>Force:</strong> An interaction that, when unopposed, will change the motion of an object. Examples include gravity, electromagnetism, and the strong and weak nuclear forces.<br><br>
<strong>Space and Time:</strong> The framework in which physical phenomena occur. Physics aims to understand the relationship between space, time, and matter.<br><br>
<strong>In simpler terms, physics seeks to answer fundamental questions about the universe, such as:</strong><br>
• How did the universe begin?<br>
• What are the fundamental building blocks of matter?<br>
• What are the laws that govern the behavior of objects?<br>
• How can we use our understanding of physics to develop new technologies?`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: userInput,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch from Gemini API");
      }

      const data = await response.json();

      // Extract text from Gemini response
      if (
        data.candidates &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
      ) {
        // Format response before returning
        return formatText(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Sorry, I had trouble getting a response from the AI. Please try again.";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isOnline) {
        // Call Gemini API directly
        const geminiResponse = await callGeminiAPI(input);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: geminiResponse,
            formatted: true,
          },
        ]);

        // Clear images after successful response
        setImages([]);
      } else {
        const offlineResponse = generateOfflineResponse(input);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: formatText(offlineResponse),
            formatted: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again or check your connection.",
          formatted: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });

        setImages((prev) => [...prev, base64String]);

        // Add image preview to messages
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: `[Image Upload: ${file.name}]`,
            image: base64String,
            formatted: false,
          },
        ]);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
    setShowAttachMenu(false);
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev + transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.start();
      }
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col  h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Chat Header */}
      <div className="bg-white shadow-md p-4 flex items-center gap-3 fixed  left-0 right-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E83B00] to-[#FF7349] flex items-center justify-center">
          <MessageCircle className="text-white w-6 h-6" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-lg">Physics Lab Assistant</h1>
          <p className="text-sm text-gray-500">
            {isOnline ? "Connected to Gemini" : "Offline Mode"}
          </p>
        </div>
        {isOnline ? (
          <Wifi className="w-6 h-6 text-green-500" />
        ) : (
          <WifiOff className="w-6 h-6 text-red-500 animate-pulse" />
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 pt-24 space-y-3 pb-20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
          >
            <div
              className={`relative max-w-[85%] p-3 rounded-2xl shadow-md transform transition-all duration-300 hover:scale-102
                ${message.role === "user"
                  ? "bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white ml-auto"
                  : "bg-white"
                }`}
            >
              {message.role === "assistant" && (
                <div className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#E83B00] to-[#FF7349] flex items-center justify-center">
                  <MessageCircle className="text-white w-5 h-5" />
                </div>
              )}
              {message.image && (
                <img
                  src={message.image}
                  alt="Uploaded content"
                  className="max-w-full rounded-lg mb-2"
                />
              )}

              {/* Message Content */}
              {message.formatted ? (
                <div
                  className="break-words pr-8"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              ) : (
                <p className="break-words pr-8">{message.content}</p>
              )}

              {/* Copy Button for Assistant Messages */}
              {message.role === "assistant" && (
                <button
                  onClick={() => copyToClipboard(message.content, index)}
                  className="absolute right-2 top-2 p-1.5 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white p-3 rounded-2xl shadow-md max-w-[85%]">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white p-3 shadow-lg fixed bottom-0 left-0 right-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors relative"
          >
            <Smile className="w-6 h-6 text-orange-500" />
            {showEmojis && (
              <div className="absolute bottom-14 left-0 bg-white rounded-lg shadow-lg p-2 grid grid-cols-6 gap-2 min-w-[220px] border border-gray-100 z-50">
                {[
                  "😊",
                  "👍",
                  "🎉",
                  "🤔",
                  "👋",
                  "❤️",
                  "😂",
                  "🔥",
                  "⚡",
                  "💡",
                  "🔍",
                  "📚",
                ].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.preventDefault();
                      setInput((prev) => prev + emoji);
                      setShowEmojis(false);
                    }}
                    className="text-xl hover:bg-orange-50 p-1 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <Plus className="w-6 h-6 text-orange-500" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-14 left-0 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 z-50">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 w-full transition-colors"
                >
                  <Image className="w-5 h-5 text-orange-500" />
                  <span>Image</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isOnline
                ? "Ask me anything about physics..."
                : "Offline mode - Basic physics help available"
            }
            className="flex-1 p-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 rounded-full transition-colors ${isRecording ? "bg-red-50" : "hover:bg-orange-50"
              }`}
          >
            <Mic
              className={`w-6 h-6 ${isRecording ? "text-red-500 animate-pulse" : "text-orange-500"
                }`}
            />
          </button>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-gradient-to-r from-[#E83B00] to-[#FF7349] rounded-full text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </form>

        {/* Click outside handlers */}
        {(showEmojis || showAttachMenu) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowEmojis(false);
              setShowAttachMenu(false);
            }}
          />
        )}
      </div>

      {!isOnline && (
        <div className="bg-red-50 p-2 text-center text-red-600 text-sm fixed bottom-16 left-0 right-0">
          Offline Mode - Limited responses available
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        /* Media queries for responsive design */
        @media (max-width: 640px) {
          .max-w-[85%] {
            max-width: 90%;
          }

          .p-3 {
            padding: 0.75rem;
          }

          .text-lg {
            font-size: 1rem;
          }

          .text-sm {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
