import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name) {
      return res.status(400).json({ success: false, message: "Enter your name" });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Enter your email" });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "Enter your password" });
    }



    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Try logging in or use a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary only if provided (buffer works on Render; path does not)
    let imageUrl = "";
    if (imageFile && imageFile.buffer) {
      const dataUri = `data:${imageFile.mimetype || "image/jpeg"};base64,${imageFile.buffer.toString("base64")}`;
      const imageUploadUrl = await cloudinary.uploader.upload(dataUri);
      imageUrl = imageUploadUrl.secure_url;
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
    });

    await user.save();

    const token = await generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      userData: user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    const message = error?.message || "Registration failed";
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production" ? "Registration failed. Please try again." : message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = await generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userData: user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const fetchUserData = async (req, res) => {
  try {
    const userData = req.userData;

    return res.status(200).json({
      success: true,
      message: "user data fetched successfully",
      userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user data fetched failed",
    });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userData._id;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Job ID are required",
      });
    }

    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });

    if (isAlreadyApplied) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const jobApplication = new JobApplication({
      jobId,
      userId,
      companyId: jobData.companyId,
      date: new Date(),
    });

    await jobApplication.save();

    return res.status(201).json({
      success: true,
      message: "Job applied successfully",
      jobApplication,
    });
  } catch (error) {
    console.error("Job application error:", error);

    return res.status(500).json({
      success: false,
      message: "Job application failed",
    });
  }
};

export const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.userData._id;

    const application = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title location date status");

    return res.status(200).json({
      success: true,
      message: "Jobs application fetched successfully",
      jobApplications: application,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs application",
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const userId = req.userData._id;
    const resumeFile = req.file;

    console.log("Upload resume request - User ID:", userId);
    console.log("Resume file:", resumeFile ? resumeFile.filename : "No file");

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    console.log("Uploading to Cloudinary...");
    // Upload resume to Cloudinary (buffer works on Render; path does not)
    const resumeDataUri = `data:${resumeFile.mimetype || "application/pdf"};base64,${resumeFile.buffer.toString("base64")}`;
    const uploadedResumeUrl = await cloudinary.uploader.upload(resumeDataUri, { resource_type: "raw" });
    console.log("Cloudinary upload successful:", uploadedResumeUrl.secure_url);

    // Update user's resume in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { resume: uploadedResumeUrl.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Resume updated in database for user:", updatedUser.email);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: uploadedResumeUrl.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};
