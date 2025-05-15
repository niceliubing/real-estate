import { Box, Container, Flex, Heading, Button, HStack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import agentImage from '../assets/agent.JPG';

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
          <Flex align="center" gap={3} cursor="pointer" onClick={() => navigate('/')}>
            <Box
              width="40px"
              height="40px"
              borderRadius="full"
              overflow="hidden"
              border="2px solid"
              borderColor="teal.500"
            >
              <Image
                src={agentImage}
                alt="Kevin Zhang"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>
            <Heading size="lg" color="teal.500">
              Real Estate
            </Heading>
          </Flex>
          <HStack gap={4}>
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            <Button variant="ghost" onClick={() => navigate('/properties')}>Properties</Button>
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