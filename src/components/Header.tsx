import { Box, Flex, Heading, Button, HStack, Image } from '@chakra-ui/react';
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
    <Box
      as="header"
      bg="white"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
      width="100%"
    >
      <Box
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={4}
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
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

        <HStack spacing={4}>
          <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
          <Button variant="ghost" onClick={() => navigate('/properties')}>Properties</Button>
          <Button variant="ghost" onClick={() => navigate('/reviews')}>Reviews</Button>
          <Button variant="solid" colorScheme="teal" onClick={() => navigate('/contact')}>
            Contact
          </Button>
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
      </Box>
    </Box>
  );
};