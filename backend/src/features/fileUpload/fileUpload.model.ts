import mongoose, { model } from "mongoose";

const FileUploadSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },      // Cloudinary/public URL
  mimeType: String,
  size: Number,
  ownerType: { type: String, enum: ['STUDENT', 'STAFF', 'COURSE', 'BATCH'] },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  tags: [String],                                  // ["id-proof", "fee-receipt"]
  visibility: { type: String, enum: ['PUBLIC', 'PRIVATE', 'ROLE_BASED'], default: 'PRIVATE' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const FileUploadModel=model("FileUpload",FileUploadSchema)
