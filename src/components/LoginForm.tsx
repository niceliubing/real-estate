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
import { login } from '../services/userService';
import type { LoginCredentials } from '../types/user';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const credentials: LoginCredentials = {
        email: formData.get('email')?.toString() || '',
        password: formData.get('password')?.toString() || ''
      };

      await login(credentials);

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Login failed',
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
        <Heading size="lg" textAlign="center">Login</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
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

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default LoginForm;