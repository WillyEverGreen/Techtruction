<<<<<<< HEAD
# Job-Khojo
=======
# Resume Skill Extractor - MERN + Python Application

A full-stack web application that allows users to upload resumes and extract technical skills using AI-powered analysis. Built with React frontend, Node.js backend, and Python Flask processor.

## 🏗️ Architecture

```
Job Portal/project/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Application pages
│   └── main.jsx          # React entry point
├── server/                # Node.js Express backend
│   ├── index.js          # Express server
│   ├── data/             # User data storage
│   └── package.json      # Node.js dependencies
├── processor/             # Python Flask processor
│   ├── app.py            # Flask application
│   └── requirements.txt  # Python dependencies
├── uploads/              # File upload storage
└── package.json          # Frontend dependencies
```

## 🚀 Features

- **Resume Upload**: Drag & drop or click to upload PDF/DOC files
- **Skill Extraction**: AI-powered analysis to extract technical skills
- **Real-time Processing**: Immediate feedback during analysis
- **User Management**: Registration and profile management
- **Job Matching**: Match extracted skills with job requirements
- **Modern UI**: Responsive design with Tailwind CSS

## 📋 Prerequisites

### System Requirements
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

### Additional Software
- **Tesseract OCR** (for scanned PDF processing):
  - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
  - macOS: `brew install tesseract`
  - Linux: `sudo apt-get install tesseract-ocr`

## 🛠️ Installation & Setup

### 1. Clone and Navigate
```bash
cd "Job Portal/project"
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 5. Create Required Directories
```bash
mkdir uploads
mkdir server/data
```

## 🚀 Running the Application

### Start All Servers

**Terminal 1 - Express Backend:**
```bash
cd server
node index.js
```
Expected output: `Express server running on http://localhost:5000`

**Terminal 2 - Flask Processor:**
```bash
cd processor
python app.py
```
Expected output: `Running on http://127.0.0.1:5001`

**Terminal 3 - React Frontend:**
```bash
npm run dev
```
Expected output: `Local: http://localhost:5173/`

## 📁 Project Structure Details

### Frontend (`src/`)
- **Components**: Reusable UI components (Navbar, etc.)
- **Context**: State management (AuthContext, JobContext)
- **Pages**: Main application pages:
  - `Landing.jsx`: Welcome page
  - `Login.jsx` & `Register.jsx`: Authentication
  - `ResumeUpload.jsx`: File upload interface
  - `ResumeAnalysis.jsx`: Skill analysis results
  - `JobMatching.jsx`: Job recommendations
  - `Profile.jsx`: User profile management

### Backend (`server/`)
- **Express Server**: Handles file uploads and API requests
- **File Storage**: Multer configuration for file handling
- **User Management**: Registration and authentication
- **Flask Integration**: Communicates with Python processor

### Processor (`processor/`)
- **Flask App**: Python-based skill extraction
- **PDF Processing**: Text extraction and OCR
- **Skill Matching**: Predefined skill list matching
- **API Endpoints**: `/process` for skill extraction

## 🔧 Configuration

### Port Configuration
- **Frontend**: `http://localhost:5173`
- **Express Backend**: `http://localhost:5000`
- **Flask Processor**: `http://localhost:5001`

### File Upload Settings
- **Supported Formats**: PDF, DOC, DOCX
- **Maximum Size**: 5MB
- **Storage Location**: `uploads/` directory

## 📊 API Endpoints

### Express Backend (`http://localhost:5000`)
- `POST /upload`: Upload resume file
- `POST /api/login`: User registration
- `POST /api/resume`: Save resume data
- `GET /`: Health check

### Flask Processor (`http://localhost:5001`)
- `POST /process`: Extract skills from uploaded file
- `GET /`: Display latest analysis results

## 🔍 Skill Extraction Process

1. **File Upload**: User uploads resume via React frontend
2. **Express Processing**: File saved to `uploads/` directory
3. **Flask Analysis**: Python processor extracts text and identifies skills
4. **Skill Matching**: Compares extracted text against predefined skill list
5. **Results Display**: Returns extracted skills to frontend

### Supported Skills
The system recognizes 80+ technical skills including:
- Programming Languages: Python, JavaScript, Java, C++, C#
- Frameworks: React, Node.js, Express, Flask, Django
- Databases: MongoDB, PostgreSQL, MySQL, SQLite
- Cloud Platforms: AWS, Azure, GCP, Heroku
- Tools: Git, Docker, Kubernetes, Jenkins
- And many more...

## 🐛 Troubleshooting

### Common Issues

**1. "No such file or directory" Error**
- Ensure all servers are running in correct directories
- Check that `uploads/` directory exists
- Verify file paths in server configuration

**2. "Module not found" Errors**
- Run `npm install` in both root and server directories
- Install Python dependencies: `pip install -r requirements.txt`

**3. OCR Processing Issues**
- Install Tesseract OCR on your system
- Ensure Tesseract is in your system PATH

**4. Port Already in Use**
- Kill existing processes on ports 5000, 5001, 5173
- Or change ports in respective configuration files

### Debug Commands
```bash
# Check if servers are running
netstat -an | findstr :5000
netstat -an | findstr :5001
netstat -an | findstr :5173

# Test file upload
python test_upload.py
```

## 🧪 Testing

### Manual Testing
1. Start all servers
2. Navigate to `http://localhost:5173`
3. Register a new account
4. Upload a resume file
5. Click "Analyze" to extract skills
6. Verify extracted skills are displayed

### Automated Testing
```bash
# Test backend upload functionality
python test_upload.py
```

## 📝 Development Notes

### File Structure Best Practices
- Keep frontend and backend code separate
- Use consistent naming conventions
- Maintain clear API documentation

### Security Considerations
- File upload validation implemented
- CORS configured for local development
- Input sanitization for user data

### Performance Optimizations
- File size limits enforced
- Efficient PDF text extraction
- Caching for repeated requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs for error messages
3. Ensure all dependencies are installed
4. Verify all servers are running on correct ports

---

**Happy Coding! 🚀** 
>>>>>>> e555a5a (Initial commit)
