export interface CityData {
  name: string;
  tier: '一线' | '新一线' | '二线';
  province: string;
  population: string;
  gdp: string;
  gdpGrowth: string;
  pillarIndustries: string[];
  emergingIndustries: string[];
  majorCompanies: string[];
  avgRent: string;
  avgSalary: string;
  livingCostIndex: number;
  talentPolicy: string;
  settlementDifficulty: '易' | '中' | '难';
  airQuality: '优' | '良' | '中';
  climate: string;
  youthRatio: string;
  nightlife: string;
  culturalFacilities: string;
}

export interface CityScores {
  industry: number;
  cost: number;
  development: number;
  lifestyle: number;
  social: number;
}

export interface CityPreferences {
  industry: string;
  targetCities: string[];
  lifestyle: string;
  budgetLevel: string;
  socialPreference: string;
  distancePreference: string;
}
