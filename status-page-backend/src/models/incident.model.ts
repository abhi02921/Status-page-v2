import { Schema, model, Document } from 'mongoose';

export interface IIncident extends Document {
  title: string;
  description: string;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
  service: string; // Reference to the service
  organizationId: string; // Organization ID
  createdAt: Date;
  updatedAt: Date;
}

const incidentSchema = new Schema<IIncident>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Operational', 'Degraded Performance', 'Partial Outage', 'Major Outage'],
      default: 'Operational',
    },
    service: { type: String, ref: 'Service', required: true }, // ObjectId reference to Service
    organizationId: { type: String, required: true }, // Organization ID
  },
  { timestamps: true }
);

export const Incident = model<IIncident>('Incident', incidentSchema);
