import bcrypt from 'bcryptjs';
import User from '../model/User.js';

export const seedSuperAdmin = async () => {
  try {
    const email = 'superadmin@gmail.com';
    const existingSuperAdmin = await User.findOne({ email });

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash('mauryaji@1234', 10);
      await User.create({
        name: 'Super Admin',
        email: email,
        password: hashedPassword,
        role: 'superadmin',
      });
      console.log('Superadmin user seeded successfully.');
    } else {
      console.log('Superadmin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding superadmin user:', error);
  }
};
