import { Box, Container, SimpleGrid, Text, Link } from '@chakra-ui/react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="white" py={8}>
      <Container>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              mb={4}
              color="white"
              textShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              TechFlow Solutions
            </Text>
            <Text
              color="white"
              fontWeight="medium"
              textShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              Transformando negócios através da tecnologia
            </Text>
          </Box>

          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              mb={4}
              color="white"
              textShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              Contato
            </Text>
            <Text
              color="white"
              fontWeight="medium"
              textShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              luissimonazure@gmail.com
            </Text>
            <Text
              color="white"
              fontWeight="medium"
              textShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              (54) 99710-9051
            </Text>
          </Box>

          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              mb={4}
              color="white"
              textShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              Redes Sociais
            </Text>
            <Box>
              <Link
                href="https://www.linkedin.com/in/luis-eduardo-simon/"
                isExternal
                mr={4}
                _hover={{ color: 'brand.500' }}
                display="inline-flex"
                alignItems="center"
              >
                <FaLinkedin size={24} />
              </Link>
              <Link
                href="https://www.instagram.com/sr.luissimon/"
                isExternal
                _hover={{ color: 'brand.500' }}
                display="inline-flex"
                alignItems="center"
              >
                <FaInstagram size={24} />
              </Link>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
} 