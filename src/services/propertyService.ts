import type { Property } from '../types/property';
import Papa from 'papaparse';
import type { ParseConfig, ParseResult } from 'papaparse';

// Define Papa Parse result type
interface CSVParseResult {
  data: any[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

// Initial data for new installations only
const defaultProperties: Property[] = [
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

// In-memory storage
let properties: Property[] = [];

// Convert property to CSV row
const propertyToRow = (property: Property) => ({
  id: property.id,
  title: property.title,
  address: property.address,
  price: property.price,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  squareFeet: property.squareFeet,
  description: property.description,
  images: property.images.join('|'),
  features: property.features.join('|'),
  type: property.type,
  status: property.status,
  createdAt: property.createdAt,
  updatedAt: property.updatedAt
});

// Convert CSV row to property
const rowToProperty = (row: any): Property => {
  // Ensure all required fields are present with proper types
  const images = typeof row.images === 'string' ?
    row.images.split('|').filter(Boolean).map((url: string) => url.trim()) :
    Array.isArray(row.images) ? row.images : [];

  const features = typeof row.features === 'string' ?
    row.features.split('|').filter(Boolean).map((feature: string) => feature.trim()) :
    Array.isArray(row.features) ? row.features : [];

  return {
    id: String(row.id || generateUniqueId(properties)),
    title: String(row.title || ''),
    address: String(row.address || ''),
    price: Number(row.price) || 0,
    bedrooms: Number(row.bedrooms) || 0,
    bathrooms: Number(row.bathrooms) || 0,
    squareFeet: Number(row.squareFeet) || 0,
    description: String(row.description || ''),
    images,
    features,
    type: (['house', 'condo', 'townhouse', 'apartment'].includes(row.type) ? row.type : 'house') as Property['type'],
    status: (['for-sale', 'for-rent', 'sold'].includes(row.status) ? row.status : 'for-sale') as Property['status'],
    createdAt: row.createdAt || new Date().toISOString(),
    updatedAt: row.updatedAt || new Date().toISOString()
  };
};

// Helper function to generate unique ID
const generateUniqueId = (existingProperties: Property[]): string => {
  const maxId = existingProperties.reduce((max, property) => {
    const currentId = parseInt(property.id);
    return isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0);
  return String(maxId + 1);
};

export const loadProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch('/api/properties', {
      headers: {
        'Accept': 'text/csv',
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to load properties');
    }
    const csvData = await response.text();

    // Check if the response is HTML instead of CSV
    if (csvData.trim().toLowerCase().startsWith('<!doctype html>')) {
      console.log('Received HTML instead of CSV, using default properties');
      properties = [...defaultProperties];
      await savePropertiesToCSV(properties);
      return properties;
    }

    return new Promise((resolve) => {
      Papa.parse<Record<string, any>>(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimiter: ',',
        transformHeader: (header: string) => header.trim(),
        complete: (results: ParseResult<Record<string, any>>) => {
          console.log('CSV results:', results);
          if (!results.data || !Array.isArray(results.data) || results.data.length === 0) {
            console.log('No data found in CSV, using default properties');
            properties = [...defaultProperties];
            // Save default properties to CSV
            savePropertiesToCSV(properties).catch(console.error);
            resolve(properties);
            return;
          }

          try {
            const loadedProperties = results.data.map(rowToProperty);

            // Ensure unique IDs
            const seenIds = new Set<string>();
            properties = loadedProperties.map((prop: Property) => {
              if (seenIds.has(prop.id)) {
                prop.id = generateUniqueId(loadedProperties);
              }
              seenIds.add(prop.id);
              return prop;
            });

            resolve(properties);
          } catch (parseError) {
            console.error('Error parsing CSV data:', parseError);
            properties = [...defaultProperties];
            // Save default properties to CSV
            savePropertiesToCSV(properties).catch(console.error);
            resolve(properties);
          }
        },
        error: (error: Error) => {
          console.error('Error parsing CSV:', error);
          properties = [...defaultProperties];
          // Save default properties to CSV
          savePropertiesToCSV(properties).catch(console.error);
          resolve(properties);
        }
      });
    });
  } catch (error) {
    console.error('Error loading properties:', error);
    properties = [...defaultProperties];
    // Save default properties to CSV
    savePropertiesToCSV(properties).catch(console.error);
    return properties;
  }
};

// Helper function to save properties to CSV
const savePropertiesToCSV = async (propsToSave: Property[]) => {
  const csv = Papa.unparse(propsToSave.map(propertyToRow), {
    quotes: true,
    delimiter: ',',
    header: true
  });

  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/csv'
    },
    body: csv
  });

  if (!response.ok) {
    throw new Error('Failed to save properties to CSV');
  }
};

export const updateProperty = async (property: Property): Promise<Property> => {
  const propertyIndex = properties.findIndex(p => p.id === property.id);
  if (propertyIndex === -1) {
    throw new Error('Property not found');
  }

  const updatedProperty = {
    ...property,
    updatedAt: new Date().toISOString()
  };

  properties[propertyIndex] = updatedProperty;
  await savePropertiesToCSV(properties);
  return updatedProperty;
};

export const saveProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newProperty: Property = {
    ...property,
    id: generateUniqueId(properties),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  properties = [...properties, newProperty];

  try {
    await savePropertiesToCSV(properties);
    return newProperty;
  } catch (error) {
    console.error('Error saving to CSV:', error);
    // Remove the property if API save fails
    properties = properties.slice(0, -1);
    throw error;
  }
};