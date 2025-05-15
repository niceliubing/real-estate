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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import agentImage from '../assets/agent.JPG';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Property } from '../types/property';
import { loadProperties } from '../services/propertyService';
import { loadReviews, getAverageRating } from '../services/reviewService';
import type { Review } from '../types/review';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { EditPropertyForm } from './EditPropertyForm';

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
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();
  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onClose: onContactClose
  } = useDisclosure();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-rotate images
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoPlay && property?.images.length > 1) {
      intervalId = setInterval(() => {
        setSelectedImageIndex((prevIndex) =>
          prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlay, property?.images.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [properties, propertyReviews] = await Promise.all([
          loadProperties(),
          loadReviews(id)
        ]);
        const foundProperty = properties.find(p => p.id === id);
        setProperty(foundProperty || null);
        setReviews(propertyReviews);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
          <Box position="relative">
            <Box borderRadius="lg" overflow="hidden" mb={6}>
              <Image
                src={property.images[selectedImageIndex].startsWith('http')
                  ? property.images[selectedImageIndex]
                  : `/uploads/properties/${property.images[selectedImageIndex].split('/').pop()}`}
                alt={`${property.title} - Image ${selectedImageIndex + 1}`}
                width="100%"
                height="500px"
                objectFit="cover"
                transition="opacity 0.3s"
              />
            </Box>

            {/* Slideshow Controls */}
            <Flex
              position="absolute"
              bottom="4"
              right="4"
              bg="blackAlpha.600"
              borderRadius="md"
              p={2}
            >
              <Button
                size="sm"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                variant="ghost"
                color="white"
                _hover={{ bg: 'blackAlpha.700' }}
              >
                {isAutoPlay ? 'Pause' : 'Play'} Slideshow
              </Button>
            </Flex>
          </Box>

          {/* Image Thumbnails */}
          <SimpleGrid columns={{ base: 3, md: 5 }} spacing={4} mb={6}>
            {property.images.map((image, index) => (
              <Box
                key={index}
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setIsAutoPlay(false);
                }}
                position="relative"
                borderWidth={selectedImageIndex === index ? "2px" : "0px"}
                borderColor="teal.500"
              >
                <Image
                  src={image.startsWith('http') ? image : `/uploads/properties/${image.split('/').pop()}`}
                  alt={`${property.title} - Image ${index + 1}`}
                  width="100%"
                  height="100px"
                  objectFit="cover"
                  opacity={selectedImageIndex === index ? 1 : 0.8}
                  transition="opacity 0.2s"
                  _hover={{ opacity: 1 }}
                />
              </Box>
            ))}
          </SimpleGrid>

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

              <Stack spacing={4}>
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={onContactOpen}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  px={6}
                  py={6}
                  position="relative"
                  pl={16}
                >
                  <Box
                    position="absolute"
                    left={4}
                    borderRadius="full"
                    overflow="hidden"
                    width="32px"
                    height="32px"
                    flexShrink={0}
                    border="2px solid white"
                  >
                    <Image
                      src={agentImage}
                      alt="Agent"
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                  <Text fontSize="lg">Contact Agent</Text>
                </Button>
                {user?.role === 'admin' && (
                  <Button colorScheme="blue" size="lg" onClick={onEditOpen}>
                    Edit Property
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </GridItem>
      </Grid>

      {/* Reviews Section */}
      <Box mt={12}>
        <Heading size="lg" mb={6}>Reviews</Heading>
        <Stack spacing={6}>
          {reviews.length > 0 ? (
            <Box>
              <Heading size="md" mb={4}>
                Property Reviews ({reviews.length})
                <Badge ml={2} colorScheme="teal">
                  {getAverageRating(property.id).toFixed(1)} / 5
                </Badge>
              </Heading>
              <ReviewList reviews={reviews} />
            </Box>
          ) : (
            <Text color="gray.500">No reviews yet. Be the first to review this property!</Text>
          )}

          <Box mt={6}>
            <Heading size="md" mb={4}>Submit a Review</Heading>
            <ReviewForm
              propertyId={property.id}
              onReviewAdded={() => loadReviews(id).then(setReviews)}
            />
          </Box>
        </Stack>
      </Box>

      {/* Edit Property Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>Edit Property</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {property && (
              <EditPropertyForm
                property={property}
                onPropertyUpdated={() => {
                  onEditClose();
                  window.location.reload();
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Contact Agent Modal */}
      <Modal isOpen={isContactOpen} onClose={onContactClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agent Contact Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Flex alignItems="center" gap={4}>
                <Box
                  position="relative"
                  width="80px"
                  height="80px"
                  flexShrink={0}
                >
                  <Box
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    bg="yellow.400"
                    color="white"
                    fontSize="sm"
                    fontWeight="bold"
                    px={2}
                    borderRadius="md"
                    zIndex={1}
                    transform="rotate(20deg)"
                    boxShadow="lg"
                  >
                    #1
                  </Box>
                  <Box
                    borderRadius="full"
                    overflow="hidden"
                    border="3px solid"
                    borderColor="teal.500"
                    height="100%"
                    width="100%"
                  >
                    <Image
                      src={agentImage}
                      alt="Agent"
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Box>
                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={1}>Kevin Zhang</Text>
                  <Text color="gray.600">Real One Realty Agent</Text>
                </Box>
              </Flex>
              <Box>
                <Text fontWeight="bold" mb={2}>Email:</Text>
                <Text>kevinzhangteam@gmail.com</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>Phone:</Text>
                <Text>647-866-9188</Text>
              </Box>
              <Text fontSize="sm" color="gray.600" mt={4}>
                Our agent will respond to your inquiry within 24 hours.
              </Text>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};
