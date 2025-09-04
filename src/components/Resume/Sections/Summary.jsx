import { useState } from 'react';

export default function Summary() {
    const [summary, setSummary] = useState('');

    const handleSave = () => {
        // Save to localStorage
        const prev = JSON.parse(localStorage.getItem('resumeData')) || {};
        localStorage.setItem('resumeData', JSON.stringify({ ...prev, summary }));

        // Optionally, show a message or log to indicate the data was saved.
        console.log('Summary saved:', summary);
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Professional Summary</h2>
            <p className="text-gray-600 mb-6 text-lg text-center">
                Tell us a little about your background in your field. Highlight your professional journey, key achievements, and what makes you unique. Keep it concise and focused.
            </p>
            <textarea
                className="w-full h-48 p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-200 text-lg"
                placeholder="Write a brief summary of your professional background..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />

            {/* Save Button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleSave}
                    className="bg-orange-600 text-white py-3 px-15 rounded-lg hover:bg-orange-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 text-lg font-semibold"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
