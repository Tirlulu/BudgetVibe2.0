import React from 'react';
import {
  Activity,
  Baby,
  Backpack,
  Bandage,
  Banknote,
  BookOpen,
  Building,
  Bus,
  CreditCard,
  Clock,
  Droplets,
  Flame,
  Globe,
  GraduationCap,
  HeartPulse,
  Home,
  Key,
  Landmark,
  Music,
  Palette,
  Percent,
  PlusCircle,
  Router,
  Shovel,
  Shield,
  ShieldCheck,
  Smartphone,
  Tag,
  ToyBrick,
  Tv,
  Umbrella,
  Users,
  Wrench,
  Youtube,
} from 'lucide-react';

const ICON_MAP = {
  Activity,
  Baby,
  Backpack,
  Bandage,
  Banknote,
  BookOpen,
  Building,
  Bus,
  CreditCard,
  Clock,
  Droplets,
  Flame,
  Globe,
  GraduationCap,
  HeartPulse,
  Home,
  Key,
  Landmark,
  Music,
  Palette,
  Percent,
  PlusCircle,
  Router,
  Shovel,
  Shield,
  ShieldCheck,
  Smartphone,
  Tag,
  ToyBrick,
  Tv,
  Umbrella,
  Users,
  Wrench,
  Youtube,
};

const FALLBACK = Tag;

export default function DynamicIcon({ name, size = 20, className = '' }) {
  const key = name && typeof name === 'string' ? name.trim() : '';
  const Icon = key && ICON_MAP[key] ? ICON_MAP[key] : FALLBACK;
  return <Icon size={size} className={className} aria-hidden />;
}

export { ICON_MAP };
