import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  slug: string;
  name: string;
  client?: string;
  sector: string;
  city: string;
  year: string;
  duration: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  displayOrder: number;
  featured?: boolean;
  accentTone?: 'indigo' | 'signal' | 'surface';
  coverImageUrl?: string;
  cardCoverImageUrl?: string;
  heroCoverImageUrl?: string;
  gallery?: string[];
  contentFr: {
    tagline: string;
    challenge: string;
    solution: string;
    impact?: string;
    deliverables?: string[];
  };
  contentEn: {
    tagline: string;
    challenge: string;
    solution: string;
    impact?: string;
    deliverables?: string[];
  };
  metrics?: Array<{
    value: string;
    labelFr: string;
    labelEn: string;
  }>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      default: '',
    },
    sector: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    accentTone: {
      type: String,
      enum: ['indigo', 'signal', 'surface'],
      default: 'indigo',
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    cardCoverImageUrl: {
      type: String,
      default: '',
    },
    heroCoverImageUrl: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    contentFr: {
      tagline: { type: String, default: '' },
      challenge: { type: String, default: '' },
      solution: { type: String, default: '' },
      impact: { type: String, default: '' },
      deliverables: { type: [String], default: [] },
    },
    contentEn: {
      tagline: { type: String, default: '' },
      challenge: { type: String, default: '' },
      solution: { type: String, default: '' },
      impact: { type: String, default: '' },
      deliverables: { type: [String], default: [] },
    },
    metrics: [
      {
        value: String,
        labelFr: String,
        labelEn: String,
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
