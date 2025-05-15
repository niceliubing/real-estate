import { ChakraProvider } from '@chakra-ui/react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Badge,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react'
import { FaRobot, FaStar, FaAward, FaHome, FaComments } from 'react-icons/fa'
import { Header } from './components/Header'
import { useNavigate } from 'react-router-dom'
import agentImage from './assets/agent.JPG'


function App() {
  const navigate = useNavigate()
  const bgGradient = useColorModeValue(
    'linear(to-b, teal.50, white)',
    'linear(to-b, gray.900, gray.800)'
  )

  return (
    <ChakraProvider>
      <Header />
      <Box bgGradient={bgGradient} minH="90vh">
        <Container maxW="container.xl" py={12}>
          {/* Hero Section */}
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" mb={16} gap={8}>
            <VStack align="flex-start" spacing={6} flex={1}>
              <Badge colorScheme="teal" fontSize="md" px={3} py={1}>
                AI-Powered Real Estate
              </Badge>
              <Heading size="2xl" lineHeight="shorter">
                Welcome to the Future of
                <Text as="span" color="teal.500"> Real Estate</Text>
              </Heading>
              <Text fontSize="xl" color="gray.600">
                Experience property search reimagined through artificial intelligence,
                bringing you closer to your dream home with cutting-edge technology.
              </Text>
              <HStack spacing={4}>
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={() => navigate('/properties')}
                >
                  Browse Properties
                </Button>
                <Button
                  variant="outline"
                  colorScheme="teal"
                  size="lg"
                  onClick={() => document.getElementById('agent-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Meet Our Agent
                </Button>
              </HStack>
            </VStack>
            <Box
              flex={1}
              position="relative"
              maxW={{ base: "300px", md: "400px" }}
            >
              <Icon
                as={FaRobot}
                position="absolute"
                top="-20px"
                right="-20px"
                boxSize="40px"
                color="teal.500"
              />
              <Image
                src={agentImage}
                alt="Kevin Zhang"
                borderRadius="2xl"
                shadow="2xl"
              />
            </Box>
          </Flex>

          {/* Features Section */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={16}>
            <VStack align="flex-start" p={6} bg="white" borderRadius="lg" shadow="md">
              <Icon as={FaRobot} boxSize="40px" color="teal.500" mb={4} />
              <Heading size="md">AI-Powered Search</Heading>
              <Text color="gray.600">
                Our intelligent system helps you find the perfect property based on your preferences.
              </Text>
            </VStack>
            <VStack align="flex-start" p={6} bg="white" borderRadius="lg" shadow="md">
              <Icon as={FaHome} boxSize="40px" color="teal.500" mb={4} />
              <Heading size="md">Curated Listings</Heading>
              <Text color="gray.600">
                Premium properties handpicked to match your lifestyle and requirements.
              </Text>
            </VStack>
            <VStack align="flex-start" p={6} bg="white" borderRadius="lg" shadow="md">
              <Icon as={FaComments} boxSize="40px" color="teal.500" mb={4} />
              <Heading size="md">Smart Insights</Heading>
              <Text color="gray.600">
                Get AI-powered insights and recommendations for each property.
              </Text>
            </VStack>
          </SimpleGrid>

          {/* Agent Section */}
          <Box id="agent-section" mb={16} bg="white" p={8} borderRadius="xl" shadow="lg">
            <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={8}>
              <Box flex={1}>
                <Image
                  src={agentImage}
                  alt="Kevin Zhang"
                  borderRadius="full"
                  boxSize="300px"
                  objectFit="cover"
                  mx="auto"
                />
              </Box>
              <VStack align="flex-start" flex={1.5} spacing={4}>
                <Badge colorScheme="teal" fontSize="md" px={3} py={1}>
                  #1 Bay Area Realtor
                </Badge>
                <Heading size="xl">Kevin Zhang</Heading>
                <Text fontSize="lg" color="gray.700">
                  With over a decade of experience in the Bay Area real estate market, Kevin Zhang has consistently ranked as the #1 realtor in the region. His innovative approach combines traditional expertise with cutting-edge AI technology to provide unparalleled service to his clients.
                </Text>
                <HStack spacing={4}>
                  <VStack align="flex-start">
                    <Heading size="md" color="teal.500">500+</Heading>
                    <Text color="gray.600">Properties Sold</Text>
                  </VStack>
                  <VStack align="flex-start">
                    <Heading size="md" color="teal.500">98%</Heading>
                    <Text color="gray.600">Client Satisfaction</Text>
                  </VStack>
                  <VStack align="flex-start">
                    <Heading size="md" color="teal.500">$1B+</Heading>
                    <Text color="gray.600">In Sales</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Flex>
          </Box>

          {/* Testimonials Section */}
          <Box mb={16}>
            <Heading size="xl" mb={8} textAlign="center">What Our Clients Say</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {[
                {
                  name: "Sarah Johnson",
                  role: "Home Buyer",
                  text: "Kevin's AI-powered search helped us find our dream home in just two weeks! The technology is incredible.",
                },
                {
                  name: "Michael Chen",
                  role: "Property Investor",
                  text: "The AI insights provided valuable market analysis that helped me make informed investment decisions.",
                },
                {
                  name: "Emily Rodriguez",
                  role: "First-time Buyer",
                  text: "The combination of AI technology and Kevin's expertise made the home-buying process seamless and enjoyable.",
                },
              ].map((testimonial, index) => (
                <VStack
                  key={index}
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  shadow="md"
                  spacing={4}
                >
                  <Icon as={FaStar} color="yellow.400" boxSize="30px" />
                  <Text fontSize="md" color="gray.600" textAlign="center">
                    "{testimonial.text}"
                  </Text>
                  <VStack spacing={1}>
                    <Text fontWeight="bold">{testimonial.name}</Text>
                    <Text fontSize="sm" color="gray.500">{testimonial.role}</Text>
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>

          {/* CTA Section */}
          <Box textAlign="center" bg="teal.500" p={12} borderRadius="xl" color="white">
            <Heading size="lg" mb={4}>
              Ready to Find Your Dream Home?
            </Heading>
            <Text fontSize="xl" mb={6}>
              Let our AI-powered platform and expert realtor guide you to the perfect property.
            </Text>
            <Button
              size="lg"
              colorScheme="white"
              variant="outline"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => navigate('/properties')}
            >
              Start Your Search Today
            </Button>
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
