import axios from 'axios';

// Cache (replace with Redis later)
const cache = {};

// ---- PROVIDERS ----

// 1. Memory Cache
const fromCache = async (ifsc) => {
  if (cache[ifsc]) return { ...cache[ifsc], _provider: "cache" };
  throw "No cache";
};

// 2. Razorpay
const razorpay = async (ifsc) => {
  const res = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
  return { ...res.data, _provider: "razorpay" };
};

// 3. BankIFSC
const bankifsc = async (ifsc) => {
  const res = await axios.get(`https://api.bankifsc.com/${ifsc}`);
  return { ...res.data, _provider: "bankifsc" };
};

// 4. GitHub dataset
const githubData = async (ifsc) => {
  const res = await axios.get(`https://raw.githubusercontent.com/razorpay/ifsc/master/data/${ifsc}.json`);
  return { ...res.data, _provider: "github" };
};

// 5. Mock DB (replace with Mongo)
const dbLookup = async (ifsc) => {
  if (cache[ifsc]) return { ...cache[ifsc], _provider: "db" };
  throw "Not in DB";
};

// 6. Redis (mock)
const redisLookup = async (ifsc) => {
  throw "Redis not connected"; // replace later
};

// 7. Retry Razorpay
const retryRazorpay = async (ifsc) => {
  const res = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
  return { ...res.data, _provider: "retry_razorpay" };
};

// 8. Retry BankIFSC
const retryBankifsc = async (ifsc) => {
  const res = await axios.get(`https://api.bankifsc.com/${ifsc}`);
  return { ...res.data, _provider: "retry_bankifsc" };
};

// 9. Normalize IFSC (uppercase fix)
const normalized = async (ifsc) => {
  const clean = ifsc.trim().toUpperCase();
  const res = await axios.get(`https://ifsc.razorpay.com/${clean}`);
  return { ...res.data, _provider: "normalized" };
};

// 10. Manual fallback
const manual = async (ifsc) => {
  return {
    BANK: "UNKNOWN",
    IFSC: ifsc,
    BRANCH: "MANUAL ENTRY REQUIRED",
    _provider: "manual"
  };
};

// ---- PROVIDER CHAIN ----
const providers = [
  fromCache,
  dbLookup,
  redisLookup,
  razorpay,
  bankifsc,
  githubData,
  normalized,
  retryRazorpay,
  retryBankifsc,
  manual
];

// ---- FETCH FUNCTION ----
export const fetchIFSC = async (ifsc) => {
  for (let provider of providers) {
    try {
      const data = await provider(ifsc);      
      if (data) return data;
    } catch (err) {
      console.log(`❌ Failed: ${provider.name}`);
    }
  }
  throw new Error("All providers failed");
};
