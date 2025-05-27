import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from '../models/Admin';

// Configurar variáveis de ambiente
dotenv.config();

async function createTestAdmin() {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techflow';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Remover admin existente se houver
    await Admin.deleteOne({ email: 'test@techflow.com' });

    // Dados do admin de teste
    const adminData = {
      name: 'Test Admin',
      email: 'test@techflow.com',
      password: 'test123456',
      role: 'super-admin' as const,
      isActive: true
    };

    // Criar novo admin
    const admin = new Admin(adminData);
    await admin.save();

    console.log('🎉 Admin de teste criado com sucesso!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Nome: ${admin.name}`);
    console.log(`🔑 Senha: test123456`);

    // Testar comparação de senha
    const isValid = await admin.comparePassword('test123456');
    console.log(`🔍 Teste de senha: ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);

  } catch (error) {
    console.error('❌ Erro ao criar admin de teste:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Conexão MongoDB encerrada');
    process.exit(0);
  }
}

// Executar script
createTestAdmin(); 