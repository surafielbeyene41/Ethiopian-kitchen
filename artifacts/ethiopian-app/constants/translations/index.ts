import { en } from "./en";
import { am } from "./am";

export const translations = {
  en,
  am,
};

export type TranslationKey = keyof typeof en;
