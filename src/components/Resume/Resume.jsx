// Resume.jsx
import { useState } from "react";
import ResumeSidebar from "./ResumeSideBar";
import ResumeTop from "./ResumeTop";
import Education from "./Sections/Education";
import Contact from "./Sections/Contact";
import Experience from "./Sections/WorkHistory";
import Skill from "./Sections/Skills";
import Summary from "./Sections/Summary";
import Finalise from "./Sections/Finalise";

const steps = [
    { id: "contact", label: "Contact" },
    { id: "education", label: "Education" },
    { id: "workhistory", label: "Experience" },
    { id: "skill", label: "Skills" },
    { id: "summary", label: "Summary" },
    { id: "extra", label: "Finalize" },
];

const Resume = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };


    const selectedCategory = steps[currentStep].id;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 border-r">
                <ResumeSidebar selectedCategory={selectedCategory} steps={steps} />
            </div>

            {/* Right Content */}
            <div className="w-3/4 p-4">
                <ResumeTop goBackRoute="/resume" />
                <div className="mt-4">
                    {selectedCategory === "contact" && <Contact />}
                    {selectedCategory === "education" && <Education />}
                    {selectedCategory === "workhistory" && <Experience />}
                    {selectedCategory === "skill" && <Skill />}
                    {selectedCategory === "summary" && <Summary />}
                    {selectedCategory === "extra" && (
                        <Finalise setCurrentStep={setCurrentStep} />
                    )}
                </div>

                {currentStep < steps.length - 1 && (
                    <div className="mt-0 flex justify-end">
                        <button
                            onClick={handleNext}
                            className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resume;
