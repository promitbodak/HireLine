import { Job } from "../models/job.model.js";
//Admin job posting
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      numericalParameters,
      intellectualParameters,
      numericalParametersScore,
      intellectualParametersScore
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId ||
      !numericalParameters ||
      !intellectualParameters ||
      !numericalParametersScore ||
      !intellectualParametersScore
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }


    //Function to generate the custom Prompt for the specified job
    const generatePrompt = (description, requirements, nuPa, inPa, nuPaScore, inPaScore) => {
      const nuPaArr = nuPa.split(",");
      const inPaArr = inPa.split(",");
      const nuPaScoreArr = nuPaScore.split(",");
      const inPaScoreArr = inPaScore.split(",");

      let numericalParametersText = "";
      let intellectualParametersText = "";

      //Formatting Numerical Parameters
      nuPaArr.forEach((param, index) => {
        numericalParametersText += `-${param} (Weightage: ${nuPaScoreArr[index]})\n`;
      });

      //Formatting Intellectual Parameters
      inPaArr.forEach((param, index) => {
        intellectualParametersText += `-${param} (Weightage: ${inPaScoreArr[index]})\n`;
      });

      //Constructing Prompt
      const prompt = `
    You are an unbiased resume evaluator. Your task is to analyze the given resume for the role of the given job description based on the provided judging parameters. 
Each parameter is categorized as either a Numerical Parameter or an Intellectual Parameter.
Numerical Parameters are objective and measurable, whereas Intellectual Parameters require qualitative assessment.
Each parameter has a respective weightage score.

## Job Description
${description}

## Skill Requirements
${requirements}

### Numerical Parameters (Objective Evaluation)
${numericalParametersText}

### Intellectual Parameters (Subjective Evaluation)
${intellectualParametersText}

## Task
Analyze the given resume text and assign a score out of 10 for each parameter based on relevance, completeness, and quality.
Ensure the scoring follows a fair, unbiased methodology based on industry standards.

## Expected JSON Response Format:
{
    "numerical_scores": {
        ${nuPaArr.map((param) => `"${param}": {score_out_of_100}`).join(",\n        ")}
    },
    "intellectual_scores": {
        ${inPaArr.map((param) => `"${param}": {score_out_of_100}`).join(",\n        ")}
    },
    "final_weighted_score": {total_weighted_score_out_of_1000}
}
Return the text such that i can modify the response by using JSON.parse function

### Example Response:
{
  numerical_scores: {
    'Minimun Educational qualification: Graduate': 100,
    'Number of projects: minimum 2': 100,
    'Collage CGPA: out of 10': 100,
    'Number of known Languages': 100
  },
  intellectual_scores: {
    'Technical Depth of projects': 70,
    'Soft skills': 80,
    'Leadership Quality': 60
  },
  final_weighted_score: 790
}

    `
    return prompt
    }




    const promptText = generatePrompt(description, requirements, numericalParameters, intellectualParameters, numericalParametersScore, intellectualParametersScore );
    
    
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),     // Getting the values as coma (,) separated string and converting it to a list/Array of substrings.
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
      numericalParameters: numericalParameters.split(","),
      intellectualParameters: intellectualParameters.split(","),
      numericalParametersScore: numericalParametersScore.split(","),
      intellectualParametersScore: intellectualParametersScore.split(","),
      customPrompt: promptText
    });
    res.status(201).json({
      message: "Job posted successfully.",
      job,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }
    return res.status(200).json({ job, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Admin job created

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      sort: { createdAt: -1 },
    });
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
