import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  status: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['Operational', 'Degraded Performance', 'Partial Outage', 'Major Outage'],
      default: 'Operational',
    },
    description: { type: String },
    organizationId: { type: String, required: true }, // Organization ID
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
