import mongoose from "../config/atlasdb";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  members: [
    {
      email: {
        type: String,
        default: null
      },
      verified: {
        type: Boolean,
        default: false
      }
    }
  ],
  userId: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: String,
    default: null
  }
}, { timestamps: true })

schema.post('deleteOne', async function () {
  await mongoose
    .model('Task')
    .deleteMany({ projectId: this.getQuery()['_id'] })
})

const model = mongoose.model('Project', schema)

export default model