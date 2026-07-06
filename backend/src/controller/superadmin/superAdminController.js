import bcrypt from 'bcryptjs';
import User from '../../model/User.js';

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, industryType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      industryType: industryType || 'store',
      role: 'admin',
      status: 'active',
    });

    return res.status(201).json({
      message: 'Admin account created successfully.',
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        industryType: newAdmin.industryType,
        role: newAdmin.role,
        status: newAdmin.status,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: 'An error occurred during admin creation.' });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    return res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return res.status(500).json({ error: 'An error occurred while fetching admins.' });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { name, phone, industryType } = req.body;
    const admin = await User.findOne({ _id: req.params.id, role: 'admin' });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    if (name !== undefined) admin.name = name;
    if (phone !== undefined) admin.phone = phone;
    if (industryType !== undefined) admin.industryType = industryType;

    const updatedAdmin = await admin.save();

    return res.status(200).json({
      message: 'Admin updated successfully.',
      user: {
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        industryType: updatedAdmin.industryType,
        role: updatedAdmin.role,
        status: updatedAdmin.status,
      },
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return res.status(500).json({ error: 'An error occurred during admin update.' });
  }
};

export const toggleAdminStatus = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: 'admin' });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    admin.status = admin.status === 'active' ? 'inactive' : 'active';
    await admin.save();

    return res.status(200).json({
      message: `Admin account has been ${admin.status}d successfully.`,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return res.status(500).json({ error: 'An error occurred while toggling admin status.' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findOneAndDelete({ _id: req.params.id, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    return res.status(200).json({
      message: 'Admin account deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ error: 'An error occurred during admin deletion.' });
  }
};
