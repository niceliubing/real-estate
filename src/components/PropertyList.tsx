import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Heading, Button, useToast } from '@chakra-ui/react';
import { PropertyCard } from './PropertyCard';
import { AddPropertyForm } from './AddPropertyForm';
import { loadProperties } from '../services/propertyService';
import type { Property } from '../types/property';
import { useAuth } from '../context/AuthContext';

export const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const data = await loadProperties();
      setProperties(data);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load properties. Please try refreshing the page.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      // Refresh properties when showing the form
      fetchProperties();
    }
  };

  const handlePropertyAdded = () => {
    // Refresh properties after adding a new one
    fetchProperties();
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <Box py={8}>
        <Heading>Loading...</Heading>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <Box display="flex" flexDirection="column" gap={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Featured Properties ({properties.length})</Heading>
          {user?.role === 'admin' && (
            <Button colorScheme="teal" onClick={handleAddProperty}>
              {showAddForm ? 'Hide Form' : 'Add New Property'}
            </Button>
          )}
        </Box>

        {showAddForm && user?.role === 'admin' && (
          <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
        )}

        {properties.length === 0 ? (
          <Box p={8} textAlign="center">
            <Heading size="md">No properties found</Heading>
          </Box>
        ) : (
          <SimpleGrid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};