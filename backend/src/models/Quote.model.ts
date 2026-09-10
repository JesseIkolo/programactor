import mongoose, { Schema, Document } from 'mongoose';

export type QuoteStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';
export type QuoteType = 'XPRESITE_EXPRESS' | 'CUSTOM_BESPOKE';

export interface IQuote extends Document {
  reference: string;
  quoteType: QuoteType;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  companyName?: string;
  city?: string;
  industryId?: string;
  industryName?: string;
  selectedAddonTitles?: string[];
  basePriceXAF?: number;
  addonsTotalXAF?: number;
  totalPriceXAF?: number;
  paymentSplits?: 2 | 3;
  splitAmount?: number;
  projectType?: string;
  features?: string[];
  timeline?: string;
  budgetRange?: string;
  designPreference?: string;
  description?: string;
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
    quoteType: {
      type: String,
      enum: ['XPRESITE_EXPRESS', 'CUSTOM_BESPOKE'],
      default: 'XPRESITE_EXPRESS',
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
      default: 'custom',
    },
    industryName: {
      type: String,
      default: 'Sur-Mesure',
    },
    selectedAddonTitles: {
      type: [String],
      default: [],
    },
    basePriceXAF: {
      type: Number,
      default: 0,
    },
    addonsTotalXAF: {
      type: Number,
      default: 0,
    },
    totalPriceXAF: {
      type: Number,
      default: 0,
    },
    paymentSplits: {
      type: Number,
      enum: [2, 3],
      default: 2,
    },
    splitAmount: {
      type: Number,
      default: 0,
    },
    projectType: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    timeline: {
      type: String,
      default: '',
    },
    budgetRange: {
      type: String,
      default: '',
    },
    designPreference: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
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
