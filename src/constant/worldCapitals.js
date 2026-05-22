const displayNames =
  typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

export const WORLD_CAPITALS = {
  AT: { countryName: 'Austria', capitalName: 'Vienna', lat: 48.2082, lng: 16.3738 },
  AU: { countryName: 'Australia', capitalName: 'Canberra', lat: -35.2809, lng: 149.13 },
  BD: { countryName: 'Bangladesh', capitalName: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  BE: { countryName: 'Belgium', capitalName: 'Brussels', lat: 50.8503, lng: 4.3517 },
  BR: { countryName: 'Brazil', capitalName: 'Brasilia', lat: -15.7939, lng: -47.8828 },
  CA: { countryName: 'Canada', capitalName: 'Ottawa', lat: 45.4215, lng: -75.6972 },
  CH: { countryName: 'Switzerland', capitalName: 'Bern', lat: 46.948, lng: 7.4474 },
  CN: { countryName: 'China', capitalName: 'Beijing', lat: 39.9042, lng: 116.4074 },
  CZ: { countryName: 'Czechia', capitalName: 'Prague', lat: 50.0755, lng: 14.4378 },
  DE: { countryName: 'Germany', capitalName: 'Berlin', lat: 52.52, lng: 13.405 },
  DK: { countryName: 'Denmark', capitalName: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
  ES: { countryName: 'Spain', capitalName: 'Madrid', lat: 40.4168, lng: -3.7038 },
  FI: { countryName: 'Finland', capitalName: 'Helsinki', lat: 60.1699, lng: 24.9384 },
  FR: { countryName: 'France', capitalName: 'Paris', lat: 48.8566, lng: 2.3522 },
  GB: { countryName: 'England', capitalName: 'London', lat: 51.5072, lng: -0.1276 },
  HK: { countryName: 'Hong Kong', capitalName: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  ID: { countryName: 'Indonesia', capitalName: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  IE: { countryName: 'Ireland', capitalName: 'Dublin', lat: 53.3498, lng: -6.2603 },
  IN: { countryName: 'India', capitalName: 'New Delhi', lat: 28.6139, lng: 77.209 },
  IT: { countryName: 'Italy', capitalName: 'Rome', lat: 41.9028, lng: 12.4964 },
  JP: { countryName: 'Japan', capitalName: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  KE: { countryName: 'Kenya', capitalName: 'Nairobi', lat: -1.2921, lng: 36.8219 },
  KR: { countryName: 'South Korea', capitalName: 'Seoul', lat: 37.5665, lng: 126.978 },
  MW: { countryName: 'Malawi', capitalName: 'Lilongwe', lat: -13.9626, lng: 33.7741 },
  MX: { countryName: 'Mexico', capitalName: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  MY: { countryName: 'Malaysia', capitalName: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
  NG: { countryName: 'Nigeria', capitalName: 'Abuja', lat: 9.0765, lng: 7.3986 },
  NL: { countryName: 'Netherlands', capitalName: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  NO: { countryName: 'Norway', capitalName: 'Oslo', lat: 59.9139, lng: 10.7522 },
  NZ: { countryName: 'New Zealand', capitalName: 'Wellington', lat: -41.2865, lng: 174.7762 },
  PK: { countryName: 'Pakistan', capitalName: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  PH: { countryName: 'Philippines', capitalName: 'Manila', lat: 14.5995, lng: 120.9842 },
  PT: { countryName: 'Portugal', capitalName: 'Lisbon', lat: 38.7223, lng: -9.1393 },
  RS: { countryName: 'Serbia', capitalName: 'Belgrade', lat: 44.7866, lng: 20.4489 },
  SE: { countryName: 'Sweden', capitalName: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  SG: { countryName: 'Singapore', capitalName: 'Singapore', lat: 1.3521, lng: 103.8198 },
  TH: { countryName: 'Thailand', capitalName: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  TW: { countryName: 'Taiwan', capitalName: 'Taipei', lat: 25.033, lng: 121.5654 },
  US: { countryName: 'USA', capitalName: 'Washington, D.C.', lat: 38.9072, lng: -77.0369 },
  VN: { countryName: 'Vietnam', capitalName: 'Hanoi', lat: 21.0278, lng: 105.8342 },
};

export const getWorldCapital = (countryCode) => {
  const code = String(countryCode || '').toUpperCase();
  const capital = WORLD_CAPITALS[code];

  if (capital) {
    return { code, ...capital };
  }

  return {
    code,
    countryName: displayNames?.of(code) || code,
    capitalName: '',
    lat: null,
    lng: null,
  };
};
