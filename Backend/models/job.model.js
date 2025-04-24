import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    numericalParameters: [     // array to store the numerical parameters created by the recruiter
      {
        type: String
      }
    ],
    intellectualParameters: [  // array to store the intellectual parameters created by the user 
      {
        type: String
      }
    ],
    numericalParametersScore: [  // Weitage of each associated parameter
      {
        type: Number 
      }
    ],
    intellectualParametersScore: [  // Weitage of each associated parameter 
      {
        type: Number
      }
    ],
    customPrompt: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
export const Job = mongoose.model("Job", jobSchema);
