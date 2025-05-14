import {
  Box,
  Container,
  Image,
  Text,
  Grid,
  GridItem,
  Heading,
  Stack,
  Badge,
  Divider,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Flex,
  Button,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Property } from '../types/property';
import { loadProperties } from '../services/propertyService';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

export const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const properties = await loadProperties();
        const foundProperty = properties.find(p => p.id === id);
        setProperty(foundProperty || null);
      } catch (error) {
        console.error('Error loading property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Property not found</Text>
        <Button onClick={() => navigate('/properties')} mt={4}>
          Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Button onClick={() => navigate('/properties')} mb={8}>
        Back to Properties
      </Button>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <GridItem>
          {/* Main Image Gallery */}
          <Box borderRadius="lg" overflow="hidden" mb={6}>
            <Image
              src={property.images[0]}
              alt={property.title}
              width="100%"
              height="500px"
              objectFit="cover"
            />
          </Box>

          {/* Additional Images */}
          {property.images.length > 1 && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
              {property.images.slice(1).map((image, index) => (
                <Box
                  key={index}
                  borderRadius="lg"
                  overflow="hidden"
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - Image ${index + 2}`}
                    width="100%"
                    height="100px"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}

          {/* Property Description */}
          <Box mt={6}>
            <Heading size="md" mb={4}>Description</Heading>
            <Text whiteSpace="pre-line">{property.description}</Text>
          </Box>

          {/* Property Features */}
          <Box mt={8}>
            <Heading size="md" mb={4}>Features</Heading>
            <List spacing={3}>
              {property.features.map((feature, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  {feature}
                </ListItem>
              ))}
            </List>
          </Box>
        </GridItem>

        {/* Property Details Sidebar */}
        <GridItem>
          <Box
            position="sticky"
            top="24px"
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            shadow="md"
          >
            <Stack spacing={4}>
              <Heading size="xl">{formatPrice(property.price)}</Heading>
              <Flex gap={2}>
                <Badge colorScheme="teal" fontSize="md" px={2} py={1}>
                  {property.status === 'for-sale' ? 'For Sale' : 
                   property.status === 'for-rent' ? 'For Rent' : 'Sold'}
                </Badge>
                <Badge colorScheme="purple" fontSize="md" px={2} py={1}>
                  {property.type}
                </Badge>
              </Flex>

              <Heading size="lg">{property.title}</Heading>
              <Text color="gray.600">{property.address}</Text>

              <Divider />

              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Bedrooms</Text>
                  <Text>{property.bedrooms}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Bathrooms</Text>
                  <Text>{property.bathrooms}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Square Feet</Text>
                  <Text>{property.squareFeet.toLocaleString()}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Property Type</Text>
                  <Text textTransform="capitalize">{property.type}</Text>
                </Box>
              </SimpleGrid>

              <Divider />

              <Button colorScheme="teal" size="lg">
                Contact Agent
              </Button>
            </Stack>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};
