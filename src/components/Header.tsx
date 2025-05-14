import { Box, Container, Flex, Heading, Button, HStack } from '@chakra-ui/react';

export const Header = () => {
  return (
    <Box as="header" bg="white" boxShadow="sm">
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="teal.500">
            Real Estate
          </Heading>
          <HStack gap={4}>
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Properties</Button>
            <Button variant="ghost">About</Button>
            <Button variant="solid" colorScheme="teal">
              Contact
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};