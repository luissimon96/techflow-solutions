import { IAdmin } from '../../models/Admin';
import { 
  IAdminRepository, 
  CreateAdminData, 
  UpdateAdminData, 
  FindAdminFilters 
} from '../../repositories/IAdminRepository';

// 🎭 Mock Admin Repository for Unit Tests
// Implementa IAdminRepository com dados em memória
// Permite teste isolado dos serviços sem dependência do MongoDB

export class MockAdminRepository implements IAdminRepository {
  private admins: IAdmin[] = [];
  private nextId = 1;

  constructor(initialData: Partial<IAdmin>[] = []) {
    this.admins = initialData.map(data => this.createMockAdmin(data));
  }

  // 🔧 Helper Methods
  private createMockAdmin(data: Partial<IAdmin>): IAdmin {
    const mockAdmin = {
      _id: { toString: () => String(this.nextId++) },
      name: data.name || 'Test Admin',
      email: data.email || 'test@example.com',
      password: data.password || 'hashedpassword',
      role: data.role || 'admin',
      isActive: data.isActive !== undefined ? data.isActive : true,
      loginAttempts: data.loginAttempts || 0,
      refreshTokens: data.refreshTokens || [],
      twoFactorEnabled: data.twoFactorEnabled || false,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      
      // Mock methods
      comparePassword: jest.fn().mockResolvedValue(true),
      generateAccessToken: jest.fn().mockReturnValue('mock-access-token'),
      generateRefreshToken: jest.fn().mockReturnValue('mock-refresh-token'),
      isLocked: jest.fn().mockReturnValue(data.lockUntil ? new Date(data.lockUntil) > new Date() : false),
      incLoginAttempts: jest.fn(),
      resetLoginAttempts: jest.fn(),
      
      // Additional properties to match IAdmin
      lastLogin: data.lastLogin,
      lockUntil: data.lockUntil,
      passwordChangedAt: data.passwordChangedAt,
      resetPasswordToken: data.resetPasswordToken,
      resetPasswordExpires: data.resetPasswordExpires,
      twoFactorSecret: data.twoFactorSecret,
      
      save: jest.fn(),
      updateOne: jest.fn()
    } as unknown as IAdmin;

    return mockAdmin;
  }

  reset(): void {
    this.admins = [];
    this.nextId = 1;
  }

  addMockAdmin(data: Partial<IAdmin>): IAdmin {
    const admin = this.createMockAdmin(data);
    this.admins.push(admin);
    return admin;
  }

  // 🔍 IAdminRepository Implementation
  async findById(id: string, includePassword?: boolean): Promise<IAdmin | null> {
    const admin = this.admins.find(a => a._id.toString() === id);
    
    if (admin && includePassword === false) {
      // Simulate password exclusion
      const { password, ...adminWithoutPassword } = admin as any;
      return adminWithoutPassword as IAdmin;
    }
    
    return admin || null;
  }

  async findByEmail(email: string, includePassword?: boolean): Promise<IAdmin | null> {
    const admin = this.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    
    if (admin && includePassword === false) {
      // Simulate password exclusion
      const { password, ...adminWithoutPassword } = admin as any;
      return adminWithoutPassword as IAdmin;
    }
    
    return admin || null;
  }

  async findMany(filters: FindAdminFilters, limit = 50, offset = 0): Promise<IAdmin[]> {
    let filtered = this.admins;

    if (filters.email) {
      const emailRegex = new RegExp(filters.email, 'i');
      filtered = filtered.filter(a => emailRegex.test(a.email));
    }

    if (filters.role) {
      filtered = filtered.filter(a => a.role === filters.role);
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(a => a.isActive === filters.isActive);
    }

    if (filters.isLocked) {
      filtered = filtered.filter(a => a.isLocked());
    }

    return filtered.slice(offset, offset + limit);
  }

  async count(filters?: FindAdminFilters): Promise<number> {
    const filtered = await this.findMany(filters || {}, 1000, 0);
    return filtered.length;
  }

