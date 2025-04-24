import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai";

//Helper
const validateAndConvertScores = (scores) => {
  // Ensure `scores` exists and is an object
  if (!scores || typeof scores !== "object") {
    return {
      numerical_scores: new Map(),
      intellectual_scores: new Map(),
      final_weighted_score: 0,
    };
  }

  return {
    numerical_scores: convertToNumberMap(scores.numerical_scores),
    intellectual_scores: convertToNumberMap(scores.intellectual_scores),
    final_weighted_score: Number(scores.final_weighted_score) || 0,
  };
};

// Helper function to convert objects to Map<number>
const convertToNumberMap = (obj) => {
  if (!obj || typeof obj !== "object") return new Map();

  const numberMap = new Map();
  for (const key in obj) {
    const value = Number(obj[key]);
    if (!isNaN(value)) {
      numberMap.set(key, value);
    }
  }
  return numberMap;
};


//Auxiliary function for LLM API calling
const generateScore = async (resumeText, scoreContext) => {

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: resumeText,
    config: {
      systemInstruction: scoreContext,
    },
  });
  
  try {
     // Remove Markdown-style code block formatting (```json ... ```)
     const cleanedText = response.text.replace(/```json|```/g, "").trim();

     // Parse cleaned text as JSON
     const parsedResponse = JSON.parse(cleanedText);
     console.log(parsedResponse);   // this print is for testing purpose
     return validateAndConvertScores(parsedResponse);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", error);
    return validateAndConvertScores(null); // Handle errors gracefully
  }
}

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Invalid job id", success: false });
    }
    // check if the user already has applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    //check if the job exists or not
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    //Getting the Resume text from user
    //Getting the score generation prompt from the job
    //calling Gemini API and obtaining result

    const currUser = await User.findById(userId);
    const resumeText = currUser.profile.resumeString;
    const scoreContext = job.customPrompt;
    const jsonResponse = await generateScore(resumeText, scoreContext);



    // create a new application

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      scores: jsonResponse
    });
    job.applications.push(newApplication._id);
    await job.save();

    return res
      .status(201)
      .json({ message: "Application submitted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!application) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      select:"scores",
      options: { sort: {scores: -1, createdAt: -1 } },  // touched
      populate: { path: "applicant", options: { sort: { createdAt: -1 } } },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
