import Customer from '../../model/Customer.js';

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, city, state, country, gstNumber, pincode } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' });
    }

    const existingCustomer = await Customer.findOne({ phone: phone.trim() });
    if (existingCustomer) {
      return res.status(400).json({ error: 'A customer with this phone number already exists.' });
    }

    const newCustomer = await Customer.create({
      name,
      phone: phone.trim(),
      email: email ? email.toLowerCase().trim() : undefined,
      address,
      city,
      state,
      country,
      gstNumber,
      pincode,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: 'Customer registered successfully.',
      customer: newCustomer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json({ error: 'An error occurred while registering customer.' });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query).sort({ name: 1 });
    return res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ error: 'An error occurred while fetching customers.' });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    return res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the customer.' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, city, state, country, gstNumber, pincode } = req.body;
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    if (phone && phone !== customer.phone) {
      const existingCustomer = await Customer.findOne({ phone: phone.trim() });
      if (existingCustomer) {
        return res.status(400).json({ error: 'A customer with this phone number already exists.' });
      }
      customer.phone = phone.trim();
    }

    if (name !== undefined) customer.name = name;
    if (email !== undefined) customer.email = email.toLowerCase().trim();
    if (address !== undefined) customer.address = address;
    if (city !== undefined) customer.city = city;
    if (state !== undefined) customer.state = state;
    if (country !== undefined) customer.country = country;
    if (gstNumber !== undefined) customer.gstNumber = gstNumber;
    if (pincode !== undefined) customer.pincode = pincode;

    const updatedCustomer = await customer.save();

    return res.status(200).json({
      message: 'Customer updated successfully.',
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json({ error: 'An error occurred during customer update.' });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    return res.status(200).json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return res.status(500).json({ error: 'An error occurred while deleting customer.' });
  }
};
