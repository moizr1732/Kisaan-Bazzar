
import type { UserProfile, Crop } from './types';

export interface CommunityCrop extends Crop {
    farmer: Pick<UserProfile, 'uid' | 'name' | 'location' | 'photoURL'>;
    category: 'Vegetable' | 'Fruit' | 'Grain' | 'Fibre';
    tags: ('High Demand' | 'Organic' | 'Upcoming' | 'Featured')[];
    imageHint?: string;
}

export const communityMockData: CommunityCrop[] = [
  {
    slug: 'cotton',
    name: 'Cotton',
    price: '8500',
    imageUrl: 'https://i.etsystatic.com/14792178/r/il/8edfd4/2197479858/il_fullxfull.2197479858_hpd8.jpg',
    imageHint: 'cotton plant',
    farmer: {
      uid: 'farmer-2',
      name: 'Fatima Bibi',
      location: 'Faisalabad, Punjab',
      photoURL: 'https://picsum.photos/seed/farmer2/200/200',
    },
    category: 'Fibre',
    tags: ['High Demand', 'Featured'],
  },
  {
    slug: 'mango',
    name: 'Mango (Chaunsa)',
    price: '3200',
    imageUrl: 'https://picsum.photos/seed/mango-fruit/400/400',
    imageHint: 'ripe mangoes',
    farmer: {
      uid: 'farmer-3',
      name: 'Ali Rehman',
      location: 'Multan, Punjab',
      photoURL: 'https://picsum.photos/seed/farmer3/200/200',
    },
    category: 'Fruit',
    tags: ['High Demand', 'Featured'],
  },
  {
    slug: 'wheat',
    name: 'Wheat',
    price: '3950',
    imageUrl: 'https://picsum.photos/seed/wheat-field/400/400',
    imageHint: 'wheat field',
    farmer: {
      uid: 'farmer-1',
      name: 'Nasir Hussain',
      location: 'Sahiwal, Punjab',
      photoURL: 'https://picsum.photos/seed/farmer1/200/200',
    },
    category: 'Grain',
    tags: ['High Demand'],
  },
  {
    slug: 'tomato',
    name: 'Tomato',
    price: '1200',
    imageUrl: 'https://picsum.photos/seed/vine-tomatoes/400/400',
    imageHint: 'fresh tomatoes',
    farmer: {
      uid: 'farmer-4',
      name: 'Zoya Khan',
      location: 'Peshawar, KP',
      photoURL: 'https://picsum.photos/seed/farmer4/200/200',
    },
    category: 'Vegetable',
    tags: ['Organic'],
  },
  {
    slug: 'rice-basmati',
    name: 'Rice (Basmati)',
    price: '9000',
    imageUrl: 'https://picsum.photos/seed/rice-paddy/400/400',
    imageHint: 'rice paddy',
    farmer: {
      uid: 'farmer-5',
      name: 'Gul Ahmed',
      location: 'Hyderabad, Sindh',
      photoURL: 'https://picsum.photos/seed/farmer5/200/200',
    },
    category: 'Grain',
    tags: [],
  },
  {
    slug: 'potato',
    name: 'Potato',
    price: '1800',
    imageUrl: 'https://picsum.photos/seed/potatoes-harvest/400/400',
    imageHint: 'fresh potatoes',
    farmer: {
      uid: 'farmer-2',
      name: 'Fatima Bibi',
      location: 'Faisalabad, Punjab',
      photoURL: 'https://picsum.photos/seed/farmer2/200/200',
    },
    category: 'Vegetable',
    tags: [],
  },
  {
    slug: 'sugarcane',
    name: 'Sugarcane',
    price: '4500',
    imageUrl: 'https://picsum.photos/seed/sugarcane-stalks/400/400',
    imageHint: 'sugarcane plantation',
    farmer: {
      uid: 'farmer-1',
      name: 'Nasir Hussain',
      location: 'Sahiwal, Punjab',
      photoURL: 'https://picsum.photos/seed/farmer1/200/200',
    },
    category: 'Grain',
    tags: [],
  },
  {
    slug: 'onion',
    name: 'Onion',
    price: '2500',
    imageUrl: 'https://picsum.photos/seed/onions-red/400/400',
    imageHint: 'fresh onions',
    farmer: {
      uid: 'farmer-4',
      name: 'Zoya Khan',
      location: 'Peshawar, KP',
      photoURL: 'https://picsum.photos/seed/farmer4/200/200',
    },
    category: 'Vegetable',
    tags: [],
  },
  {
    slug: 'strawberry',
    name: 'Strawberry',
    price: '1500',
    imageUrl: 'https://picsum.photos/seed/strawberry-field/400/400',
    imageHint: 'fresh strawberries',
    farmer: {
        uid: 'farmer-3',
        name: 'Ali Rehman',
        location: 'Multan, Punjab',
        photoURL: 'https://picsum.photos/seed/farmer3/200/200',
    },
    category: 'Fruit',
    tags: ['Upcoming'],
  },
  {
    slug: 'kinnow',
    name: 'Kinnow (Orange)',
    price: '1200',
    imageUrl: 'https://picsum.photos/seed/orange-grove/400/400',
    imageHint: 'orange fruit',
    farmer: {
        uid: 'farmer-1',
        name: 'Nasir Hussain',
        location: 'Sahiwal, Punjab',
        photoURL: 'https://picsum.photos/seed/farmer1/200/200',
    },
    category: 'Fruit',
    tags: ['Upcoming', 'High Demand'],
  },
];

export const categories = [
    { id: 'vegetable', label: 'Vegetables' },
    { id: 'fruit', label: 'Fruits' },
    { id: 'grain', label: 'Grains' },
    { id: 'fibre', label: 'Fibres' },
];

export const availability = [
    { id: 'delivery', label: 'Home Delivery' },
    { id: 'pickup', label: 'Self Pickup' },
]
