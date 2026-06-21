import User from '../models/user.model.js';

export const getOrCreateUser = async (clerkId) => {
  return User.findOneAndUpdate(
    { clerkId },
    { $setOnInsert: { clerkId } },
    { upsert: true, new: true }
  );
};

