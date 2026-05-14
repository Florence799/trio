const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Faculty', 'Teacher', 'Student'],
    required: true,
  },
  // Student specific fields
  registeredNumber: {
    type: String,
    unique: true,
    sparse: true, // Only required for students
  },
  department: String,
  year: String,
  section: String,
  mobile: {
    type: String,
    validate: {
      validator: (value) => !value || /^\d{10}$/.test(value),
      message: 'Mobile number must contain exactly 10 digits.',
    },
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
