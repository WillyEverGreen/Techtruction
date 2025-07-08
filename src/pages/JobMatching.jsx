import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/JobContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Building
} from 'lucide-react';

const JobMatching = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [categorizedJobs, setCategorizedJobs] = useState({
    qualified: [],
    closeMatch: [],
    skillGap: []
  });

  const { categorizeJobs, userSkills } = useJobs();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const jobs = categorizeJobs(userSkills);
    setCategorizedJobs(jobs);
    
    const totalJobs = jobs.qualified.length + jobs.closeMatch.length + jobs.skillGap.length;
    updateUser({ jobsMatched: totalJobs });
  }, [userSkills]);

  const filterJobs = (jobs) => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type.toLowerCase() === filterType.toLowerCase());
    }

    if (sortBy === 'match') {
      filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  };

  const JobCard = ({ job, category }) => {
    const getMatchColor = (score) => {
      if (score >= 80) return 'text-green-600 bg-green-100';
      if (score >= 60) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
    };

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'qualified':
          return <CheckCircle className="h-5 w-5 text-green-600" />;
        case 'closeMatch':
          return <AlertCircle className="h-5 w-5 text-yellow-600" />;
        case 'skillGap':
          return <TrendingUp className="h-5 w-5 text-red-600" />;
        default:
          return null;
      }
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={job.logo}
              alt={job.company}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600 flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getCategoryIcon(category)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
              {job.matchScore}% Match
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {job.type}
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            {job.salary}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {job.experience}
          </div>
        </div>

        <p className="text-gray-700 mb-4">{job.description}</p>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => {
                const isMatching = job.matchingSkills?.includes(skill);
                return (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isMatching
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {skill}
                    {isMatching && ' ✓'}
                  </span>
                );
              })}
            </div>
          </div>

          {job.missingSkills?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Skills to Develop</h4>
              <div className="flex flex-wrap gap-2">
                {job.missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
            Apply Now
          </button>
          <button className="py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200">
            Save
          </button>
        </div>
      </div>
    );
  };

  const JobSection = ({ title, jobs, category, color, description }) => {
    const filteredJobs = filterJobs(jobs);

    if (filteredJobs.length === 0) return null;

    return (
      <div className="mb-8">
        <div className={`p-6 rounded-2xl mb-6 ${color}`}>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/90">{description}</p>
          <div className="mt-4 flex items-center space-x-4 text-white/80">
            <span>{filteredJobs.length} opportunities</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} category={category} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Matches</h1>
        <p className="text-xl text-gray-600">
          Discover opportunities tailored to your skills and experience
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="match">Best Match</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Qualified Jobs</p>
              <p className="text-3xl font-bold">{categorizedJobs.qualified.length}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Close Matches</p>
              <p className="text-3xl font-bold">{categorizedJobs.closeMatch.length}</p>
            </div>
            <AlertCircle className="h-12 w-12 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Growth Opportunities</p>
              <p className="text-3xl font-bold">{categorizedJobs.skillGap.length}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-red-200" />
          </div>
        </div>
      </div>

      {/* Job Sections */}
      <JobSection
        title="Perfect Matches"
        jobs={categorizedJobs.qualified}
        category="qualified"
        color="bg-gradient-to-r from-green-500 to-green-600"
        description="Jobs where you meet most or all requirements"
      />

      <JobSection
        title="Close Matches"
        jobs={categorizedJobs.closeMatch}
        category="closeMatch"
        color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        description="Jobs where you meet many requirements with minor skill gaps"
      />

      <JobSection
        title="Growth Opportunities"
        jobs={categorizedJobs.skillGap}
        category="skillGap"
        color="bg-gradient-to-r from-red-500 to-red-600"
        description="Jobs that could be great with some additional skills"
      />

      {filterJobs([...categorizedJobs.qualified, ...categorizedJobs.closeMatch, ...categorizedJobs.skillGap]).length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or upload your resume to get better matches.</p>
        </div>
      )}
    </div>
  );
};

export default JobMatching;