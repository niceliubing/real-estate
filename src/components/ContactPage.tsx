import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Icon,
  Badge
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { saveContactMessage } from '../services/contactService';
import { type ContactMessage } from '../types/contact';

export const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const messageData: Omit<ContactMessage, 'id' | 'createdAt'> = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
      };

      await saveContactMessage(messageData);

      toast({
        title: 'Message sent!',
        description: 'We will get back to you as soon as possible.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <VStack spacing={12} width="100%" align="stretch">
        {/* Contact Information Section */}
        <Box textAlign="center">
          <Badge colorScheme="teal" fontSize="md" px={3} py={1} mb={4}>
            Get in Touch
          </Badge>
          <Heading size="xl" mb={4}>Contact Kevin Zhang</Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Whether you're looking to buy, sell, or just have questions about the real estate market,
            I'm here to help you make informed decisions with AI-powered insights.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="100%">
          <VStack
            p={8}
            bg="white"
            borderRadius="lg"
            shadow="md"
            spacing={4}
            align="center"
          >
            <Icon as={FaPhone} boxSize="6" color="teal.500" />
            <Text fontWeight="bold">Call Us</Text>
            <Text color="gray.600">647-866-9188</Text>
            <Text color="gray.500" fontSize="sm">Available 9 AM - 6 PM EST</Text>
          </VStack>

          <VStack
            p={8}
            bg="white"
            borderRadius="lg"
            shadow="md"
            spacing={4}
            align="center"
          >
            <Icon as={FaEnvelope} boxSize="6" color="teal.500" />
            <Text fontWeight="bold">Email Us</Text>
            <Text color="gray.600">kevinzhangteam@gmail.com</Text>
            <Text color="gray.500" fontSize="sm">We reply within 24 hours</Text>
          </VStack>

          <VStack
            p={8}
            bg="white"
            borderRadius="lg"
            shadow="md"
            spacing={4}
            align="center"
          >
            <VStack
              as="a"
              href="https://www.google.com/maps/search/?api=1&query=1660+North+Service+Rd+E+unit+103+Oakville+ON+L6H+7G3"
              target="_blank"
              rel="noopener noreferrer"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            >
              <Icon as={FaMapMarkerAlt} boxSize="6" color="teal.500" />
              <Text fontWeight="bold">Visit Us</Text>
              <Text color="gray.600">Oakville Office</Text>
              <Text color="gray.500" fontSize="sm">By appointment only</Text>
            </VStack>
          </VStack>
        </SimpleGrid>

        {/* Contact Form Section */}
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          shadow="lg"
          width="100%"
          maxW="3xl"
          mx="auto"
        >
          <Heading size="lg" mb={6} textAlign="center">Send us a Message</Heading>
          <form ref={formRef} onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} width="100%">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input name="firstName" type="text" placeholder="Enter your first name" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input name="lastName" type="text" placeholder="Enter your last name" />
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" placeholder="Enter your email" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input name="phone" type="tel" placeholder="Enter your phone number" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  name="message"
                  placeholder="How can we help you?"
                  rows={4}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="100%"
                isLoading={isSubmitting}
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default ContactPage;
