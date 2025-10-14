import type { UserProfile } from './types';

export const mockFarmers: UserProfile[] = [
  {
    uid: 'farmer-1',
    email: 'nasir.hussain@example.com',
    name: 'Nasir Hussain',
    location: 'Sahiwal, Punjab',
    language: 'pa',
    farmSize: 15,
    photoURL: 'https://picsum.photos/seed/farmer1/200/200',
    crops: [
      {
        slug: 'wheat',
        name: 'Wheat',
        price: '3900',
      },
      {
        slug: 'sugarcane',
        name: 'Sugarcane',
        price: '4500',
      },
    ],
  },
  {
    uid: 'farmer-2',
    email: 'fatima.bibi@example.com',
    name: 'Fatima Bibi',
    location: 'Faisalabad, Punjab',
    language: 'pa',
    photoURL: 'https://picsum.photos/seed/farmer2/200/200',
    farmSize: 25,
    crops: [
      {
        slug: 'cotton',
        name: 'Cotton',
        price: '8500',
      },
      {
        slug: 'maize',
        name: 'Maize',
        price: '2100',
      },
      {
        slug: 'potato',
        name: 'Potato',
        price: '1800',
      },
    ],
  },
  {
    uid: 'farmer-3',
    email: 'ali.rehman@example.com',
    name: 'Ali Rehman',
    location: 'Multan, Punjab',
    language: 'ur',
    photoURL: 'https://picsum.photos/seed/farmer3/200/200',
    farmSize: 50,
    crops: [
      {
        slug: 'mango',
        name: 'Mango',
        price: '3000',
      },
      {
        slug: 'dates',
        name: 'Dates',
        price: '4000',
      },
    ],
  },
  {
    uid: 'farmer-4',
    email: 'zoya.khan@example.com',
    name: 'Zoya Khan',
    location: 'Peshawar, KP',
    language: 'ps',
    photoURL: 'https://picsum.photos/seed/farmer4/200/200',
    farmSize: 10,
    crops: [
      {
        slug: 'tomato',
        name: 'Tomato',
        price: '1200',
      },
      {
        slug: 'onion',
        name: 'Onion',
        price: '2500',
      },
    ],
  },
  {
    uid: 'farmer-5',
    email: 'gul.ahmed@example.com',
    name: 'Gul Ahmed',
    location: 'Hyderabad, Sindh',
    language: 'si',
    photoURL: 'https://picsum.photos/seed/farmer5/200/200',
    farmSize: 30,
    crops: [
      {
        slug: 'rice-basmati',
        name: 'Rice (Basmati)',
        price: '9000',
      },
      {
        slug: 'banana',
        name: 'Banana',
        price: '800',
      },
    ],
  },
];
