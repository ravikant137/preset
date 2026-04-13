import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  original_image_url: string;
  processed_image_url: string;
  image_analysis: any;
  preset: any;
  caption: string;
  hashtags: string[];
  createdAt: Date;
}

const HistorySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  original_image_url: { type: String, required: true },
  processed_image_url: { type: String, required: true },
  image_analysis: { type: Schema.Types.Mixed, required: true },
  preset: { type: Schema.Types.Mixed, required: true },
  caption: { type: String, required: true },
  hashtags: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IHistory>('History', HistorySchema);
