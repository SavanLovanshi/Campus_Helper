import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FaDownload } from 'react-icons/fa';

export default function Finalise({ setCurrentStep }) {

    const navigate = useNavigate();

    // Load all data from localStorage
    const [resumeData, setResumeData] = useState({
        contact: JSON.parse(localStorage.getItem('contactData')) || {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            github: '',
            leetcode: '',
            gfg: '',
        },
        education: JSON.parse(localStorage.getItem('resumeEducation')) || [{
            schoolName: "",
            schoolLocation: "",
            degree: "",
            fieldOfStudy: "",
            graduationMonth: "",
            graduationYear: "",
        }],
        skills: JSON.parse(localStorage.getItem('my_resume_skills')) || [],
        experience: JSON.parse(localStorage.getItem('ExperienceData')) || [{
            jobTitle: "",
            employer: "",
            location: "",
            startDateMonth: "",
            startDateYear: "",
            endDateMonth: "",
            endDateYear: "",
        }],
        summary: JSON.parse(localStorage.getItem('resumeData'))?.summary || '',
    });

    useEffect(() => {
        // Load all data when component mounts
        const loadData = () => {
            const contact = JSON.parse(localStorage.getItem('contactData')) || {};
            const education = JSON.parse(localStorage.getItem('resumeEducation')) || [];
            const skills = JSON.parse(localStorage.getItem('my_resume_skills')) || [];
            const experience = JSON.parse(localStorage.getItem('experienceData')) || [];
            const summary = JSON.parse(localStorage.getItem('resumeData'))?.summary || '';

            setResumeData({
                contact,
                education,
                skills,
                experience,
                summary
            });
        };

        loadData();
    }, []);

    const handleDownload = () => {
        const doc = new jsPDF();

        // Set document properties
        doc.setProperties({
            title: `${resumeData.contact.firstName} ${resumeData.contact.lastName}'s Resume`,
            subject: 'Professional Resume',
            author: `${resumeData.contact.firstName} ${resumeData.contact.lastName}`,
        });

        // Header with name and contact info
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text(`${resumeData.contact.firstName} ${resumeData.contact.lastName}`, 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);

        const contactInfo = [
            resumeData.contact.email,
            resumeData.contact.phone,
            resumeData.contact.github ? `GitHub: ${resumeData.contact.github}` : '',
            resumeData.contact.leetcode ? `LeetCode: ${resumeData.contact.leetcode}` : '',
            resumeData.contact.gfg ? `GFG: ${resumeData.contact.gfg}` : ''
        ].filter(Boolean).join(' | ');

        doc.text(contactInfo, 105, 28, { align: 'center' });

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 35, 190, 35);

        // Summary
        let yPosition = 45;
        if (resumeData.summary) {
            doc.setFontSize(14);
            doc.setTextColor(40, 40, 40);
            doc.setFont('helvetica', 'bold');
            doc.text('PROFESSIONAL SUMMARY', 20, yPosition);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
            const summaryText = doc.splitTextToSize(resumeData.summary, 170);
            doc.text(summaryText, 20, yPosition + 10);
            yPosition += summaryText.length * 6 + 10;
        }

        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 5, 190, yPosition + 5);

        // Education
        if (resumeData.education.length > 0) {
            yPosition += 10;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('EDUCATION', 20, yPosition);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            resumeData.education.forEach((edu, index) => {
                yPosition += 10;
                doc.setFont('helvetica', 'bold');
                doc.text(`${edu.degree}`, 20, yPosition);
                doc.setFont('helvetica', 'normal');

                const gradDate = edu.graduationMonth ? `${edu.graduationMonth} ${edu.graduationYear}` : '';
                doc.text(`${edu.schoolName} | ${edu.schoolLocation} | ${gradDate}`, 20, yPosition + 5);
                doc.text(`Field of Study: ${edu.fieldOfStudy}`, 20, yPosition + 10);
                yPosition += 20;

                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
            });
        }

        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 10, 190, yPosition + 10);

        // Experience
        if (resumeData.experience.length > 0) {
            yPosition += 20;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('EXPERIENCE', 20, yPosition);

            yPosition += 10; // 👈 Add spacing after heading

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');

            resumeData.experience.forEach((exp, index) => {
                // Space between entries
                if (index > 0) yPosition += 20;

                // Job title
                doc.setFont('helvetica', 'bold');
                doc.text(`${exp.jobTitle}`, 20, yPosition);

                // Employer, location, dates
                doc.setFont('helvetica', 'normal');
                const startDate = exp.startDateMonth ? `${exp.startDateMonth} ${exp.startDateYear}` : '';
                const endDate = exp.endDateMonth ? `${exp.endDateMonth} ${exp.endDateYear}` : 'Present';
                const dates = startDate ? `${startDate} - ${endDate}` : '';
                doc.text(`${exp.employer} | ${exp.location} | ${dates}`, 20, yPosition + 6);

                yPosition += 16; // Add spacing for next entry or line check

                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
            });
        }


        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 10, 190, yPosition + 10);

        // Skills
        if (resumeData.skills.length > 0) {
            yPosition += 20;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('SKILLS', 20, yPosition);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            yPosition += 10;

            const skillLine = resumeData.skills.map(skill => `${skill.name}`).join(', ');
            const lines = doc.splitTextToSize(skillLine, 170);

            lines.forEach(line => {
                doc.text(line, 20, yPosition);
                yPosition += 10;

                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
            });
        }

        // Save PDF
        doc.save(`${resumeData.contact.firstName}_${resumeData.contact.lastName}_Resume.pdf`);

        // 🧹 Clear Local Storage After Download
        localStorage.clear();

        setCurrentStep(0);
        // Optionally reset in-app state if needed (optional):
        // setResumeData({}); 
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, [name]: value }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            contact: { ...prev.contact, [name]: value }
        }));
    };

    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        const updatedExperience = [...resumeData.experience];
        updatedExperience[index][name] = value;
        setResumeData(prev => ({ ...prev, experience: updatedExperience }));
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEducation = [...resumeData.education];
        updatedEducation[index][name] = value;
        setResumeData(prev => ({ ...prev, education: updatedEducation }));
    };

    return (
        <div className="max-w-4xl overflow-auto max-h-screen mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-black">Review Your Resume</h1>

            {/* Download Button */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    <FaDownload />
                    Download PDF Resume
                </button>
            </div>
            {/* Contact Information */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={resumeData.contact.firstName}
                            onChange={handleContactChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={resumeData.contact.lastName}
                            onChange={handleContactChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={resumeData.contact.email}
                            onChange={handleContactChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={resumeData.contact.phone}
                            onChange={handleContactChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                        <input
                            type="url"
                            name="github"
                            value={resumeData.contact.github}
                            onChange={handleContactChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="https://github.com/username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LeetCode</label>
                        <input
                            type="url"
                            name="leetcode"
                            value={resumeData.contact.leetcode}
                            onChange={handleContactChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="https://leetcode.com/username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GeeksforGeeks</label>
                        <input
                            type="url"
                            name="gfg"
                            value={resumeData.contact.gfg}
                            onChange={handleContactChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="https://auth.geeksforgeeks.org/user/username"
                        />
                    </div>
                </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Professional Summary</h2>
                <textarea
                    name="summary"
                    value={resumeData.summary}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md h-32"
                    placeholder="Briefly describe your professional background and key qualifications..."
                />
            </div>

            {/* Skills */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
                {resumeData.skills.length > 0 ? (
                    <ul className="space-y-2">
                        {resumeData.skills.map((skill, index) => (
                            <li key={index} className="flex items-center">
                                <span className="font-medium mr-2">{skill.name}:</span>
                                <span className="text-yellow-500">
                                    {'★'.repeat(skill.rating)}{'☆'.repeat(5 - skill.rating)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No skills added yet</p>
                )}
            </div>

            {/* Experience */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Work Experience</h2>
                {resumeData.experience.length > 0 ? (
                    resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={exp.jobTitle}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                                    <input
                                        type="text"
                                        name="employer"
                                        value={exp.employer}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={exp.location}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Month</label>
                                        <input
                                            type="text"
                                            name="startDateMonth"
                                            value={exp.startDateMonth}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Month"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                                        <input
                                            type="text"
                                            name="startDateYear"
                                            value={exp.startDateYear}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Year"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Month</label>
                                        <input
                                            type="text"
                                            name="endDateMonth"
                                            value={exp.endDateMonth}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Month"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                                        <input
                                            type="text"
                                            name="endDateYear"
                                            value={exp.endDateYear}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Year"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No experience added yet</p>
                )}
            </div>

            {/* Education */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Education</h2>
                {resumeData.education.length > 0 ? (
                    resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                                    <input
                                        type="text"
                                        name="schoolName"
                                        value={edu.schoolName}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">School Location</label>
                                    <input
                                        type="text"
                                        name="schoolLocation"
                                        value={edu.schoolLocation}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                    <input
                                        type="text"
                                        name="degree"
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                                    <input
                                        type="text"
                                        name="fieldOfStudy"
                                        value={edu.fieldOfStudy}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Month</label>
                                    <input
                                        type="text"
                                        name="graduationMonth"
                                        value={edu.graduationMonth}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Month"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                                    <input
                                        type="text"
                                        name="graduationYear"
                                        value={edu.graduationYear}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Year"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No education added yet</p>
                )}
            </div>


        </div>
    );
}