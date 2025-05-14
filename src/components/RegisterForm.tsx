import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { register } from '../services/userService';
import type { RegisterData } from '../types/user';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: RegisterData = {
        email: formData.get('email')?.toString() || '',
        password: formData.get('password')?.toString() || '',
        confirmPassword: formData.get('confirmPassword')?.toString() || '',
        name: formData.get('name')?.toString() || ''
      };

      await register(data);

      toast({
        title: 'Registration successful',
        description: 'You can now log in with your credentials',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <Heading size="lg" textAlign="center">Register</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Enter your name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isLoading}
            >
              Register
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};