import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobContext.jsx';
import { 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Star,
  Target,
  BookOpen,
  ArrowRight,
  Download
} from 'lucide-react';

const ResumeAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const { user, updateUser } = useAuth();
  const { resumeData, analysisResults, analyzeResume } = useJobs();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.resumeUploaded) {
      navigate('/resume-upload');
    }
  }, [user?.resumeUploaded, navigate]);

  const handleAnalysis = async (option) => {
    setSelectedOption(option);
    setAnalyzing(true);

    try {
      await analyzeResume(resumeData?.text || '');
      updateUser({ skillsAnalyzed: true });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const analysisOptions = [
    {
      id: 'critique',
      title: 'Resume Critique & Skill Suggestions',
      description: 'Get detailed feedback on your resume structure, content, and skill gaps with personalized improvement recommendations.',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      features: ['Comprehensive resume review', 'Skill gap analysis', 'ATS optimization tips', 'Industry-specific suggestions']
    },
    {
      id: 'rebuild',
      title: 'Questionnaire-Based Resume Rebuild',
      description: 'Answer smart questions about your experience and let AI create an optimized, ATS-friendly resume from scratch.',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      features: ['Interactive questionnaire', 'AI-powered content generation', 'Professional formatting', 'Multiple template options']
    },
    {
      id: 'matching',
      title: 'Real-Time Job & Internship Matching',
      description: 'Extract skills from your resume and instantly match with relevant job opportunities based on your qualifications.',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      features: ['Smart job matching', 'Skill extraction', 'Qualification assessment', 'Missing skills identification']
    }
  ];

  if (analyzing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full inline-block mb-6">
            <Brain className="h-12 w-12 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Resume</h1>
          <p className="text-xl text-gray-600 mb-8">
            Our AI is processing your resume and generating personalized insights...
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Extracting skills and experience...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-gray-700">Analyzing content structure...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" style={{ animationDelay: '1s' }}></div>
                <span className="text-gray-700">Generating recommendations...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisResults) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Analysis Results</h1>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">{analysisResults.overallScore}/100</span>
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
            <span className="text-gray-600">Overall Score</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Extracted Skills */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              Extracted Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisResults.extractedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-orange-600 mr-2" />
              Recommended Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisResults.skillGaps.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Section Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(analysisResults.sections).map(([section, data]) => (
              <div key={section} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">{section}</h4>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    data.score >= 80 ? 'bg-green-100 text-green-700' :
                    data.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {data.score}/100
                  </span>
                </div>
                <p className="text-sm text-gray-600">{data.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
            Improvement Suggestions
          </h3>
          <div className="space-y-3">
            {analysisResults.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/job-matching"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
          >
            Find Matching Jobs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/resume-builder"
            className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
          >
            <Download className="mr-2 h-5 w-5" />
            Rebuild Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Analysis Path</h1>
        <p className="text-xl text-gray-600">
          Select how you'd like our AI to help improve your career prospects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {analysisOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className={`p-4 rounded-xl inline-block mb-4 bg-gradient-to-r ${option.color}`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {option.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {option.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleAnalysis(option.id)}
                className={`w-full py-3 px-4 bg-gradient-to-r ${option.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center`}
              >
                <Brain className="mr-2 h-5 w-5" />
                Start Analysis
              </button>
            </div>
          );
        })}
      </div>

      {resumeData && (
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Resume</h3>
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{resumeData.fileName}</p>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(resumeData.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;