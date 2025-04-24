import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    scores: {
      numerical_scores: {
          type: Map,
          of: Number,  // Dynamic key-value pairs
          // required: true
      },
      intellectual_scores: {
          type: Map,
          of: Number,  // Dynamic key-value pairs
          // required: true
      },
      final_weighted_score: {
          type: Number,
          // required: true
      }
  }
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);
