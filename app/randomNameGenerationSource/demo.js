const crypto = require("crypto");
const nameGenerator = require("./nameGenerator");

for (let i = 0; i < 1e2; i++) {
  const buf = crypto.randomBytes(20);
  const address = buf.toString("hex");
  const name = nameGenerator(address);
  console.log(`${address} -> ${name}`);
}
