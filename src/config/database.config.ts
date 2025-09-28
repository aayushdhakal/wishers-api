import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'mysql://username:password@localhost:3306/wishin',
}));
