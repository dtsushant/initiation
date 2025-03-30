interface MerchantData {
  key: string;
  name: string;
  category: string;
  contact: string;
  status: string;
}

const generateRandomName = () => {
  const names = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
  ];
  const suffix = Math.floor(Math.random() * 1000);
  return `${names[Math.floor(Math.random() * names.length)]} ${suffix}`;
};

export const data: MerchantData[] = Array.from({ length: 200 }, (_, index) => ({
  key: `${index + 1}`,
  name: generateRandomName(),
  category: `Category ${index % 10}`,
  contact: `980000000${index % 10}`,
  status: index % 2 === 0 ? 'Enabled' : 'Disabled',
}));
