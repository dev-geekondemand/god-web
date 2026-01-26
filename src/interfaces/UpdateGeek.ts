export interface GeekFormData {
  fullName: {
    first: string;
    last: string;
  };
  email: string;
  mobile: string;
  yoe: number;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pin: string;
    country: string;
  };
  modeOfService: string;
  primarySkill: string;
  secondarySkills: string[];
  brandsServiced: string[];
  languagePreferences: string[];
}
