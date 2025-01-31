import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    position: {
      type: String,
      required: [true, 'Job position is required'],
      maxlength: [100, 'Position must be at least 3 characters long'], // Adjusted minlength
    },
    status: {
      type: String,
      enum: ['pending', 'reject', 'interview'],
      default: 'pending',
    },
    workType: {
      type: String, // Added the missing `type` key
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      default: 'full-time',
    },
    workLocation: {
      type: String,
      default: 'Mumbai',
      required: [true, 'Work Location is required'],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
