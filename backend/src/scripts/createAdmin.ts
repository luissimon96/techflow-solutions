import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from '../models/Admin';

// Configurar variáveis de ambiente
dotenv.config();

async function createAdmin() {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI não encontrada nas variáveis de ambiente');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Dados do admin padrão
    const adminData = {
      name: process.env.DEFAULT_ADMIN_NAME || 'Admin TechFlow',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@techflow.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'TechFlow@2025',
      role: 'super-admin' as const,
      isActive: true
    };

    // Verificar se já existe um admin com este email
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log(`⚠️  Admin com email ${adminData.email} já existe`);
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Nome: ${existingAdmin.name}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      console.log(`✅ Ativo: ${existingAdmin.isActive}`);
      return;
    }

    // Criar novo admin
    const admin = new Admin(adminData);
    await admin.save();

    console.log('🎉 Admin criado com sucesso!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Nome: ${admin.name}`);
    console.log(`🔑 Role: ${admin.role}`);
    console.log(`🆔 ID: ${admin._id}`);
    console.log(`📅 Criado em: ${admin.createdAt}`);

    console.log('\n🔐 Credenciais de acesso:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Senha: ${adminData.password}`);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Conexão MongoDB encerrada');
    process.exit(0);
  }
}

// Executar script
createAdmin(); 