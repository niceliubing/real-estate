import { Box, Text, Stack, Badge, Flex } from '@chakra-ui/react';
import type { Review } from '../types/review';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    return 'red';
  };

  const getDisplayName = (review: Review) => {
    if (review.isAnonymous) {
      return 'Anonymous';
    }
    return review.userName;
  };

  return (
    <Stack spacing={4}>
      {reviews.map((review) => (
        <Box
          key={review.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="bold">
              {review.isAnonymous ? (
                <Text as="span" color="gray.500">Anonymous</Text>
              ) : (
                getDisplayName(review)
              )}
            </Text>
            <Badge colorScheme={getRatingColor(review.rating)} fontSize="0.8em" px={2} py={1}>
              {review.rating} / 5
            </Badge>
          </Flex>
          <Text mb={2}>{review.comment}</Text>
          <Text fontSize="sm" color="gray.500">
            Reviewed on {formatDate(review.createdAt)}
          </Text>
        </Box>
      ))}
    </Stack>
  );
};
