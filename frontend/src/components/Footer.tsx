import { Box, Container, SimpleGrid, Text, Icon, Link } from '@chakra-ui/react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="white" py={8}>
      <Container>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              TechFlow Solutions
            </Text>
            <Text>Transformando negócios através da tecnologia</Text>

            {/* Link discreto para admin */}
            <Link
              as={RouterLink}
              to="/admin/login"
              fontSize="xs"
              color="gray.600"
              _hover={{ color: 'gray.400' }}
              mt={4}
              display="block"
            >
              Admin
            </Link>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Contato
            </Text>
            <Text>luissimonazure@gmail.com</Text>
            <Text>(54) 99710-9051</Text>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Redes Sociais
            </Text>
            <Box>
              <Link
                href="https://www.linkedin.com/in/luis-eduardo-simon/"
                isExternal
                mr={4}
                _hover={{ color: 'brand.500' }}
              >
                <Icon as={FaLinkedin} boxSize={6} />
              </Link>
              <Link
                href="https://www.instagram.com/sr.luissimon/"
                isExternal
                _hover={{ color: 'brand.500' }}
              >
                <Icon as={FaInstagram} boxSize={6} />
              </Link>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
} 