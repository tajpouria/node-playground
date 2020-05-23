import jwt from "jsonwebtoken";

const { PUBLIC_KEY = "secret" } = process.env;

export const generateJWTTokens = (
  user: { username: string; role: string },
  opt: { accessExp?: string; refreshExp?: string },
) => {
  const { accessExp = "30s", refreshExp = "1h" } = opt;

  const payload = { username: user.username, role: user.role };

  const accessToken = jwt.sign(payload, PUBLIC_KEY, { expiresIn: accessExp });
  const refreshToken = jwt.sign(payload, PUBLIC_KEY, { expiresIn: refreshExp });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, PUBLIC_KEY);
  } catch (error) {
    throw error;
  }
};
