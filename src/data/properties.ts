import type { Property } from '../types/property';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Luxury Modern Home',
    address: '123 Maple Street, Toronto, ON',
    price: 1299000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    description: 'Beautiful modern home with open concept living space, gourmet kitchen, and luxurious master suite. Features include hardwood floors throughout, high ceilings, and a finished basement.',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    ],
    features: [
      'Hardwood floors',
      'Gourmet kitchen',
      'Finished basement',
      'Double garage',
      'Smart home features'
    ],
    type: 'house',
    status: 'for-sale',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Downtown Luxury Condo',
    address: '456 Bay Street, Toronto, ON',
    price: 899000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: 'Stunning downtown condo with spectacular city views. Features floor-to-ceiling windows, modern finishes, and high-end appliances. Building amenities include gym, pool, and 24/7 concierge.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    ],
    features: [
      'Floor-to-ceiling windows',
      'Granite countertops',
      'Stainless steel appliances',
      'Building gym',
      'Concierge service'
    ],
    type: 'condo',
    status: 'for-sale',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z'
  }
];