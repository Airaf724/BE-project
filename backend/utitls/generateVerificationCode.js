import jwt from "jsonwebtoken";
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateTokenAndSetcookies = (res, userId) => {
  const secret = process.env.JWT_SECRET || "yourFallbackSecret";
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax", // better for local dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
