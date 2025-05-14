import { Box, Image, Text, Badge, Heading, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property.id}`);
  };

  console.log('PropertyCard', property);
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s' }}
      cursor="pointer"
      onClick={handleClick}
    >
      <Image
        src={property.images[0].startsWith('http')
          ? property.images[0]
          : `/uploads/properties/${property.images[0].split('properties/').pop()}`}
        alt={property.title}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {property.status === 'for-sale' ? 'For Sale' : property.status === 'for-rent' ? 'For Rent' : 'Sold'}
          </Badge>
          <Badge borderRadius="full" px="2" colorScheme="gray" ml={2}>
            {property.type}
          </Badge>
        </Box>

        <Heading size="md" mt="2" mb="2">
          {property.title}
        </Heading>

        <Text color="gray.600" fontSize="sm">
          {property.address}
        </Text>

        <Text fontWeight="bold" fontSize="xl" mt="2">
          {formatPrice(property.price)}
        </Text>

        <HStack gap={4} mt="2">
          <Text fontSize="sm">{property.bedrooms} beds</Text>
          <Text fontSize="sm">{property.bathrooms} baths</Text>
          <Text fontSize="sm">{property.squareFeet.toLocaleString()} sqft</Text>
        </HStack>

        <Box mt="4">
          <Text color="gray.600" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {property.description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};