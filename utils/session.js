const crypto = require("crypto");

const generateSessionId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(3); 

  let randomPart = "";
  for (let i = 0; i < 3; i++) {
    randomPart += chars[bytes[i] % chars.length];
  }

  return `SESSION_${randomPart}`; 
};

module.exports = generateSessionId;
