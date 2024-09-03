import mongoose from "../config/atlasdb";

const schema = new mongoose.Schema({
  textValue: {
    type: String,
    trim: true,
  },
  status: {
    enum: ['Scheduled', 'Ongoing', 'Completed'],
    type: String,
    default: null
  },
  projectId: {
    type: String,
    required: true
  },
  userIds: {
    desc: 'Member/s belonging to task',
    type: Array,
    default: null
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  htmlValue: {
    type: String,
    default: null
  },
  title: {
    type: String,
    required: true
  }
}, { timestamps: true })

const model = mongoose.model('Task', schema)

export default model