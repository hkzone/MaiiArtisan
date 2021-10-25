const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const enDistricts = [
  'Central and Western District',
  'Eastern District',
  'Islands District',
  'Kowloon City District',
  'Kwai Tsing District',
  'Kwun Tong District',
  'North District',
  'Sai Kung District',
  'Sha Tin District',
  'Sham Shui Po District',
  'Southern District',
  'Tai Po District',
  'Tsuen Wan District',
  'Tsuen Wan District',
  'Wan Chai District',
  'Wong Tai Sin District',
  'Wong Tai Sin District',
  'Wong Tai Sin District',
];

userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phoneNumber:{type:Number, required: [true, 'Please provide your mobile number'],},
  address: [
    {
      region: {
        type: String,
        required: [true, 'Address must have a region'],
        enum: {
          values: ['Hong Kong', 'Kowloon', 'New Territories'],
          message: ' Region is either: Hong Kong, Kowloon, New Territories',
        },
      },
      dcDistrict: {
        type: String,
        required: [true, 'Address must have a disctrict'],
        enum: {
          values: enDistricts,
          message: ` Region is either: ${enDistricts}`,
        },
      },
      buildingNoFrom: {
        type: String,
        required: [true, 'Address must have a building No'],
      },
      streetName: {
        type: String,
        required: [true, 'Address must have a street name'],
      },
      estateOrVillageName: {
        type: String,
        required: [true, 'Address must have a estate or village name'],
      },
      buildingName: {
        type: String,
      },
      blockNo: {
        type: String,
      },
      floorNo: {
        type: Number,
      },
      unit: {
        type: String,
      },
    },
  ],
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'employee', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually changed
  if (!this.isModified('password')) return next();
  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, async function (next) {
  //this points to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log(await bcrypt.compare(candidatePassword, userPassword));
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
