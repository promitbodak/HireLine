import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { getDocument } from "pdfjs-dist";





async function extractTextFromPDF(buffer) {
  // Convert Buffer to Uint8Array
  const uint8Array = new Uint8Array(buffer);

  // Load PDF document
  const loadingTask = getDocument({ data: uint8Array });
  const pdfDocument = await loadingTask.promise;

  let text = "";

  // Extract text from each page
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
}

// async function extractTextWithIndentation(buffer) {
//   const uint8Array = new Uint8Array(buffer);
//   const loadingTask = getDocument({ data: uint8Array });
//   const pdfDocument = await loadingTask.promise;

//   let extractedText = "";

//   for (let i = 1; i <= pdfDocument.numPages; i++) {
//     const page = await pdfDocument.getPage(i);
//     const content = await page.getTextContent();

//     // Group text items based on Y-coordinate (to maintain line structure)
//     let lines = {};

//     content.items.forEach((item) => {
//       const x = item.transform[4]; // X position
//       const y = item.transform[5]; // Y position (higher means lower on page)

//       if (!lines[y]) lines[y] = [];
//       lines[y].push({ x, text: item.str });
//     });

//     // Sort lines by Y position (top to bottom) and words by X position (left to right)
//     const pageText = Object.keys(lines)
//       .sort((a, b) => b - a) // Sort by Y descending (PDF Y-coordinates are inverted)
//       .map((y) =>
//         lines[y]
//           .sort((a, b) => a.x - b.x) // Sort words left to right
//           .map((word) => word.text)
//           .join(" ") // Reconstruct sentence
//       )
//       .join("\n"); // Preserve line breaks

//     extractedText += pageText + "\n\n"; // Add space between pages
//   }

//   return extractedText;
// }



export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, adharcard, pancard, university, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role || !pancard || !adharcard) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const existingAdharcard = await User.findOne({ adharcard });
    if (existingAdharcard) {
      return res.status(400).json({
        message: "Adhar number already exists",
        success: false,
      });
    }

    const existingPancard = await User.findOne({ pancard });
    if (existingPancard) {
      return res.status(400).json({
        message: "Pan number already exists",
        success: false,
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile image is required",
        success: false,
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      adharcard,
      pancard,
      password: hashedPassword,
      role,
      university,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    await newUser.save();

    return res.status(201).json({
      message: `Account created successfully for ${fullname}`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error registering user",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: "You don't have the necessary role to access this resource",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      adharcard: user.adharcard,
      pancard: user.pancard,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: sanitizedUser,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error login failed",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error logging out",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.id; // Assuming authentication middleware sets req.id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    if (file) {
      const fileUri = getDataUri(file);
      
      //Extract text from PDF
      // const extractedText = await extractTextWithIndentation(req.file.buffer);
      const extractedText = await extractTextFromPDF(req.file.buffer);
      

      //Upload PDF to cloudinary
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {resource_type: "raw"});
      
      //Save extracted text and resume URL in user profile
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
      user.profile.resumeString = extractedText;
      
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error updating profile",
      success: false,
    });
  }
};



















































































// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloud.js";

// export const register = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, password, adharcard, pancard, role } =
//       req.body;

//     if (
//       !fullname ||
//       !email ||
//       !phoneNumber ||
//       !password ||
//       !role ||
//       !pancard ||
//       !adharcard
//     ) {
//       return res.status(404).json({
//         message: "Missing required fields",
//         success: false,
//       });
//     }
//     const file = req.file;
//     const fileUri = getDataUri(file);
//     const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({
//         message: "Email already exists",
//         success: false,
//       });
//     }
//     const user = await User.findOne({ adharcard });
//     if (adharcard) {
//       return res.status(400).json({
//         message: "Adharnumber already exists",
//         success: false,
//       });
//     }
//     const user = await User.findOne({ pancard });
//     if (pancard) {
//       return res.status(400).json({
//         message: "Pan number already exists",
//         success: false,
//       });
//     }
//     //convert passwords to hashes
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       fullname,
//       email,
//       phoneNumber,
//       adharcard,
//       pancard,
//       password: hashedPassword,
//       role,
//       profile: {
//         profilePhoto: cloudResponse.secure_url,
//       },
//     });

//     await newUser.save();

//     return res.status(200).json({
//       message: `Account created successfully ${fullname}`,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server Error registering user",
//       success: false,
//     });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password || !adharcard || !role) {
//       return res.status(404).json({
//         message: "Missing required fields",
//         success: false,
//       });
//     }
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         message: "Incorrect email or password",
//         success: false,
//       });
//     }
//     let user = await User.findOne({ adharcard });
//     if (adharcard) {
//       return res.status(404).json({
//         message: "Incorrect Adhar Number",
//         success: false,
//       });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(404).json({
//         message: "Incorrect email or password",
//         success: false,
//       });
//     }
//     //check role correctly or not
//     if (user.role !== role) {
//       return res.status(403).json({
//         message: "You don't have the necessary role to access this resource",
//         success: false,
//       });
//     }

//     //generate token
//     const tokenData = {
//       userId: user._id,
//     };
//     const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     user = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       adharcard: user.adharcard,
//       pancard: user.pancard,
//       role: user.role,
//       profile: user.profile,
//     };

//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: "Strict",
//       })
//       .json({
//         message: `Welcome back ${user.fullname}`,
//         user,
//         success: true,
//       });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server Error login failed",
//       success: false,
//     });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     return res.status(200).cookie("token", "", { maxAge: 0 }).json({
//       message: "Logged out successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     console.log("Uploaded file:", req.file);
//     console.log("Request body:", req.body);

//     const { fullname, email, phoneNumber, bio, skills } = req.body;
//     const file = req.file;

//     // Check if file is uploaded

//     //cloudinary upload
//     const fileUri = getDataUri(file);
//     const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

//     // Initialize userId at the beginning
//     const userId = req.id; // middleware authentication

//     // Check if userId is valid
//     let user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User  not found",
//         success: false,
//       });
//     }

//     // Process skills if provided
//     let skillsArray;
//     if (skills) {
//       skillsArray = skills.split(",");
//     }

//     // Update user profile
//     if (fullname) {
//       user.fullname = fullname;
//     }
//     if (email) {
//       user.email = email;
//     }
//     if (phoneNumber) {
//       user.phoneNumber = phoneNumber;
//     }
//     if (bio) {
//       user.profile.bio = bio;
//     }
//     if (skills) {
//       user.profile.skills = skillsArray;
//     }
//     //resume
//     if (cloudResponse) {
//       user.profile.resume = cloudResponse.secure_url;
//       user.profile.resumeOriginalName = file.originalname;
//     }

//     // Save updated user
//     await user.save();

//     user = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile,
//     };

//     return res.status(200).json({
//       message: "Profile updated successfully",
//       user,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server Error updating profile",
//       success: false,
//     });
//   }
// };
