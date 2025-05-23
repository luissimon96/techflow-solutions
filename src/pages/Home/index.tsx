import { Box, Button, Container, Heading, Text, Stack, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="brand.500"
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={8}
            align="center"
          >
            <Stack flex={1} spacing={6}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  Transformando ideias em soluções digitais
                </Heading>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Text fontSize="xl" opacity={0.9}>
                  Desenvolvemos soluções tecnológicas inovadoras para impulsionar
                  o crescimento do seu negócio.
                </Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/contato"
                    size="lg"
                    colorScheme="whiteAlpha"
                    _hover={{ bg: 'whiteAlpha.900' }}
                  >
                    Fale Conosco
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/servicos"
                    size="lg"
                    variant="outline"
                    color="white"
                    borderColor="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    Nossos Serviços
                  </Button>
                </Stack>
              </MotionBox>
            </Stack>

            <MotionBox
              flex={1}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Image
                src="/hero-image.svg"
                alt="TechFlow Solutions"
                fallbackSrc="https://via.placeholder.com/600x400"
                maxW="100%"
                h="auto"
              />
            </MotionBox>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Stack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Por que escolher a TechFlow?
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Oferecemos soluções completas para transformar sua visão em realidade
              </Text>
            </Stack>

            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={8}
              justify="center"
            >
              {features.map((feature, index) => (
                <MotionBox
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  flex={1}
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Stack spacing={4}>
                    <Box
                      w={12}
                      h={12}
                      bg="brand.500"
                      color="white"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {feature.icon}
                    </Box>
                    <Heading as="h3" size="md">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600">
                      {feature.description}
                    </Text>
                  </Stack>
                </MotionBox>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

const features = [
  {
    title: 'Desenvolvimento Web',
    description: 'Criamos sites e aplicações web modernas e responsivas.',
    icon: '🌐',
  },
  {
    title: 'Consultoria Técnica',
    description: 'Oferecemos consultoria especializada em tecnologia.',
    icon: '💡',
  },
  {
    title: 'Suporte Contínuo',
    description: 'Garantimos suporte e manutenção contínua.',
    icon: '🛠️',
  },
]; 