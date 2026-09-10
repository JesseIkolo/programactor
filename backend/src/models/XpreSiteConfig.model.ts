import mongoose, { Schema, Document } from 'mongoose';

export interface IXpreSiteAddon {
  id: string;
  slug: string;
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
  priceXAF: number;
  isDefaultSelected?: boolean;
  isRecommended?: boolean;
}

export interface IXpreSiteIndustry {
  id: string;
  slug: string;
  name: { fr: string; en: string };
  tagline: { fr: string; en: string };
  iconName: string;
  badge?: { fr: string; en: string };
  basePriceXAF?: number;
  isActive: boolean;
  addons: IXpreSiteAddon[];
}

export interface IXpreSiteConfig extends Document {
  defaultBasePriceXAF: number;
  deliveryDelay: string;
  allowThreeSplits: boolean;
  minAmountForThreeSplits: number;
  hostingIncludedYears: number;
  whatsappContactNumber: string;
  industries: IXpreSiteIndustry[];
  updatedAt: Date;
}

const AddonSchema = new Schema<IXpreSiteAddon>(
  {
    id: { type: String, required: true },
    slug: { type: String, required: true },
    title: {
      fr: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    desc: {
      fr: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    priceXAF: { type: Number, default: 0 },
    isDefaultSelected: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
  },
  { _id: false }
);

const IndustrySchema = new Schema<IXpreSiteIndustry>(
  {
    id: { type: String, required: true },
    slug: { type: String, required: true },
    name: {
      fr: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    tagline: {
      fr: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    iconName: { type: String, default: 'store' },
    badge: {
      fr: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    basePriceXAF: { type: Number, default: 75000 },
    isActive: { type: Boolean, default: true },
    addons: { type: [AddonSchema], default: [] },
  },
  { _id: false }
);

const XpreSiteConfigSchema = new Schema<IXpreSiteConfig>(
  {
    defaultBasePriceXAF: { type: Number, default: 75000 },
    deliveryDelay: { type: String, default: '72h' },
    allowThreeSplits: { type: Boolean, default: true },
    minAmountForThreeSplits: { type: Number, default: 100000 },
    hostingIncludedYears: { type: Number, default: 1 },
    whatsappContactNumber: { type: String, default: '237699000000' },
    industries: { type: [IndustrySchema], default: [] },
  },
  { timestamps: true }
);

export const XpreSiteConfig = mongoose.model<IXpreSiteConfig>('XpreSiteConfig', XpreSiteConfigSchema);
