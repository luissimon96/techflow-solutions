import { Box, Container, SimpleGrid, Text, Icon, Link } from '@chakra-ui/react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

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
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Contato
            </Text>
            <Text>contato@techflow.com.br</Text>
            <Text>(11) 99999-9999</Text>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Redes Sociais
            </Text>
            <Box>
              <Link
                href="https://linkedin.com/company/techflow"
                isExternal
                mr={4}
                _hover={{ color: 'brand.500' }}
              >
                <Icon as={FaLinkedin} boxSize={6} />
              </Link>
              <Link
                href="https://instagram.com/techflow"
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