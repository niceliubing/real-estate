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
  Text,
  Switch,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { addReview } from '../services/reviewService';
import type { Review } from '../types/review';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  propertyId: string;
  onReviewAdded: () => void;
}

export const ReviewForm = ({ propertyId, onReviewAdded }: ReviewFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
        propertyId: String(propertyId),
        userId: user?.email || guestEmail,
        userEmail: user?.email || guestEmail,
        userName: user?.name || guestName,
        isAnonymous,
        rating,
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
      setRating(5);
      setGuestEmail('');
      setGuestName('');
      setIsAnonymous(false);
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
        {user ? (
          <Flex align="center" justify="space-between" width="100%">
            <Text>Reviewing as: {isAnonymous ? 'Anonymous' : user.name}</Text>
            <Flex align="center" gap={2}>
              <Text fontSize="sm">Post anonymously</Text>
              <Switch
                isChecked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
            </Flex>
          </Flex>
        ) : (
          <>
            <FormControl isRequired={!isAnonymous}>
              <Flex justify="space-between" align="center" mb={2}>
                <FormLabel mb={0}>Your Name</FormLabel>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm">Post anonymously</Text>
                  <Switch
                    isChecked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                </Flex>
              </Flex>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your name"
                disabled={isAnonymous}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Your Email</FormLabel>
              <Input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
          </>
        )}
        <FormControl isRequired>
          <Flex align="center" gap={3}>
            <FormLabel mb={0}>Rating</FormLabel>
            <StarRating rating={rating} onRatingChange={setRating} />
          </Flex>
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
