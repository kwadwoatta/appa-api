import * as argon from 'argon2';
import 'dotenv/config';
import mongoose from 'mongoose';
import { UserModel } from 'src/user';

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);

    const hash = await argon.hash('password');
    // await UserModel.init();

    await UserModel.create([
      {
        email: 'customer@gmail.com',
        role: 'customer',
        hash,
        firstName: 'Prince',
        lastName: 'Ofori',
        address: 'JR4J+CQ Accra',
      },
      {
        email: 'driver@gmail.com',
        role: 'driver',
        hash,
        firstName: 'Koami',
        lastName: 'Ahondo',
      },
      {
        email: 'admin@gmail.com',
        role: 'admin',
        hash,
        firstName: 'Raphael',
        lastName: 'Dana',
      },
    ]);

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error({ error });
    mongoose.disconnect();
    process.exit(0);
  }
}

main();
