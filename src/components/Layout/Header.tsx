import { Box, Flex, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Logo } from '../common/Logo';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contato', path: '/contato' },
];

export function Header() {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        h="16"
        align="center"
        justify="space-between"
      >
        <Logo />

        <Flex as="nav" gap={4} display={{ base: 'none', md: 'flex' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              as={RouterLink}
              to={item.path}
              variant="ghost"
              size="sm"
            >
              {item.label}
            </Button>
          ))}
        </Flex>

        <Button
          display={{ base: 'flex', md: 'none' }}
          variant="ghost"
          size="sm"
          aria-label="Menu"
        >
          Menu
        </Button>
      </Flex>
    </Box>
  );
} 