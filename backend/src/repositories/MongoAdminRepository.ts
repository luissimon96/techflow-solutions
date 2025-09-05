import { Admin, IAdmin } from '../models/Admin';
import { log } from '../lib/logger';
import {
  IAdminRepository,
  CreateAdminData,
  UpdateAdminData,
  FindAdminFilters,
} from './IAdminRepository';

// 🗄️ MongoDB Admin Repository Implementation
// Implementa IAdminRepository usando Mongoose/MongoDB
// Segue Repository Pattern para abstração de dados

export class MongoAdminRepository implements IAdminRepository {
  
  // 🔍 Query operations
  async findById(id: string, includePassword: boolean = false): Promise<IAdmin | null> {
    try {
      const query = Admin.findById(id);
      if (includePassword) {
        query.select('+password');
      }
      
      const admin = await query.exec();
      
      log.debug('Admin findById executed', {
        id,
        found: !!admin,
        includePassword
      });
      
      return admin;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in findById', { id, error: errorMessage });
      throw new Error(`Failed to find admin by ID: ${errorMessage}`);
    }
  }

  async findByEmail(email: string, includePassword: boolean = false): Promise<IAdmin | null> {
    try {
      const query = Admin.findOne({ email: email.toLowerCase().trim() });
      if (includePassword) {
        query.select('+password');
      }
      
      const admin = await query.exec();
      
      log.debug('Admin findByEmail executed', {
        email,
        found: !!admin,
        includePassword
      });
      
      return admin;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in findByEmail', { email, error: errorMessage });
      throw new Error(`Failed to find admin by email: ${errorMessage}`);
    }
  }

