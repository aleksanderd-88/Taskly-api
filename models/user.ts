import mongoose from "../config/atlasdb";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  accountIsVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    desc: 'One time password for account verification during signup.',
    type: String,
    default: null,
    trim: true
  }
})

const model = mongoose.model('User', schema)

export default model