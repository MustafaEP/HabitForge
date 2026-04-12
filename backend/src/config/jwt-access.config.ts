import { registerAs } from "@nestjs/config";

export default registerAs('jwtAccess', () => ({
  secret: process.env.JWT_ACCESS_SECRET,
  expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
}));

