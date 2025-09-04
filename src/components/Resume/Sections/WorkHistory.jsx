import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const Experience = () => {
    const navigate = useNavigate();

    const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
    const [description, setDescription] = useState("");
    const [formData, setFormData] = useState({
        jobTitle: "",
        employer: "",
        location: "",
        startDateMonth: "",
        startDateYear: "",
        endDateMonth: "",
        endDateYear: "",
    });

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

    const saveToLocalStorage = (data) => {
        const existing = JSON.parse(localStorage.getItem("experienceData")) || [];
        existing.push(data);
        localStorage.setItem("experienceData", JSON.stringify(existing));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = () => {
        const currentDate = new Date();
        setIsCurrentlyWorking((prev) => {
            if (!prev) {
                setFormData((prevData) => ({
                    ...prevData,
                    endDateMonth: currentDate.toLocaleString("en", { month: "long" }),
                    endDateYear: currentDate.getFullYear().toString(),
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    endDateMonth: "",
                    endDateYear: "",
                }));
            }
            return !prev;
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            id: uuidv4(),
            ...formData,
            isCurrentlyWorking,
            description,
        };

        saveToLocalStorage(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            id: uuidv4(),
            ...formData,
            isCurrentlyWorking,
            description,
        };

        saveToLocalStorage(data);
        navigate("/next-page");
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Add Experience</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Title *</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Employer *</label>
                        <input
                            type="text"
                            name="employer"
                            value={formData.employer}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            required
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md text-sm"
                    />
                </div>

                {/* Row 3 - Start Date */}
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            name="startDateMonth"
                            value={formData.startDateMonth}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            required
                        >
                            <option value="">Month</option>
                            {months.map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>

                        <select
                            name="startDateYear"
                            value={formData.startDateYear}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            required
                        >
                            <option value="">Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 4 - End Date */}
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            name="endDateMonth"
                            value={formData.endDateMonth}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            disabled={isCurrentlyWorking}
                            required={!isCurrentlyWorking}
                        >
                            <option value="">Month</option>
                            {months.map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>

                        <select
                            name="endDateYear"
                            value={formData.endDateYear}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            disabled={isCurrentlyWorking}
                            required={!isCurrentlyWorking}
                        >
                            <option value="">Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-2">
                        <label className="inline-flex items-center text-sm">
                            <input
                                type="checkbox"
                                checked={isCurrentlyWorking}
                                onChange={handleCheckboxChange}
                                className="mr-2"
                            />
                            I currently work here
                        </label>
                    </div>
                </div>

                {/* Row 5 - Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Job Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md text-sm"
                        rows="4"
                        placeholder="Describe your role and responsibilities"
                    />
                </div>

                {/* Save Button */}
                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-orange-600 text-white text-xl font-medium px-15 py-2 rounded-md hover:bg-orange-700 transition"
                    >
                        Save
                    </button>
                </div>


            </form>
        </div>
    );
};

export default Experience;