  async create(data: CreateAdminData): Promise<IAdmin> {
    // Check for email conflicts
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new Error('Email já está em uso');
    }

    const admin = this.createMockAdmin({
      ...data,
      email: data.email.toLowerCase().trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.admins.push(admin);
    return admin;
  }

  async update(id: string, data: UpdateAdminData): Promise<IAdmin | null> {
    const index = this.admins.findIndex(a => a._id.toString() === id);
    if (index === -1) return null;

    const admin = this.admins[index];
    
    // Update fields
    Object.assign(admin, {
      ...data,
      updatedAt: new Date(),
      email: data.email ? data.email.toLowerCase().trim() : admin.email
    });

    return admin;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.admins.findIndex(a => a._id.toString() === id);
    if (index === -1) return false;

    this.admins.splice(index, 1);
    return true;
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    const admin = await this.findById(id);
    if (admin) {
      (admin as any).loginAttempts = ((admin as any).loginAttempts || 0) + 1;
      
      // Mock lock logic
      if ((admin as any).loginAttempts >= 5) {
        (admin as any).lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
      }
    }
  }

  async resetLoginAttempts(id: string): Promise<void> {
    const admin = await this.findById(id);
    if (admin) {
      (admin as any).loginAttempts = 0;
      delete (admin as any).lockUntil;
      (admin as any).lastLogin = new Date();
    }
  }

  async addRefreshToken(id: string, token: string): Promise<void> {
    const admin = await this.findById(id);
    if (admin) {
      admin.refreshTokens.push(token);
    }
  }

  async removeRefreshToken(id: string, token: string): Promise<void> {
    const admin = await this.findById(id);
    if (admin) {
      const index = admin.refreshTokens.indexOf(token);
      if (index > -1) {
        admin.refreshTokens.splice(index, 1);
      }
    }
  }

  async clearAllRefreshTokens(id: string): Promise<void> {
    const admin = await this.findById(id);
    if (admin) {
      admin.refreshTokens.length = 0;
    }
  }

  async findAdminsWithExpiredLocks(): Promise<IAdmin[]> {
    const now = new Date();
    return this.admins.filter(a => {
      const lockUntil = (a as any).lockUntil;
      return lockUntil && new Date(lockUntil) < now;
    });
  }

  async findActiveAdmins(): Promise<IAdmin[]> {
    return this.admins.filter(a => a.isActive);
  }

  async findAdminsByRole(role: 'admin' | 'super-admin'): Promise<IAdmin[]> {
    return this.admins.filter(a => a.role === role);
  }

  async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
    const admin = await this.findByEmail(email);
    if (!admin) return false;
    
    if (excludeId && admin._id.toString() === excludeId) {
      return false;
    }
    
    return true;
  }

  async getAdminStats(): Promise<{
    total: number;
    active: number;
    locked: number;
    byRole: { admin: number; superAdmin: number };
  }> {
    const now = new Date();
    
    return {
      total: this.admins.length,
      active: this.admins.filter(a => a.isActive).length,
      locked: this.admins.filter(a => {
        const lockUntil = (a as any).lockUntil;
        return lockUntil && new Date(lockUntil) > now;
      }).length,
      byRole: {
        admin: this.admins.filter(a => a.role === 'admin').length,
        superAdmin: this.admins.filter(a => a.role === 'super-admin').length
      }
    };
  }

  async cleanupExpiredTokens(): Promise<number> {
    const inactiveAdmins = this.admins.filter(a => !a.isActive);
    inactiveAdmins.forEach(a => a.refreshTokens.length = 0);
    return inactiveAdmins.length;
  }

  async unlockExpiredAccounts(): Promise<number> {
    const now = new Date();
    const expiredLocked = this.admins.filter(a => {
      const lockUntil = (a as any).lockUntil;
      return lockUntil && new Date(lockUntil) < now;
    });

    expiredLocked.forEach(a => {
      delete (a as any).lockUntil;
      (a as any).loginAttempts = 0;
    });

    return expiredLocked.length;
  }
}