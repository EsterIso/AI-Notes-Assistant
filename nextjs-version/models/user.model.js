import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subscription: {
      plan: { type: String, enum: ['free', 'pro'], default: 'free' },
      stripeCustomerId: { type: String },
    }
  },
  { timestamps: true }
);

// 🔗 Virtual: link user → notes
userSchema.virtual('notes', {
  ref: 'Note',
  localField: 'clerkId',
  foreignField: 'userId',
  justOne: false
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
