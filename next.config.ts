require('dotenv').config();  // برای بارگذاری متغیرهای محیطی

module.exports = {
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
};
