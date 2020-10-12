import bcrypt from "bcrypt";

export default async function checkPassword(password, hash) {
  const passwordHash = await bcrypt.compare(password, hash);
  return passwordHash;
}
