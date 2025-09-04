import { useState } from "react";

const Education = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolLocation: "",
    degree: "",
    fieldOfStudy: "",
    graduationMonth: "",
    graduationYear: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const existingData = JSON.parse(localStorage.getItem("resumeEducation")) || [];
    const newData = [...existingData, formData];
    localStorage.setItem("resumeEducation", JSON.stringify(newData));
    alert("Education info saved!");
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 20;
    const endYear = currentYear + 10;
    let years = [];
    for (let i = startYear; i <= endYear; i++) years.push(i);
    return years;
  };

  const monthNames = Array.from({ length: 12 }, (_, index) => {
    return new Date(0, index).toLocaleString("en", { month: "long" });
  });

  return (
    <div className="pt-2 px-4 pb-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Education Details</h1>
      <form className="space-y-4">
        <input
          type="text"
          name="schoolName"
          placeholder="School Name"
          value={formData.schoolName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="schoolLocation"
          placeholder="School Location"
          value={formData.schoolLocation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={formData.degree}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="fieldOfStudy"
          placeholder="Field of Study"
          value={formData.fieldOfStudy}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-4">
          <select
            name="graduationMonth"
            value={formData.graduationMonth}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Month</option>
            {monthNames.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Year</option>
            {generateYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="bg-orange-600 text-white text-xl px-25 py-2 rounded hover:bg-orange-700 transition"
          >
            Save Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default Education;
