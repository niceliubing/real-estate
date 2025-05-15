import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../context/AuthContext';
import { login } from '../services/userService';
import type { LoginCredentials } from '../types/user';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const credentials: LoginCredentials = {
        email: formData.get('email')?.toString() || '',
        password: formData.get('password')?.toString() || ''
      };

      const user = await login(credentials);
      setUser(user);

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSuccess();
      navigate('/properties');
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
    <Box
      minH="100vh"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      bg="gray.50"
      w="100%"
      position="fixed"
      top="0"
      left="0"
      pt="120px"
    >
      <Box
        p={8}
        maxWidth="400px"
        width="90%"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
        mx="auto"
      >
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
    </Box>
  );
};

export default LoginForm;