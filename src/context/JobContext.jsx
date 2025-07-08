import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [userCity, setUserCity] = useState("");
  const { user } = useAuth();

  // Set userCity from AuthContext's user.city if available
  useEffect(() => {
    if (user && user.city && !userCity) {
      setUserCity(user.city);
    }
  }, [user, userCity]);

  const fetchJobs = async (searchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Use userCity as default location if not provided
      const paramsObj = { ...searchParams };
      if (!paramsObj.location && userCity) {
        paramsObj.location = userCity;
      }
      const params = new URLSearchParams(paramsObj).toString();
      const res = await fetch(
        `/api/jobs/search?${params}`
      );
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async (resumeText) => {
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Improved city extraction logic
    let extractedCity = "";
    const lines = resumeText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    // Try to find a line that starts with "Location:" or "City:"
    for (const line of lines) {
      if (/^(Location|City):/i.test(line)) {
        extractedCity = line.split(":")[1].trim();
        break;
      }
    }
    // If not found, try to use the first line if it looks like a city (not a name)
    if (!extractedCity && lines.length > 0) {
      if (lines[0].length < 30 && /^[A-Za-z ]+$/.test(lines[0])) {
        extractedCity = lines[0];
      }
    }
    // Fallback to user.city from registration if still not found
    if (!extractedCity && user && user.city) {
      extractedCity = user.city;
    }
    if (extractedCity) {
      setUserCity(extractedCity);
    }

    const extractedSkills = [
      "JavaScript",
      "React",
      "CSS",
      "HTML",
      "Git",
      "Node.js",
    ];
    const suggestions = [
      "Add more quantifiable achievements to your experience section",
      "Include relevant keywords for ATS optimization",
      "Consider adding a professional summary",
      "Highlight your most impactful projects",
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
        education: { score: 90, feedback: "Well structured" },
      },
    };

    setUserSkills(extractedSkills);
    setAnalysisResults(results);
    return results;
  };

  const matchJobs = (skills = userSkills) => {
    return jobs
      .map((job) => {
        const matchingSkills = job.skills.filter((skill) =>
          skills.some(
            (userSkill) =>
              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );

        const matchScore = Math.min(
          95,
          Math.round((matchingSkills.length / job.skills.length) * 100)
        );

        return {
          ...job,
          matchScore,
          matchingSkills,
          missingSkills: job.skills.filter(
            (skill) => !matchingSkills.includes(skill)
          ),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const categorizeJobs = (skills = userSkills) => {
    const matchedJobs = matchJobs(skills);

    return {
      qualified: matchedJobs.filter((job) => job.matchScore >= 80),
      closeMatch: matchedJobs.filter(
        (job) => job.matchScore >= 60 && job.matchScore < 80
      ),
      skillGap: matchedJobs.filter((job) => job.matchScore < 60),
    };
  };

  const value = {
    jobs,
    setJobs,
    loading,
    error,
    fetchJobs,
    userSkills,
    setUserSkills,
    resumeData,
    setResumeData,
    analysisResults,
    setAnalysisResults,
    analyzeResume,
    matchJobs,
    categorizeJobs,
    userCity,
    setUserCity,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
