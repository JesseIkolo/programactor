import mongoose, { Schema, Document } from 'mongoose';

export type BookingStatus = 'CONFIRMED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED';

export interface IBooking extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCity?: string;
  companyName?: string;
  sector: string;
  problemSummary: string;
  desiredOffer?: string;
  preferredChannel: 'meet' | 'whatsapp';
  scheduledAt: Date;
  durationMinutes: number;
  clientTimezone: string;
  status: BookingStatus;
  meetingLink?: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    clientCity: {
      type: String,
      default: '',
    },
    companyName: {
      type: String,
      default: '',
    },
    sector: {
      type: String,
      required: true,
    },
    problemSummary: {
      type: String,
      required: true,
    },
    desiredOffer: {
      type: String,
      default: '',
    },
    preferredChannel: {
      type: String,
      enum: ['meet', 'whatsapp'],
      default: 'meet',
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    clientTimezone: {
      type: String,
      default: 'Africa/Douala',
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    internalNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
