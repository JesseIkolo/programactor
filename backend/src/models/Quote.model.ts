import mongoose, { Schema, Document } from 'mongoose';

export type QuoteStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';

export interface IQuote extends Document {
  reference: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  companyName?: string;
  city?: string;
  industryId: string;
  industryName: string;
  selectedAddonTitles: string[];
  basePriceXAF: number;
  addonsTotalXAF: number;
  totalPriceXAF: number;
  paymentSplits: 2 | 3;
  splitAmount: number;
  status: QuoteStatus;
  internalNotes?: string;
  lang: 'fr' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    industryId: {
      type: String,
      required: true,
    },
    industryName: {
      type: String,
      required: true,
    },
    selectedAddonTitles: {
      type: [String],
      default: [],
    },
    basePriceXAF: {
      type: Number,
      required: true,
    },
    addonsTotalXAF: {
      type: Number,
      default: 0,
    },
    totalPriceXAF: {
      type: Number,
      required: true,
    },
    paymentSplits: {
      type: Number,
      enum: [2, 3],
      default: 2,
    },
    splitAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'],
      default: 'NEW',
      index: true,
    },
    internalNotes: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      enum: ['fr', 'en'],
      default: 'fr',
    },
  },
  {
    timestamps: true,
  }
);

export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);
