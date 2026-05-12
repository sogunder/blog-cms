import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '../common/enums';
import { hashUserPassword } from '../users/users.crypto';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Persona, PersonaDocument } from '../personas/schema/persona.schema';
import { removeSeededDocuments } from './seed-shared';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const personaModel = app.get<Model<PersonaDocument>>(getModelToken(Persona.name));

  try {
    console.log('Eliminando datos de seed masivo anterior (prefijos __seed_*)...');
    const removed = await removeSeededDocuments(userModel, personaModel);
    console.log(
      `  usuarios borrados: ${removed.usersDeleted}, personas borradas: ${removed.personasDeleted}`,
    );

    const legacyRole = await userModel.updateMany(
      { role: { $exists: false } },
      { $set: { role: UserRole.User } },
    );
    if (legacyRole.modifiedCount > 0) {
      console.log(`  usuarios sin rol actualizados a USER: ${legacyRole.modifiedCount}`);
    }

    const hash1234 = await hashUserPassword('1234');
    const hashVicente = await hashUserPassword('vicente');
    for (const { name, role, passwordHash } of [
      { name: 'admin', role: UserRole.Admin, passwordHash: hash1234 },
      { name: 'user', role: UserRole.User, passwordHash: hash1234 },
      { name: 'vicente', role: UserRole.Admin, passwordHash: hashVicente },
    ] as const) {
      await userModel.findOneAndUpdate(
        { username: name },
        {
          username: name,
          passwordHash,
          role,
          lastAccess: null,
        },
        { upsert: true, returnDocument: 'after' },
      );
    }
    console.log(
      'Usuarios demo: admin/1234 (admin), user/1234 (user), vicente/vicente (admin)',
    );

    console.log('Seed completado.');
  } finally {
    await app.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
