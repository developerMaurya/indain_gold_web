import dotenv from 'dotenv';
import os from 'os';
import app from './src/app.js';
import { connectDB } from './src/db/connection.js';
import { seedSuperAdmin } from './src/db/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

async function startServer() {
  try {
    await connectDB();

    await seedSuperAdmin();

    app.listen(PORT, () => {
      const localIp = getLocalIpAddress();
      console.log('--------------------------------------------------');
      console.log(`🚀 Billing Software API Server is running!`);
      console.log(`   - Local URL:        http://localhost:${PORT}`);
      console.log(`   - Network URL:      http://${localIp}:${PORT}`);
      console.log('--------------------------------------------------');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
