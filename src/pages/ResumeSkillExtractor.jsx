import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Target, Star } from "lucide-react";

const ResumeSkillExtractor = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const validTypes = ["application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF file");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    setError("");
    setFile(selectedFile);
    setSkills([]);
    setAnalysisComplete(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('resume', file);

      console.log('Uploading file:', file.name);
      
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.skills || !Array.isArray(data.skills)) {
        console.warn('No skills found in response:', data);
        setSkills([]);
      } else {
        setSkills(data.skills);
      }
      
      setAnalysisComplete(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Failed to process resume: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full inline-block mb-6">
            <Brain className="h-12 w-12 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Processing Your Resume
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Our AI is extracting skills from your resume...
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">
                  Extracting text from PDF...
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span className="text-gray-700">
                  Analyzing content for skills...
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"
                  style={{ animationDelay: "1s" }}
                ></div>
                <span className="text-gray-700">
                  Generating skill list...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisComplete) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="p-4 bg-green-100 rounded-full inline-block mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {skills.length > 0 ? 'Skills Extracted Successfully!' : 'Analysis Complete'}
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {skills.length}
            </span>
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
            <span className="text-gray-600">Skills Found</span>
          </div>
          <p className="text-xl text-gray-600">
            {skills.length > 0 
              ? 'Here are the technical skills we found in your resume:'
              : 'No technical skills were detected in your resume. This could be because:'
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 text-blue-600 mr-2" />
            {skills.length > 0 ? 'Extracted Skills' : 'Analysis Results'}
          </h3>
          
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-yellow-100 rounded-full inline-block mb-4">
                <AlertCircle className="h-12 w-12 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">No Skills Detected</h4>
              <ul className="text-gray-600 space-y-2 text-left max-w-md mx-auto">
                <li>• The resume might not contain technical skills</li>
                <li>• Skills might be written in a different format</li>
                <li>• The PDF might be image-based (scanned)</li>
                <li>• Try uploading a different resume format</li>
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setFile(null);
              setSkills([]);
              setAnalysisComplete(false);
            }}
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
          >
            Upload Another Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Resume Skill Extractor
        </h1>
        <p className="text-xl text-gray-600">
          Upload your resume and let our AI extract your technical skills
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {!file ? (
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full inline-block">
                <Upload className="h-12 w-12 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Drop your resume here
                </h3>
                <p className="text-gray-600 mb-4">
                  or click to browse your files
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF files (max 10MB)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{file.name}</h3>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {uploading ? "Processing..." : "Extract Skills"}
              </button>
              <button
                onClick={() => setFile(null)}
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
              >
                Choose Different File
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 text-blue-600 mr-2" />
          How it works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              1
            </div>
            <p>Upload your PDF resume</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              2
            </div>
            <p>AI extracts text and analyzes content</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              3
            </div>
            <p>Get your technical skills list</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSkillExtractor; 