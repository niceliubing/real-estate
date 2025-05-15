import { Box, Container, Flex, Heading, Button, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <Box as="header" bg="white" boxShadow="sm">
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="teal.500" cursor="pointer" onClick={() => navigate('/')}>
            Real Estate
          </Heading>
          <HStack gap={4}>
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            <Button variant="ghost" onClick={() => navigate('/properties')}>Properties</Button>
            <Button variant="ghost">About</Button>
            <Button variant="solid" colorScheme="teal" onClick={() => navigate('/contact')}>
              Contact
            </Button>
            {/* Only show admin login/logout button */}
            {(user?.role === 'admin' || !user) && (
              <Button
                variant="outline"
                colorScheme="teal"
                onClick={handleAuthClick}
              >
                {user ? 'Logout' : 'Admin Login'}
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};