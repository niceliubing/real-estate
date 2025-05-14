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
              propertyId: String(row.propertyId),
              userId: String(row.userId),
              userEmail: String(row.userEmail),
              rating: Number(row.rating),
              comment: String(row.comment),
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
            }))
            .filter((review: Review) => !propertyId || review.propertyId === propertyId);
          resolve(reviews);
        },
      });
    });
  } catch (error) {
    console.error('Error loading reviews:', error);
    return [];
  }
};

// Save reviews to CSV
const saveReviewsToCSV = async (reviewsToSave: Review[]) => {
  const csv = Papa.unparse(reviewsToSave);
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/csv'
    },
    body: csv
  });

  if (!response.ok) {
    throw new Error('Failed to save reviews');
  }
};

// Add a new review
export const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    id: generateUniqueId(reviews),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  reviews = [...reviews, newReview];
  await saveReviewsToCSV(reviews);
  return newReview;
};

// Update a review
export const updateReview = async (review: Review): Promise<Review> => {
  const index = reviews.findIndex(r => r.id === review.id);
  if (index === -1) {
    throw new Error('Review not found');
  }

  const updatedReview = {
    ...review,
    updatedAt: new Date().toISOString(),
  };

  reviews[index] = updatedReview;
  await saveReviewsToCSV(reviews);
  return updatedReview;
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  reviews = reviews.filter(r => r.id !== reviewId);
  await saveReviewsToCSV(reviews);
};

// Get average rating for a property
export const getAverageRating = (propertyId: string): number => {
  const propertyReviews = reviews.filter(r => r.propertyId === propertyId);
  if (propertyReviews.length === 0) return 0;

  const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / propertyReviews.length;
};