  async findMany(
    filters: FindAdminFilters, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<IAdmin[]> {
    try {
      const mongoFilters: any = {};
      
      if (filters.email) {
        mongoFilters.email = new RegExp(filters.email, 'i');
      }
      
      if (filters.role) {
        mongoFilters.role = filters.role;
      }
      
      if (filters.isActive !== undefined) {
        mongoFilters.isActive = filters.isActive;
      }
      
      if (filters.isLocked) {
        mongoFilters.lockUntil = { $gt: new Date() };
      }

      const admins = await Admin
        .find(mongoFilters)
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 })
        .exec();

      log.debug('Admin findMany executed', {
        filters,
        count: admins.length,
        limit,
        offset
      });

      return admins;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in findMany', { filters, error: errorMessage });
      throw new Error(`Failed to find admins: ${errorMessage}`);
    }
  }

  async count(filters?: FindAdminFilters): Promise<number> {
    try {
      const mongoFilters: any = {};
      
      if (filters?.email) {
        mongoFilters.email = new RegExp(filters.email, 'i');
      }
      
      if (filters?.role) {
        mongoFilters.role = filters.role;
      }
      
      if (filters?.isActive !== undefined) {
        mongoFilters.isActive = filters.isActive;
      }

      const count = await Admin.countDocuments(mongoFilters).exec();
      
      log.debug('Admin count executed', { filters, count });
      
      return count;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in count', { filters, error: errorMessage });
      throw new Error(`Failed to count admins: ${errorMessage}`);
    }
  }

  // 💾 Persistence operations
  async create(data: CreateAdminData): Promise<IAdmin> {
    try {
      const adminData = {
        ...data,
        email: data.email.toLowerCase().trim(),
        role: data.role || 'admin',
        isActive: data.isActive !== undefined ? data.isActive : true
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      log.info('Admin created successfully', {
        id: savedAdmin._id.toString(),
        email: savedAdmin.email,
        role: savedAdmin.role
      });

      return savedAdmin;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in create', { email: data.email, error: errorMessage });
      
      if (errorMessage.includes('duplicate key') || errorMessage.includes('E11000')) {
        throw new Error('Email já está em uso');
      }
      
      throw new Error(`Failed to create admin: ${errorMessage}`);
    }
  }

  async update(id: string, data: UpdateAdminData): Promise<IAdmin | null> {
    try {
      const updateData = { ...data };
      
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase().trim();
      }

      const admin = await Admin.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();

      if (admin) {
        log.info('Admin updated successfully', {
          id: admin._id.toString(),
          email: admin.email,
          updatedFields: Object.keys(data)
        });
      }

      return admin;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in update', { id, error: errorMessage });
      throw new Error(`Failed to update admin: ${errorMessage}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await Admin.findByIdAndDelete(id).exec();
      
      if (result) {
        log.info('Admin deleted successfully', {
          id: result._id.toString(),
          email: result.email
        });
      }

      return !!result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in delete', { id, error: errorMessage });
      throw new Error(`Failed to delete admin: ${errorMessage}`);
    }
  }

  // 🔐 Authentication-specific operations
  async incrementLoginAttempts(id: string): Promise<void> {
    try {
      const admin = await Admin.findById(id);
      if (admin) {
        await admin.incLoginAttempts();
        log.debug('Login attempts incremented', { id, email: admin.email });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in incrementLoginAttempts', { id, error: errorMessage });
      throw new Error(`Failed to increment login attempts: ${errorMessage}`);
    }
  }

  async resetLoginAttempts(id: string): Promise<void> {
    try {
      const admin = await Admin.findById(id);
      if (admin) {
        await admin.resetLoginAttempts();
        log.debug('Login attempts reset', { id, email: admin.email });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in resetLoginAttempts', { id, error: errorMessage });
      throw new Error(`Failed to reset login attempts: ${errorMessage}`);
    }
  }

  async addRefreshToken(id: string, token: string): Promise<void> {
    try {
      await Admin.findByIdAndUpdate(
        id,
        { $push: { refreshTokens: token } }
      ).exec();
      
      log.debug('Refresh token added', { id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in addRefreshToken', { id, error: errorMessage });
      throw new Error(`Failed to add refresh token: ${errorMessage}`);
    }
  }

  async removeRefreshToken(id: string, token: string): Promise<void> {
    try {
      await Admin.findByIdAndUpdate(
        id,
        { $pull: { refreshTokens: token } }
      ).exec();
      
      log.debug('Refresh token removed', { id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in removeRefreshToken', { id, error: errorMessage });
      throw new Error(`Failed to remove refresh token: ${errorMessage}`);
    }
  }

  async clearAllRefreshTokens(id: string): Promise<void> {
    try {
      await Admin.findByIdAndUpdate(
        id,
        { $set: { refreshTokens: [] } }
      ).exec();
      
      log.debug('All refresh tokens cleared', { id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in clearAllRefreshTokens', { id, error: errorMessage });
      throw new Error(`Failed to clear refresh tokens: ${errorMessage}`);
    }
  }

  // 🔍 Specialized queries
  async findAdminsWithExpiredLocks(): Promise<IAdmin[]> {
    try {
      const admins = await Admin.find({
        lockUntil: { $lt: new Date() }
      }).exec();

      log.debug('Found admins with expired locks', { count: admins.length });
      
      return admins;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in findAdminsWithExpiredLocks', { error: errorMessage });
      throw new Error(`Failed to find admins with expired locks: ${errorMessage}`);
    }
  }

  async findActiveAdmins(): Promise<IAdmin[]> {
    try {
      const admins = await Admin.find({ isActive: true }).exec();
      
      log.debug('Found active admins', { count: admins.length });
      
      return admins;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in findActiveAdmins', { error: errorMessage });
      throw new Error(`Failed to find active admins: ${errorMessage}`);
    }
  }

  async findAdminsByRole(role: 'admin' | 'super-admin'): Promise<IAdmin[]> {
    try {
      const admins = await Admin.find({ role }).exec();
      
      log.debug('Found admins by role', { role, count: admins.length });
      
      return admins;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in findAdminsByRole', { role, error: errorMessage });
      throw new Error(`Failed to find admins by role: ${errorMessage}`);
    }
  }

  // 🎯 Business logic helpers
  async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
    try {
      const query: any = { email: email.toLowerCase().trim() };
      
      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const count = await Admin.countDocuments(query).exec();
      
      return count > 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in isEmailTaken', { email, error: errorMessage });
      throw new Error(`Failed to check email availability: ${errorMessage}`);
    }
  }

  async getAdminStats(): Promise<{
    total: number;
    active: number;
    locked: number;
    byRole: { admin: number; superAdmin: number };
  }> {
    try {
      const [
        total,
        active,
        locked,
        adminCount,
        superAdminCount
      ] = await Promise.all([
        Admin.countDocuments().exec(),
        Admin.countDocuments({ isActive: true }).exec(),
        Admin.countDocuments({ lockUntil: { $gt: new Date() } }).exec(),
        Admin.countDocuments({ role: 'admin' }).exec(),
        Admin.countDocuments({ role: 'super-admin' }).exec()
      ]);

      const stats = {
        total,
        active,
        locked,
        byRole: {
          admin: adminCount,
          superAdmin: superAdminCount
        }
      };

      log.debug('Admin stats calculated', stats);

      return stats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in getAdminStats', { error: errorMessage });
      throw new Error(`Failed to get admin stats: ${errorMessage}`);
    }
  }

  // 🧹 Maintenance operations
  async cleanupExpiredTokens(): Promise<number> {
    try {
      // Esta operação seria mais complexa em produção
      // Por ora, apenas limpamos tokens de contas inativas
      const result = await Admin.updateMany(
        { isActive: false },
        { $set: { refreshTokens: [] } }
      ).exec();

      log.info('Expired tokens cleaned up', { 
        modifiedCount: result.modifiedCount 
      });

      return result.modifiedCount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in cleanupExpiredTokens', { error: errorMessage });
      throw new Error(`Failed to cleanup expired tokens: ${errorMessage}`);
    }
  }

  async unlockExpiredAccounts(): Promise<number> {
    try {
      const result = await Admin.updateMany(
        { lockUntil: { $lt: new Date() } },
        { 
          $unset: { lockUntil: 1 },
          $set: { loginAttempts: 0 }
        }
      ).exec();

      log.info('Expired account locks removed', { 
        modifiedCount: result.modifiedCount 
      });

      return result.modifiedCount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Error in unlockExpiredAccounts', { error: errorMessage });
      throw new Error(`Failed to unlock expired accounts: ${errorMessage}`);
    }
  }
}