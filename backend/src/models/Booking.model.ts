import mongoose, { Schema, Document } from 'mongoose';

export type BookingStatus =
  | 'CONFIRMÉ'
  | 'EN ATTENTE'
  | 'HONORÉ'
  | 'ANNULÉ'
  | 'REPORTÉ'
  | 'EN ATTENTE DE PAIEMENT'
  | 'A RELANCER';

export type MeetingChannel = 'EN_LIGNE' | 'PRESENTIEL';

export interface IBooking extends Document {
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCity?: string;
  companyName?: string;
  sector?: string;
  topic?: string;
  meetingType: MeetingChannel;
  locationDetails?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // Ex: "10:30"
  scheduledAt: Date;
  durationMinutes: number;
  clientTimezone: string;
  status: BookingStatus;
  meetingLink?: string;
  internalNotes?: string;
  lang: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
      default: '',
    },
    topic: {
      type: String,
      default: '',
    },
    meetingType: {
      type: String,
      enum: ['EN_LIGNE', 'PRESENTIEL'],
      default: 'EN_LIGNE',
    },
    locationDetails: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
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
      enum: [
        'CONFIRMÉ',
        'EN ATTENTE',
        'HONORÉ',
        'ANNULÉ',
        'REPORTÉ',
        'EN ATTENTE DE PAIEMENT',
        'A RELANCER',
      ],
      default: 'CONFIRMÉ',
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
    lang: {
      type: String,
      default: 'fr',
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
