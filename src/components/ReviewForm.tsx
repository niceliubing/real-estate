import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
  const [guestEmail, setGuestEmail] = useState('');
  const toast = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
        propertyId,
        userId: user?.email || guestEmail, // Use guest email if user is not logged in
        userEmail: user?.email || guestEmail,
        rating: parseInt(rating),
        comment,
      };

      await addReview(reviewData);
      toast({
        title: 'Review submitted',
        status: 'success',
        duration: 3000,
      });
      onReviewAdded();
      setComment('');
      setRating('5');
      setGuestEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit review',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        {!user && (
          <FormControl isRequired>
            <FormLabel>Your Email</FormLabel>
            <Input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
        )}
        <FormControl isRequired>
          <FormLabel>Rating</FormLabel>
          <Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Comment</FormLabel>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          isLoading={isLoading}
        >
          Submit Review
        </Button>
      </VStack>
    </Box>
  );
};
