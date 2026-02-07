# 🌟 Solvio: Job Portal Platform 🌟

## 💼 Overview

Welcome to **Solvio** - Your Ultimate Job Portal Platform! This innovative web application connects job seekers with recruiters, making the job search process seamless and efficient. With the ability to search for jobs, apply with ease, manage applications, and for recruiters to post and manage job listings, Solvio is designed to simplify your career journey.

## 🚀 Features

- **🔍 Job Search**: Browse through millions of jobs filtered by category, location, and other criteria.
- **👤 Dual User System**: Separate portals for job seekers (Candidates) and employers (Recruiters).
- **📝 Easy Application Process**: Apply to jobs with a simple, streamlined process and resume upload.
- **📊 Dashboard for Recruiters**: Manage job postings, view applications, and track candidates all in one place.
- **📁 Application Management**: Candidates can track all their job applications in one convenient location.
- **🎨 Modern UI/UX**: Enjoy a beautiful, responsive interface with smooth animations and intuitive design.
- **🔐 Secure Authentication**: JWT-based authentication ensures secure access for both candidates and recruiters.
- **☁️ File Upload**: Seamless resume and document upload using Cloudinary integration.

## 🛠️ Technologies Used

- **Frontend**: 
  - React.js (v19.0.0)
  - Vite
  - TailwindCSS
  - Framer Motion
  - React Router DOM
  - Axios
  - React Hot Toast
- **Backend**: 
  - Node.js
  - Express.js
- **Database**: 
  - MongoDB
  - Mongoose
- **Authentication**: 
  - JWT (JSON Web Tokens)
- **File Upload**: 
  - Cloudinary
  - Multer

## 📋 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohitgithub7568/Solvio-main.git
   cd Solvio-main
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the `backend` directory
   - Add your MongoDB connection string, JWT secret, Cloudinary credentials, etc.

5. Start the backend server:
   ```bash
   cd backend
   npm run server
   ```

6. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be running at `http://localhost:5173` (or the port specified by Vite)

## 📋 Usage

- **Candidate Registration**: Job seekers can create an account, upload their resume, and start searching for jobs.
- **Recruiter Registration**: Companies can register, create profiles, and post job openings.
- **Job Search**: Browse jobs by category, search by keywords, and filter results.
- **Application Process**: Apply to jobs with a single click, upload required documents, and track application status.
- **Recruiter Dashboard**: Post new jobs, manage existing listings, view applications, and shortlist candidates.
- **Profile Management**: Update personal information, manage resumes, and track application history.

## 🗂️ Project Structure

```
Solvio-main/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── db/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── assets/
    │   └── utils/
    └── public/
```

## 🔑 Key Features

### For Job Seekers:
- Browse and search job listings
- Apply to jobs with resume upload
- Track application status
- Manage profile and resume

### For Recruiters:
- Post and manage job listings
- View and manage applications
- Shortlist candidates
- Company profile management

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions, issues, and feature requests are welcome! 

**Author:** Mohit Soni

## 📧 Contact

**Mohit Soni**  
For queries or support, please reach out through the repository.

---

**Built with ❤️ by Mohit Soni**

