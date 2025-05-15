import { Box, Text, Stack, Flex, Avatar } from '@chakra-ui/react';
import type { Review } from '../types/review';
import { StarRating } from './StarRating';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDisplayName = (review: Review) => {
    if (review.isAnonymous) {
      return 'Anonymous';
    }
    return review.userName;
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get consistent color based on user ID/email
  const getUserColor = (review: Review) => {
    if (review.isAnonymous) return 'gray.500';

    const colors = ['teal', 'blue', 'purple', 'cyan', 'pink', 'orange'];
    const hash = review.userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `${colors[Math.abs(hash) % colors.length]}.500`;
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
            <Flex align="center" gap={2}>
              <Avatar
                size="xs"
                name={review.isAnonymous ? 'Anonymous' : review.userName}
                bg={getUserColor(review)}
                color="white"
                src=""
              >
                {getInitials(getDisplayName(review))}
              </Avatar>
              <Text fontWeight="bold">
                {review.isAnonymous ? (
                  <Text as="span" color="gray.500">Anonymous</Text>
                ) : (
                  getDisplayName(review)
                )}
              </Text>
            </Flex>
            <StarRating rating={review.rating} readonly />
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
