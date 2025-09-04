import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing'; // ✅ pour NestJS
import * as request from 'supertest';

describe('POST /auth/login (e2e)', () => {
  let app: INestApplication;
  let usersRepo: Repository<User>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    usersRepo = moduleRef.get<Repository<User>>(getRepositoryToken(User));

    // Crée un utilisateur de test avec mot de passe hashé
    const password = 'Secret123!';
    const hash = await bcrypt.hash(password, 10);
    await usersRepo.save(
      usersRepo.create({
        email: 'jane.doe@example.com',
        passwordHash: hash,
        firstName: 'Jane',
        lastName: 'Doe',
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('renvoie 200 et un token si identifiants valides', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'jane.doe@example.com', password: 'Secret123!' })
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe('jane.doe@example.com');
  });

  it('renvoie 401 si mauvais mot de passe', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'jane.doe@example.com', password: 'WrongPassword!' })
      .expect(401);
  });
});
