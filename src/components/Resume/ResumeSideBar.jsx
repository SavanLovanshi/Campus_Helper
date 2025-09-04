const ResumeSidebar = ({ selectedCategory, steps }) => {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-6">
                <img src="/logocopy.png" alt="logo" className="w-8 h-8" />
                <span className="font-bold text-lg">Resume Maker</span>
            </div>

            <div className="space-y-4">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`p-2 rounded-lg ${selectedCategory === step.id
                            ? "bg-blue-100 text-orange-600 font-semibold"
                            : "text-gray-400"
                            }`}
                    >
                        {index + 1}. {step.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ResumeSidebar