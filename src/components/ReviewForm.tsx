import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { addReview } from '../services/reviewService';
import type { Review } from '../types/review';

interface ReviewFormProps {
  propertyId: string;
  onReviewAdded: () => void;
}

export const ReviewForm = ({ propertyId, onReviewAdded }: ReviewFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const toast = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to leave a review',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
        propertyId,
        userId: user.email, // Using email as userId since we don't have id in User type
        userEmail: user.email,
        rating: parseInt(rating),
        comment,
      };

      await addReview(reviewData);

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
      });

      setComment('');
      setRating('5');
      onReviewAdded();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit review',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Rating</FormLabel>
          <Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Comment</FormLabel>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this property..."
            minH="100px"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          isLoading={isLoading}
        >
          Submit Review
        </Button>
      </VStack>
    </Box>
  );
};
