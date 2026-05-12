import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Persona, PersonaDocument } from '../personas/schema/persona.schema';
import { removeSeededDocuments } from './seed-shared';

async function dropSeedData() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const personaModel = app.get<Model<PersonaDocument>>(getModelToken(Persona.name));

  try {
    console.log('Eliminando documentos creados por el seeder (prefijos __seed_*)...');
    const removed = await removeSeededDocuments(userModel, personaModel);
    console.log(
      `Hecho: ${removed.usersDeleted} usuarios y ${removed.personasDeleted} personas eliminados.`,
    );
  } finally {
    await app.close();
  }
}

dropSeedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
