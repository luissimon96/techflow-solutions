import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
  Divider,
  Link
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, LockIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validação
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    admin: {
      id: string;
      name: string;
      email: string;
      role: string;
      lastLogin: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: LoginResponse = await response.json();

      if (result.success && result.data) {
        // Salvar tokens no localStorage
        localStorage.setItem('admin_access_token', result.data.accessToken);
        localStorage.setItem('admin_refresh_token', result.data.refreshToken);
        localStorage.setItem('admin_user', JSON.stringify(result.data.admin));

        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo, ${result.data.admin.name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Redirecionar para dashboard
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box p={4} bg="brand.500" borderRadius="full">
              <LockIcon boxSize={8} color="white" />
            </Box>
            <Heading size="lg" color="gray.700">
              Painel Administrativo
            </Heading>
            <Text color="gray.600">
              TechFlow Solutions
            </Text>
          </VStack>

          {/* Login Form */}
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6}>
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="admin@techflow.com"
                      {...register('email')}
                      bg="white"
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Senha</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        {...register('password')}
                        bg="white"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {errors.password && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.password.message}
                      </Text>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Entrando..."
                  >
                    Entrar
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          <Divider />

          {/* Footer */}
          <VStack spacing={2} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              Acesso restrito a administradores
            </Text>
            <Link
              href="/"
              color="brand.500"
              fontSize="sm"
              _hover={{ textDecoration: 'underline' }}
            >
              ← Voltar ao site
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
} 