import Papa from 'papaparse';
import type { Review } from '../types/review';

let reviews: Review[] = [];

// Helper function to generate unique ID
const generateUniqueId = (existingReviews: Review[]): string => {
  const maxId = existingReviews.reduce((max, review) => {
    const currentId = parseInt(review.id);
    return isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0);
  return String(maxId + 1);
};

// Load reviews from CSV
export const loadReviews = async (propertyId?: string): Promise<Review[]> => {
  try {
    const response = await fetch('/api/reviews');
    if (!response.ok) {
      throw new Error('Failed to load reviews');
    }
    const csvData = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          reviews = results.data
            .map((row: any): Review => ({
              id: String(row.id),
              propertyId: String(row.propertyId || ''),
              userId: String(row.userId || ''),
              userEmail: String(row.userEmail || ''),
              userName: String(row.userName || row.userEmail || ''),
              isAnonymous: row.isAnonymous === 'true',
              rating: Number(row.rating),
              comment: String(row.comment || ''),
              createdAt: row.createdAt || new Date().toISOString(),
              updatedAt: row.updatedAt || new Date().toISOString(),
            }))
            .filter((review: Review) => !propertyId || review.propertyId === propertyId);

          resolve(reviews);
        },
      });
    });
  } catch {
    return [];
  }
};

// Add a new review
export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
  try {
    // Load existing reviews to get the latest state
    await loadReviews();

    const newReview: Review = {
      ...reviewData,
      id: generateUniqueId(reviews),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Send the new review to the server
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    });

    if (!response.ok) {
      throw new Error('Failed to save review');
    }

    // Update local cache
    reviews = [...reviews, newReview];
    return newReview;
  } catch (error) {
    throw new Error('Failed to add review');
  }
};

// Update a review
export const updateReview = async (review: Review): Promise<Review> => {
  const index = reviews.findIndex((r) => r.id === review.id);
  if (index === -1) {
    throw new Error('Review not found');
  }

  const updatedReview = { ...review, updatedAt: new Date().toISOString() };
  reviews[index] = updatedReview;

  // Send the update to the server
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedReview),
  });

  if (!response.ok) {
    throw new Error('Failed to update review');
  }

  return updatedReview;
};

// Helper function to get the average rating for a property
export const getAverageRating = (propertyId: string): number => {
  const propertyReviews = reviews.filter(review => review.propertyId === propertyId);
  if (propertyReviews.length === 0) {
    return 0;
  }
  const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / propertyReviews.length;
};
