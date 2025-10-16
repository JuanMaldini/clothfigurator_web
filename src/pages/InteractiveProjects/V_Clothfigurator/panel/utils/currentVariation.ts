export type CurrentVariation = {
  collection?: string;
  subcollection?: string;
  variation?: string;
  pattern?: string;
};

let current: CurrentVariation = {};

export function setCurrentVariation(v: CurrentVariation) {
  current = v || {};
}

export function getCurrentVariation(): CurrentVariation {
  return current;
}
import { sanitizeToken } from "./text";

export function buildVariationSlug(v: CurrentVariation): string {
  const parts = [
    sanitizeToken(v.collection, { allowDots: true, toLower: true }),
    sanitizeToken(v.subcollection, { allowDots: true, toLower: true }),
    sanitizeToken(v.variation, { allowDots: true, toLower: true }),
    sanitizeToken(v.pattern, { allowDots: true, toLower: true }),
  ].filter(Boolean);
  return parts.join("-");
}
