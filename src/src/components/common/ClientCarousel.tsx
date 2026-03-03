import { Box, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ImageFallback } from './ImageFallback';

const MotionBox = motion(Box);

const clients = [
  {
    name: 'Magazine Luiza',
    logo: '/logos/magalu.svg',
  },
  {
    name: 'Magalu Tech',
    logo: '/logos/magalu-tech.svg',
  },
  {
    name: 'Kabum',
    logo: '/logos/kabum.svg',
  },
  {
    name: 'Telefônica',
    logo: '/logos/telefonica.svg',
  },
  {
    name: 'Vivo',
    logo: '/logos/vivo.svg',
  },
];

// Duplicamos a lista para criar um efeito contínuo
const duplicatedClients = [...clients, ...clients];

export function ClientCarousel() {
  return (
    <Box
      w="100%"
      overflow="hidden"
      bg="gray.50"
      py={8}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '100px',
        background: 'linear-gradient(to right, gray.50, transparent)',
        zIndex: 1,
      }}
      _after={{
        content: '""',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '100px',
        background: 'linear-gradient(to left, gray.50, transparent)',
        zIndex: 1,
      }}
    >
      <MotionBox
        display="flex"
        animate={{
          x: [0, -50 * clients.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
      >
        {duplicatedClients.map((client, index) => (
          <Box
            key={`${client.name}-${index}`}
            mx={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW="150px"
          >
            <Image
              src={client.logo}
              alt={client.name}
              fallback={<ImageFallback width="150px" height="60px" text={client.name} />}
              maxH="60px"
              objectFit="contain"
              filter="grayscale(100%)"
              opacity={0.7}
              transition="all 0.3s ease"
              _hover={{
                filter: 'grayscale(0%)',
                opacity: 1,
              }}
            />
          </Box>
        ))}
      </MotionBox>
    </Box>
  );
} 