import { AuthService, AuthCredentials } from '../../services/AuthService';
import { MockAdminRepository } from '../mocks/MockAdminRepository';
import { IAdmin } from '../../models/Admin';

// 🧪 AuthService Unit Tests
// Testa AuthService de forma isolada usando Mock Repository
// Demonstra que Dependency Inversion está funcionando corretamente

describe('AuthService', () => {
  let authService: AuthService;
  let mockRepository: MockAdminRepository;
  let mockAdmin: IAdmin;

  beforeEach(() => {
    mockRepository = new MockAdminRepository();
    authService = new AuthService(mockRepository);

    // Create a test admin
    mockAdmin = mockRepository.addMockAdmin({
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'admin',
      isActive: true,
      loginAttempts: 0,
      password: 'hashedpassword'
    });

    // Setup password comparison mock
    (mockAdmin.comparePassword as jest.Mock).mockResolvedValue(true);
    (mockAdmin.generateAccessToken as jest.Mock).mockReturnValue('access-token-123');
    (mockAdmin.generateRefreshToken as jest.Mock).mockReturnValue('refresh-token-123');
    (mockAdmin.isLocked as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    mockRepository.reset();
    jest.clearAllMocks();
  });

  describe('authenticateAdmin', () => {
    it('should authenticate valid admin successfully', async () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'admin@test.com',
        password: 'correctpassword'
      };

      // Act
      const result = await authService.authenticateAdmin(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.admin).toMatchObject({
        id: mockAdmin._id.toString(),
        name: mockAdmin.name,
        email: mockAdmin.email,
        role: mockAdmin.role
      });
      expect(result.accessToken).toBe('access-token-123');
      expect(result.refreshToken).toBe('refresh-token-123');
      expect(result.message).toBe('Login realizado com sucesso');

      // Verify repository interactions
      expect(mockAdmin.comparePassword).toHaveBeenCalledWith('correctpassword');
      expect(mockAdmin.generateAccessToken).toHaveBeenCalled();
      expect(mockAdmin.generateRefreshToken).toHaveBeenCalled();
    });

    it('should fail authentication for non-existent admin', async () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'nonexistent@test.com',
        password: 'anypassword'
      };

      // Act
      const result = await authService.authenticateAdmin(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciais inválidas');
      expect(result.admin).toBeUndefined();
      expect(result.accessToken).toBeUndefined();
    });

    it('should fail authentication for locked admin', async () => {
      // Arrange
      (mockAdmin.isLocked as jest.Mock).mockReturnValue(true);
      
      const credentials: AuthCredentials = {
        email: 'admin@test.com',
        password: 'correctpassword'
      };

      // Act
      const result = await authService.authenticateAdmin(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Conta temporariamente bloqueada devido a muitas tentativas de login');
      expect(mockAdmin.comparePassword).not.toHaveBeenCalled();
    });

    it('should fail authentication for inactive admin', async () => {
      // Arrange
      (mockAdmin as any).isActive = false;
      
      const credentials: AuthCredentials = {
        email: 'admin@test.com',
        password: 'correctpassword'
      };

      // Act
      const result = await authService.authenticateAdmin(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Conta desativada');
      expect(mockAdmin.comparePassword).not.toHaveBeenCalled();
    });

    it('should fail authentication for wrong password', async () => {
      // Arrange
      (mockAdmin.comparePassword as jest.Mock).mockResolvedValue(false);
      
      const credentials: AuthCredentials = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };

      // Act
      const result = await authService.authenticateAdmin(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciais inválidas');
      expect(mockAdmin.comparePassword).toHaveBeenCalledWith('wrongpassword');
      
      // Should increment login attempts
      const admin = await mockRepository.findById(mockAdmin._id.toString());
      expect((admin as any).loginAttempts).toBe(1);
    });

    it('should handle authentication errors gracefully', async () => {
      // Arrange
      (mockAdmin.comparePassword as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const credentials: AuthCredentials = {
        email: 'admin@test.com',
        password: 'correctpassword'
      };

      // Act
      const result = await authService.authenticateAdmin(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro interno do servidor');
    });

    it('should add refresh token to repository on success', async () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'admin@test.com',
        password: 'correctpassword'
      };

      // Act
      await authService.authenticateAdmin(credentials);

      // Assert
      const admin = await mockRepository.findById(mockAdmin._id.toString());
      expect(admin?.refreshTokens).toContain('refresh-token-123');
    });

    it('should reset login attempts on successful authentication', async () => {
      // Arrange
      (mockAdmin as any).loginAttempts = 3;
      
      const credentials: AuthCredentials = {
        email: 'admin@test.com',
        password: 'correctpassword'
      };

      // Act
      await authService.authenticateAdmin(credentials);

      // Assert
      const admin = await mockRepository.findById(mockAdmin._id.toString());
      expect((admin as any).loginAttempts).toBe(0);
    });
  });

  describe('logoutAdmin', () => {
    it('should logout admin successfully with refresh token', async () => {
      // Arrange
      const adminId = mockAdmin._id.toString();
      const refreshToken = 'test-refresh-token';
      
      await mockRepository.addRefreshToken(adminId, refreshToken);

      // Act
      const result = await authService.logoutAdmin(adminId, refreshToken);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logout realizado com sucesso');
      
      // Verify token was removed
      const admin = await mockRepository.findById(adminId);
      expect(admin?.refreshTokens).not.toContain(refreshToken);
    });

    it('should logout admin successfully without refresh token', async () => {
      // Arrange
      const adminId = mockAdmin._id.toString();

      // Act
      const result = await authService.logoutAdmin(adminId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logout realizado com sucesso');
    });

    it('should handle logout errors gracefully', async () => {
      // Arrange
      const invalidAdminId = 'invalid-id';
      
      // Mock repository to throw error
      jest.spyOn(mockRepository, 'removeRefreshToken').mockRejectedValue(new Error('Repository error'));

      // Act
      const result = await authService.logoutAdmin(invalidAdminId, 'token');

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro interno do servidor');
    });
  });

  describe('logoutAllSessions', () => {
    it('should logout all sessions successfully', async () => {
      // Arrange
      const adminId = mockAdmin._id.toString();
      await mockRepository.addRefreshToken(adminId, 'token1');
      await mockRepository.addRefreshToken(adminId, 'token2');

      // Act
      const result = await authService.logoutAllSessions(adminId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logout de todas as sessões realizado com sucesso');
      
      // Verify all tokens were cleared
      const admin = await mockRepository.findById(adminId);
      expect(admin?.refreshTokens).toHaveLength(0);
    });

    it('should fail if admin not found', async () => {
      // Arrange
      const invalidAdminId = 'nonexistent-id';

      // Act
      const result = await authService.logoutAllSessions(invalidAdminId);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Admin não encontrado');
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const adminId = mockAdmin._id.toString();
      
      // Mock repository to throw error
      jest.spyOn(mockRepository, 'clearAllRefreshTokens').mockRejectedValue(new Error('Repository error'));

      // Act
      const result = await authService.logoutAllSessions(adminId);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro interno do servidor');
    });
  });

  describe('Integration with Repository Pattern', () => {
    it('should demonstrate dependency inversion principle', () => {
      // Assert
      // The service depends on IAdminRepository abstraction, not concrete implementation
      expect(authService).toBeDefined();
      
      // We can inject any implementation that satisfies IAdminRepository
      const anotherMockRepository = new MockAdminRepository();
      const anotherAuthService = new AuthService(anotherMockRepository);
      expect(anotherAuthService).toBeDefined();
    });

    it('should work with different repository implementations', async () => {
      // Arrange - Different repository with different data
      const customRepository = new MockAdminRepository([
        {
          email: 'custom@test.com',
          name: 'Custom Admin',
          role: 'super-admin',
          isActive: true
        }
      ]);
      
      const customAuthService = new AuthService(customRepository);
      
      // Setup custom admin mock
      const customAdmin = await customRepository.findByEmail('custom@test.com', true);
      (customAdmin!.comparePassword as jest.Mock).mockResolvedValue(true);
      (customAdmin!.generateAccessToken as jest.Mock).mockReturnValue('custom-access-token');
      (customAdmin!.generateRefreshToken as jest.Mock).mockReturnValue('custom-refresh-token');

      // Act
      const result = await customAuthService.authenticateAdmin({
        email: 'custom@test.com',
        password: 'password'
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.admin?.email).toBe('custom@test.com');
      expect(result.admin?.role).toBe('super-admin');
      expect(result.accessToken).toBe('custom-access-token');
    });
  });
});