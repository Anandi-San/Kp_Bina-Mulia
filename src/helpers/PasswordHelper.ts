import argon2 from "argon2";

const PasswordHashing = async (password: string): Promise<string> => {
  const result = await argon2.hash(password);
  return result;
};

const PasswordCompare = async (password: string, passwordHash: string): Promise<boolean> => {
  const matched = await argon2.verify(passwordHash, password);

  return matched;
};

export default { PasswordHashing, PasswordCompare };
