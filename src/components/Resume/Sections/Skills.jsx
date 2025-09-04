import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaMinusCircle, FaPlus, FaRegStar, FaStar, FaTrash } from "react-icons/fa";

const LOCAL_STORAGE_KEY = "my_resume_skills";

const Skill = () => {
  const [skills, setSkills] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Failed to parse local storage skills", err);
        return [{ id: uuidv4(), name: "", rating: 0 }];
      }
    }
    return [{ id: uuidv4(), name: "", rating: 0 }];
  });

  const [skillError, setSkillError] = useState(null);

  const handleAddSkill = () => {
    const isEmpty = skills.some((s) => s.name.trim() === "");
    if (isEmpty) {
      setSkillError("Please fill the existing field before adding another.");
      return;
    }
    setSkillError(null);
    setSkills([...skills, { id: uuidv4(), name: "", rating: 0 }]);
  };

  const handleRemoveSkill = (id) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleRatingChange = (id, rating) => {
    setSkills(skills.map((s) => (s.id === id ? { ...s, rating } : s)));
  };

  const handleNameChange = (id, name) => {
    setSkills(skills.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const handleSubmit = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(skills));
    console.log("Skills saved:", skills);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setSkillError(null), 2000);
    return () => clearTimeout(timeout);
  }, [skillError]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Skills</h2>

      {skills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-4 mb-4">
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleRatingChange(skill.id, 0)}
              title="Reset Rating"
              className="text-red-500"
            >
              <FaMinusCircle />
            </button>
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                className={`${
                  i + 1 <= skill.rating ? "text-yellow-500" : "text-gray-400"
                }`}
                onClick={() => handleRatingChange(skill.id, i + 1)}
              >
                {i + 1 <= skill.rating ? <FaStar /> : <FaRegStar />}
              </button>
            ))}
          </div>

          {/* Skill Name Input */}
          <input
            type="text"
            value={skill.name}
            onChange={(e) => handleNameChange(skill.id, e.target.value)}
            placeholder="Skill Name"
            className="flex-1 p-2 border border-gray-300 rounded"
          />

          {/* Delete Button */}
          <button
            onClick={() => handleRemoveSkill(skill.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete Skill"
          >
            <FaTrash />
          </button>
        </div>
      ))}

      {/* Error Message */}
      {skillError && <div className="text-red-600 mb-4">{skillError}</div>}

      {/* Add Skill and Save Skills Buttons Side by Side */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleAddSkill}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <FaPlus />
          Add Skill
        </button>

        <button
          onClick={handleSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
        >
          Save Skills
        </button>
      </div>
    </div>
  );
};

export default Skill;
