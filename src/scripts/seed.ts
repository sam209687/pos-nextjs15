// scripts/seed.ts
import dbConnect from '../lib/db';
import { createUser } from '../lib/auth/auth';

async function seed() {
  await dbConnect();

  await createUser('admin@abc.com', 'admin123', 'admin');
  await createUser('cashier@abc.mail.com', 'cashier123', 'cashier');

  console.log('Users seeded successfully');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});