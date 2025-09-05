import { IAdmin } from '../models/Admin';

// 🏛️ Admin Repository Interface
// Implementa Dependency Inversion Principle
// Abstração para operações de dados de Admin - independente de implementação

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'super-admin';
  isActive?: boolean;
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'super-admin';
  isActive?: boolean;
  lastLogin?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  refreshTokens?: string[];
  passwordChangedAt?: Date;
  twoFactorEnabled?: boolean;
}

export interface FindAdminFilters {
  email?: string;
  role?: 'admin' | 'super-admin';
  isActive?: boolean;
  isLocked?: boolean;
}

export interface AdminRepositoryResult {
  success: boolean;
  data?: IAdmin | IAdmin[] | null;
  error?: string;
  count?: number;
}

// 🎯 Repository Interface - Define contratos sem implementação
export interface IAdminRepository {
  // 🔍 Query operations
  findById(id: string, includePassword?: boolean): Promise<IAdmin | null>;
  findByEmail(email: string, includePassword?: boolean): Promise<IAdmin | null>;
  findMany(filters: FindAdminFilters, limit?: number, offset?: number): Promise<IAdmin[]>;
  count(filters?: FindAdminFilters): Promise<number>;
  
  // 💾 Persistence operations
  create(data: CreateAdminData): Promise<IAdmin>;
  update(id: string, data: UpdateAdminData): Promise<IAdmin | null>;
  delete(id: string): Promise<boolean>;
  
  // 🔐 Authentication-specific operations
  incrementLoginAttempts(id: string): Promise<void>;
  resetLoginAttempts(id: string): Promise<void>;
  addRefreshToken(id: string, token: string): Promise<void>;
  removeRefreshToken(id: string, token: string): Promise<void>;
  clearAllRefreshTokens(id: string): Promise<void>;
  
  // 🔍 Specialized queries
  findAdminsWithExpiredLocks(): Promise<IAdmin[]>;
  findActiveAdmins(): Promise<IAdmin[]>;
  findAdminsByRole(role: 'admin' | 'super-admin'): Promise<IAdmin[]>;
  
  // 🎯 Business logic helpers
  isEmailTaken(email: string, excludeId?: string): Promise<boolean>;
  getAdminStats(): Promise<{
    total: number;
    active: number;
    locked: number;
    byRole: { admin: number; superAdmin: number };
  }>;
  
  // 🧹 Maintenance operations
  cleanupExpiredTokens(): Promise<number>; // Returns count of cleaned tokens
  unlockExpiredAccounts(): Promise<number>; // Returns count of unlocked accounts
}

// 🎭 Repository Factory Interface
export interface IRepositoryFactory {
  createAdminRepository(): IAdminRepository;
  // Futuramente: createUserRepository(), createQuoteRepository(), etc.
}