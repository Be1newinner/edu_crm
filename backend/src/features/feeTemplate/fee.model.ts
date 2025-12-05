import mongoose from "mongoose";

const FeeTemplateSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  name: { type: String, required: true }, // "Course Fee Q1", "Admission Fee"
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  components: [
    {
      name: String, // "Tuition", "Exam", "Library"
      amount: Number,
      dueDate: Date,
    },
  ],
  totalAmount: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

FeeTemplateSchema.index({ instituteId: 1, name: 1 }, { unique: true });

export const FeeTemplateModel = mongoose.model("Fee", FeeTemplateSchema);
