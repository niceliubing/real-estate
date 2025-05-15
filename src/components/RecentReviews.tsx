import {
  Box,
  Heading,
  Stack,
  Text,
  Link,
  Flex,
  Avatar,
  Badge,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { loadReviews } from '../services/reviewService';
import { loadProperties } from '../services/propertyService';
import type { Review } from '../types/review';
import type { Property } from '../types/property';
import { StarRating } from './StarRating';

export const RecentReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [properties, setProperties] = useState<{ [key: string]: Property }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load all reviews and properties
        const [allReviews, allProperties] = await Promise.all([
          loadReviews(),
          loadProperties()
        ]);

        // Sort reviews by date and take the 10 most recent
        const sortedReviews = allReviews.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 10);

        // Create a map of property IDs to properties for quick lookup
        const propertyMap = allProperties.reduce((acc, property) => {
          acc[property.id] = property;
          return acc;
        }, {} as { [key: string]: Property });

        setReviews(sortedReviews);
        setProperties(propertyMap);
      } catch (error) {
        console.error('Error loading recent reviews:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get consistent color based on user ID
  const getUserColor = (review: Review) => {
    if (review.isAnonymous) return 'gray.500';
    const colors = ['teal', 'blue', 'purple', 'cyan', 'pink', 'orange'];
    const hash = review.userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `${colors[Math.abs(hash) % colors.length]}.500`;
  };

  return (
    <Box py={8} width="100%">
      <Box mb={6}>
        <Heading size="lg">Recent Reviews</Heading>
      </Box>

      <Stack spacing={6} width="100%">
        {reviews.map(review => {
          const property = properties[review.propertyId];
          if (!property) return null;

          return (
            <Box
              key={review.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              _hover={{ shadow: 'md' }}
              width="100%"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Flex align="center" gap={2}>
                  <Avatar
                    size="xs"
                    name={review.isAnonymous ? 'Anonymous' : review.userName}
                    bg={getUserColor(review)}
                    color="white"
                  >
                    {getInitials(review.isAnonymous ? 'Anonymous' : review.userName)}
                  </Avatar>
                  <Text fontWeight="bold">
                    {review.isAnonymous ? (
                      <Text as="span" color="gray.500">Anonymous</Text>
                    ) : (
                      review.userName
                    )}
                  </Text>
                </Flex>
                <StarRating rating={review.rating} readonly />
              </Flex>

              <Link
                as={RouterLink}
                to={`/property/${property.id}`}
                display="block"
                color="teal.600"
                fontWeight="medium"
                mb={2}
              >
                {property.title}
              </Link>

              <Text color="gray.600" fontSize="sm" mb={3}>
                {property.address}
              </Text>

              <Text mb={3}>{review.comment}</Text>

              <Text fontSize="sm" color="gray.500">
                Reviewed on {formatDate(review.createdAt)}
              </Text>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};
