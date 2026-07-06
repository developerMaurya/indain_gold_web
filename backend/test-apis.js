const BACKEND_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting API Verification Tests...');
  
  try {
    console.log('\n1. Logging in as Superadmin...');
    const loginRes = await fetch(`${BACKEND_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@gmail.com',
        password: 'mauryaji@1234'
      })
    });
    
    if (!loginRes.ok) {
      const err = await loginRes.json();
      throw new Error(`Login failed: ${err.error || loginRes.statusText}`);
    }
    
    const loginData = await loginRes.json();
    console.log('✅ Login successful!');
    console.log(`   User: ${loginData.user.name} (${loginData.user.role})`);
    const token = loginData.token;

    console.log('\n2. Creating a new Medical Admin...');
    const adminEmail = `admin-${Date.now()}@gmail.com`;
    const createAdminRes = await fetch(`${BACKEND_URL}/superadmin/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Approve Pharmacy',
        email: adminEmail,
        password: 'adminpassword123',
        phone: '9876543210',
        industryType: 'medical'
      })
    });

    if (!createAdminRes.ok) {
      const err = await createAdminRes.json();
      throw new Error(`Admin creation failed: ${err.error || createAdminRes.statusText}`);
    }

    const adminData = await createAdminRes.json();
    console.log('✅ Admin created successfully!');
    console.log(`   Business: ${adminData.user.name} | Sector: ${adminData.user.industryType}`);

    console.log('\n3. Fetching Admin Accounts Directory...');
    const listAdminsRes = await fetch(`${BACKEND_URL}/superadmin/admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!listAdminsRes.ok) {
      throw new Error('Failed to fetch admins list');
    }

    const adminsList = await listAdminsRes.json();
    console.log(`✅ Fetched directory. Total Admins: ${adminsList.length}`);

    console.log('\n🎉 All checks passed! The backend APIs are fully operational.');
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    console.error(error.message);
    console.error('Please ensure the backend server is running on port 5000 (npm start) before executing tests.');
  }
}

runTests();
