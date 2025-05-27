import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  Badge,
  Icon,
  Flex,
  Spacer
} from '@chakra-ui/react';
import {
  FiUsers,
  FiMail,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiPlus,
  FiEye
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

interface DashboardStats {
  totalContacts: number;
  totalQuotes: number;
  totalProjects: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalQuotes: 0,
    totalProjects: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Verificar se está autenticado
    const token = localStorage.getItem('admin_access_token');
    const userData = localStorage.getItem('admin_user');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setAdmin(user);
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Simular dados por enquanto (implementar APIs depois)
      setStats({
        totalContacts: 45,
        totalQuotes: 23,
        totalProjects: 12,
        recentActivity: [
          {
            id: '1',
            type: 'contact',
            message: 'Novo contato recebido de João Silva',
            timestamp: '2 horas atrás'
          },
          {
            id: '2',
            type: 'quote',
            message: 'Solicitação de orçamento para desenvolvimento web',
            timestamp: '4 horas atrás'
          },
          {
            id: '3',
            type: 'project',
            message: 'Projeto "E-commerce ABC" foi atualizado',
            timestamp: '1 dia atrás'
          }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const refreshToken = localStorage.getItem('admin_refresh_token');

      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar localStorage
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');

      toast({
        title: 'Logout realizado com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      navigate('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Carregando...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" px={6} py={4}>
        <Flex align="center">
          <Heading size="lg" color="brand.500">
            TechFlow Admin
          </Heading>
          <Spacer />
          <Menu>
            <MenuButton as={Button} variant="ghost" rightIcon={<FiChevronDown />}>
              <HStack spacing={3}>
                <Avatar size="sm" name={admin?.name} />
                <VStack spacing={0} align="start">
                  <Text fontSize="sm" fontWeight="medium">
                    {admin?.name}
                  </Text>
                  <Badge colorScheme="brand" size="sm">
                    {admin?.role}
                  </Badge>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiSettings />}>
                Configurações
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <Box>
            <Heading size="lg" mb={2}>
              Bem-vindo, {admin?.name}! 👋
            </Heading>
            <Text color="gray.600">
              Aqui está um resumo das atividades recentes do seu painel administrativo.
            </Text>
          </Box>

          {/* Stats Grid */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <Icon as={FiMail} color="blue.500" />
                        <Text>Contatos</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>{stats.totalContacts}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      23% este mês
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <Icon as={FiFileText} color="green.500" />
                        <Text>Orçamentos</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>{stats.totalQuotes}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      12% este mês
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <Icon as={FiUsers} color="purple.500" />
                        <Text>Projetos</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>{stats.totalProjects}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      8% este mês
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Ações Rápidas
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="brand"
                  onClick={() => navigate('/admin/projects/new')}
                >
                  Novo Projeto
                </Button>
                <Button
                  leftIcon={<FiEye />}
                  variant="outline"
                  onClick={() => navigate('/admin/contacts')}
                >
                  Ver Contatos
                </Button>
                <Button
                  leftIcon={<FiFileText />}
                  variant="outline"
                  onClick={() => navigate('/admin/quotes')}
                >
                  Ver Orçamentos
                </Button>
                <Button
                  leftIcon={<FiSettings />}
                  variant="outline"
                  onClick={() => navigate('/admin/settings')}
                >
                  Configurações
                </Button>
              </Grid>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Atividade Recente
              </Heading>
              <VStack spacing={4} align="stretch">
                {stats.recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    borderLeft="4px"
                    borderLeftColor="brand.500"
                  >
                    <Text fontWeight="medium" mb={1}>
                      {activity.message}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {activity.timestamp}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
} 