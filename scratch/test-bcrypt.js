const bcrypt = require('bcryptjs');

const passwords = ["admin@thpt2025", "student123"];
const hashes = [
  "$2a$10$fV1h... (some hash from DB if I could see it)"
]; // I can't see the hashes easily without a tool

async function test() {
  const hash = await bcrypt.hash("admin@thpt2025", 10);
  console.log("Hash for admin@thpt2025:", hash);
  const match = await bcrypt.compare("admin@thpt2025", hash);
  console.log("Match:", match);
}

test();
