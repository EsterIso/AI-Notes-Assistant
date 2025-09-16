import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Add this import

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters']
    }, 
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      validate: {
        validator: function(password) {
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasNumber = /\d/.test(password);
          const hasSpecial = /[!@#$%^&*]/.test(password);
          return hasUppercase && hasLowercase && hasNumber && hasSpecial;
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
    },
    
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      default: null
    },
    emailVerificationExpires: {
      type: Date,
      default: null
    },
    
    lastLogin: {
      type: Date,
      default: Date.now
    },
    subscription: {
      plan: { type: String, enum: ['free', 'pro'], default: 'free' },
      stripeCustomerId: { type: String }, // optional if you add Stripe later
    }
  },
  { timestamps: true }
);

// 🔗 Virtual: link user → notes
userSchema.virtual('notes', {
  ref: 'Note', // must match the model name
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

// Middleware: hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// GENERATE EMAIL VERIFICATION TOKEN
userSchema.methods.generateEmailVerificationToken = function() {
  // Generate random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash the token and store it
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // Set expiration (24 hours from now)
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  // Return the unhashed token (this will be sent in email)
  return token;
};

// VERIFY EMAIL TOKEN
userSchema.methods.verifyEmailToken = function(token) {
  // Hash the provided token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // Check if token matches and hasn't expired
  return this.emailVerificationToken === hashedToken && 
         this.emailVerificationExpires > Date.now();
};

// 🆕 MARK EMAIL AS VERIFIED
userSchema.methods.markEmailAsVerified = function() {
  this.isEmailVerified = true;
  this.emailVerificationToken = null;
  this.emailVerificationExpires = null;
};

// Hide sensitive fields in JSON
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.emailVerificationToken; 
    return ret;
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;