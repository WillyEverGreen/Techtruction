import React, { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

// Dummy job data
const DUMMY_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    description: "Build amazing user interfaces with React and modern web technologies.",
    skills: ["React", "JavaScript", "CSS", "HTML", "Git"],
    experience: "2-4 years",
    matchScore: 95,
    logo: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Innovation Labs",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90,000 - $140,000",
    description: "Work on cutting-edge projects using MERN stack and cloud technologies.",
    skills: ["React", "Node.js", "MongoDB", "Express", "AWS"],
    experience: "3-5 years",
    matchScore: 88,
    logo: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Software Engineer Intern",
    company: "StartupXYZ",
    location: "Austin, TX",
    type: "Internship",
    salary: "$25/hour",
    description: "Learn and contribute to our growing platform while working with experienced engineers.",
    skills: ["Python", "JavaScript", "Git", "SQL"],
    experience: "0-1 years",
    matchScore: 75,
    logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 4,
    title: "React Developer",
    company: "Digital Solutions",
    location: "Remote",
    type: "Contract",
    salary: "$60-80/hour",
    description: "Build responsive web applications for clients across various industries.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experience: "2-3 years",
    matchScore: 92,
    logo: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "DataFlow Inc",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$85,000 - $125,000",
    description: "Design and maintain scalable backend systems and APIs.",
    skills: ["Node.js", "Python", "PostgreSQL", "Docker", "Kubernetes"],
    experience: "3-6 years",
    matchScore: 70,
    logo: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  }
];

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState(DUMMY_JOBS);
  const [userSkills, setUserSkills] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const analyzeResume = async (resumeText) => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const extractedSkills = ["JavaScript", "React", "CSS", "HTML", "Git", "Node.js"];
    const suggestions = [
      "Add more quantifiable achievements to your experience section",
      "Include relevant keywords for ATS optimization",
      "Consider adding a professional summary",
      "Highlight your most impactful projects"
    ];
    
    const skillGaps = ["TypeScript", "Docker", "AWS", "Testing"];
    
    const results = {
      extractedSkills,
      suggestions,
      skillGaps,
      overallScore: 78,
      sections: {
        contact: { score: 95, feedback: "Complete and professional" },
        summary: { score: 60, feedback: "Could be more compelling" },
        experience: { score: 80, feedback: "Good detail, add more metrics" },
        skills: { score: 75, feedback: "Add trending technologies" },
        education: { score: 90, feedback: "Well structured" }
      }
    };
    
    setUserSkills(extractedSkills);
    setAnalysisResults(results);
    return results;
  };

  const matchJobs = (skills = userSkills) => {
    return jobs.map(job => {
      const matchingSkills = job.skills.filter(skill => 
        skills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      
      const matchScore = Math.min(95, Math.round((matchingSkills.length / job.skills.length) * 100));
      
      return {
        ...job,
        matchScore,
        matchingSkills,
        missingSkills: job.skills.filter(skill => !matchingSkills.includes(skill))
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const categorizeJobs = (skills = userSkills) => {
    const matchedJobs = matchJobs(skills);
    
    return {
      qualified: matchedJobs.filter(job => job.matchScore >= 80),
      closeMatch: matchedJobs.filter(job => job.matchScore >= 60 && job.matchScore < 80),
      skillGap: matchedJobs.filter(job => job.matchScore < 60)
    };
  };

  const value = {
    jobs,
    userSkills,
    setUserSkills,
    resumeData,
    setResumeData,
    analysisResults,
    analyzeResume,
    matchJobs,
    categorizeJobs
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};