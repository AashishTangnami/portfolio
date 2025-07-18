"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { IoArrowBack, IoDownload, IoCheckmark } from 'react-icons/io5';
import { FaEdit, FaUser, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { PersonalData, ExperienceData, EducationData, ProjectData } from '../utils/type';

// Animation variants
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Editable Section Component
const EditableSection = ({ title, icon: Icon, children, isEditing, onToggleEdit }: any) => (
  <motion.div
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
    className="bg-white rounded-lg shadow-md p-6 mb-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Icon className="text-blue-600 text-xl" />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleEdit}
        className={`p-2 rounded-full transition-colors ${
          isEditing ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {isEditing ? <IoCheckmark /> : <FaEdit />}
      </motion.button>
    </div>
    {children}
  </motion.div>
);

// Typing Effect Component
const TypingEffect = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 50 + delay);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span className="relative">
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default function ResumePage() {
  // State management
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);

  // Editing states
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [progress, setProgress] = useState(0);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setProgress(20);
        const [personalRes, experienceRes, educationRes, projectRes] = await Promise.all([
          fetch('/api/json/personal.json'),
          fetch('/api/json/experience.json'),
          fetch('/api/json/education.json'),
          fetch('/api/json/project.json')
        ]);

        setProgress(60);
        const [personal, experience, education, projects] = await Promise.all([
          personalRes.json(),
          experienceRes.json(),
          educationRes.json(),
          projectRes.json()
        ]);

        setProgress(80);
        setPersonalData(personal.personal);
        setExperienceData(experience.experience);
        setEducationData(education.education);
        setProjectData(projects.projects);

        setProgress(100);
        setTimeout(() => setIsLoading(false), 500);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save simulation
  useEffect(() => {
    if (editingSection) {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [editingSection, personalData, experienceData, educationData, projectData]);

  const toggleEdit = (section: string) => {
    setEditingSection(editingSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Resume Builder...</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <IoArrowBack className="text-xl" />
                <span>Back to Portfolio</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                <TypingEffect text="Resume Builder" />
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Save Status */}
              <div className="flex items-center space-x-2">
                {saveStatus === 'saving' && (
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <IoCheckmark className="text-lg" />
                    <span className="text-sm">Saved</span>
                  </div>
                )}
              </div>

              {/* Export Button */}
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <IoDownload />
                <span>Export PDF</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                <TypingEffect text="Edit Your Resume" delay={1000} />
              </h2>
              <p className="text-gray-600">
                <TypingEffect text="Click the edit icons to modify sections in real-time" delay={2000} />
              </p>
            </div>

            {/* Personal Information */}
            {personalData && (
              <EditableSection
                title="Personal Information"
                icon={FaUser}
                isEditing={editingSection === 'personal'}
                onToggleEdit={() => toggleEdit('personal')}
              >
                {editingSection === 'personal' ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={personalData.name}
                      onChange={(e) => setPersonalData({...personalData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Name"
                    />
                    <input
                      type="text"
                      value={personalData.title}
                      onChange={(e) => setPersonalData({...personalData, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Professional Title"
                    />
                    <textarea
                      value={personalData.summary}
                      onChange={(e) => setPersonalData({...personalData, summary: e.target.value})}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Professional Summary"
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-lg">{personalData.name}</h4>
                    <p className="text-blue-600 font-medium">{personalData.title}</p>
                    <p className="text-gray-600 mt-2">{personalData.summary}</p>
                  </div>
                )}
              </EditableSection>
            )}

            {/* Experience */}
            <EditableSection
              title="Work Experience"
              icon={FaBriefcase}
              isEditing={editingSection === 'experience'}
              onToggleEdit={() => toggleEdit('experience')}
            >
              <div className="space-y-4">
                {experienceData.map((exp, index) => (
                  <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p className="text-blue-600">{exp.company}</p>
                    <p className="text-gray-500 text-sm">{exp.period}</p>
                    {editingSection === 'experience' && (
                      <div className="mt-2 space-y-2">
                        {exp.responsibilities.map((resp: string, i: number) => (
                          <input
                            key={i}
                            type="text"
                            value={resp}
                            onChange={(e) => {
                              const newExp = [...experienceData];
                              newExp[index].responsibilities[i] = e.target.value;
                              setExperienceData(newExp);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </EditableSection>

            {/* Education */}
            <EditableSection
              title="Education"
              icon={FaGraduationCap}
              isEditing={editingSection === 'education'}
              onToggleEdit={() => toggleEdit('education')}
            >
              <div className="space-y-4">
                {educationData.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-green-600">{edu.institution}</p>
                    <p className="text-gray-500 text-sm">{edu.period}</p>
                    <p className="text-gray-600 text-sm">{edu.field}</p>
                  </div>
                ))}
              </div>
            </EditableSection>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Live Preview</h2>
                <p className="text-gray-600">See your changes in real-time</p>
              </div>

              {/* Resume Preview Content */}
              {personalData && (
                <div className="space-y-6">
                  <div className="text-center border-b pb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{personalData.name}</h1>
                    <p className="text-blue-600 font-medium text-lg">{personalData.title}</p>
                    <p className="text-gray-600 mt-2">{personalData.email} | {personalData.location}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{personalData.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                    <div className="space-y-4">
                      {experienceData.slice(0, 2).map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{exp.position}</h4>
                              <p className="text-blue-600 text-sm">{exp.company}</p>
                            </div>
                            <span className="text-gray-500 text-sm">{exp.period}</span>
                          </div>
                          <ul className="mt-2 text-sm text-gray-700 space-y-1">
                            {exp.responsibilities.slice(0, 2).map((resp: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                    <div className="space-y-3">
                      {educationData.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <p className="text-green-600 text-sm">{edu.institution}</p>
                          <p className="text-gray-500 text-sm">{edu.period}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}