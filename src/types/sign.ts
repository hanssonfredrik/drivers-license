export type SignCategoryId =
  | 'varning'
  | 'forbud'
  | 'pabud'
  | 'information'
  | 'tillaggstavla'
  | 'vagmarkering'
  | 'lokaliseringsmarke'
  | 'anvisning';

export const SIGN_CATEGORY_LABELS: Record<SignCategoryId, string> = {
  varning: 'Varningsmärken',
  forbud: 'Förbudsmärken',
  pabud: 'Påbudsmärken',
  information: 'Informationsmärken',
  tillaggstavla: 'Tilläggstavlor',
  vagmarkering: 'Vägmarkeringar',
  lokaliseringsmarke: 'Lokaliseringsmärken',
  anvisning: 'Anvisningsmärken',
};

export interface RoadSign {
  id: string;
  name: string;
  signCategory: SignCategoryId;
  description: string;
  detailedDescription: string;
  relatedRule: string | null;
}
