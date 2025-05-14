export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  images: string[];
  features: string[];
  type: 'house' | 'condo' | 'townhouse' | 'apartment';
  status: 'for-sale' | 'for-rent' | 'sold';
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: Property['type'];
  status?: Property['status'];
}