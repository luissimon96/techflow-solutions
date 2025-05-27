import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interface para o documento Admin
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  refreshTokens: string[];
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Métodos
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  isLocked(): boolean;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

// Schema do Admin
const AdminSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email deve ter um formato válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [8, 'Senha deve ter no mínimo 8 caracteres'],
      select: false, // Não incluir por padrão nas consultas
    },
    role: {
      type: String,
      enum: ['admin', 'super-admin'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    refreshTokens: [{
      type: String,
    }],
    passwordChangedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'admins',
  }
);

// Índices para performance e segurança
AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ resetPasswordToken: 1 });
AdminSchema.index({ lockUntil: 1 });

// Constantes para controle de tentativas de login
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 horas

// Removido virtual isLocked para evitar conflito com método

// Middleware para hash da senha antes de salvar
AdminSchema.pre('save', async function (next) {
  const admin = this as IAdmin;

  // Só hash a senha se ela foi modificada
  if (!admin.isModified('password')) return next();

  try {
    // Hash da senha com salt rounds 12
    const salt = await bcrypt.genSalt(12);
    admin.password = await bcrypt.hash(admin.password, salt);

    // Atualizar passwordChangedAt
    admin.passwordChangedAt = new Date();

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senhas
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const admin = this as IAdmin;
  return bcrypt.compare(candidatePassword, admin.password);
};

// Método para gerar access token
AdminSchema.methods.generateAccessToken = function (): string {
  const admin = this as IAdmin;
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';

  return jwt.sign(
    {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role
    },
    secret,
    { expiresIn: '15m' }
  );
};

// Método para gerar refresh token
AdminSchema.methods.generateRefreshToken = function (): string {
  const admin = this as IAdmin;
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';

  return jwt.sign(
    {
      id: admin._id.toString(),
      type: 'refresh'
    },
    refreshSecret,
    { expiresIn: '7d' }
  );
};

// Método para verificar se a conta está bloqueada
AdminSchema.methods.isLocked = function (): boolean {
  const admin = this as IAdmin;
  return !!(admin.lockUntil && admin.lockUntil > new Date());
};

// Método para incrementar tentativas de login
AdminSchema.methods.incLoginAttempts = async function (): Promise<void> {
  const admin = this as IAdmin;

  // Se já passou do tempo de bloqueio, resetar
  if (admin.lockUntil && admin.lockUntil < new Date()) {
    return admin.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };

  // Se atingiu o máximo de tentativas e não está bloqueado, bloquear
  if (admin.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !admin.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }

  return admin.updateOne(updates);
};

// Método para resetar tentativas de login
AdminSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  const admin = this as IAdmin;
  return admin.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Modelo Admin
export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema); 