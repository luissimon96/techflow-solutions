import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento User
export interface IUser extends Document {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do User
const UserSchema: Schema = new Schema(
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
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email deve ter um formato válido',
      ],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Nome da empresa deve ter no máximo 100 caracteres'],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[1-9][\d]{0,15}$/,
        'Telefone deve ter um formato válido',
      ],
    },
    subject: {
      type: String,
      required: [true, 'Assunto é obrigatório'],
      trim: true,
      maxlength: [200, 'Assunto deve ter no máximo 200 caracteres'],
    },
    message: {
      type: String,
      required: [true, 'Mensagem é obrigatória'],
      trim: true,
      maxlength: [2000, 'Mensagem deve ter no máximo 2000 caracteres'],
    },
    consent: {
      type: Boolean,
      required: [true, 'Consentimento é obrigatório'],
      validate: {
        validator: function (v: boolean) {
          return v === true;
        },
        message: 'Consentimento deve ser aceito',
      },
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    collection: 'user', // Nome específico da collection
  }
);

// Índices para performance
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// Modelo User
export const User = mongoose.model<IUser>('User', UserSchema); 