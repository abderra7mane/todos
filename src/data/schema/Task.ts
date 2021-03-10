import mongoose, { Schema } from 'mongoose'


const TaskSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  due: { type: Date },
  status: { type: Number },
  priority: { type: Number },
  tags: [{ type: String }],
  attachments: [{
    name: { type: String, required: true },
    content: { type: String, required: true },
  }]
})

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)
