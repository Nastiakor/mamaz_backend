import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

describe('UsersService.create (unit)', () => {
  let service: UsersService;

  let repoMock: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    repoMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    // Make hashing deterministic in tests
    jest
      .spyOn(bcrypt, 'genSalt')
      .mockImplementation(async () => '$2a$10$fixed.salt.fixed.salt.fi');

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repoMock },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hashes the password, checks email uniqueness, and saves the user', async () => {
    // ---------- Arrange ----------
    const dto = {
      email: 'jane.doe@example.com',
      password: 'Secret123!',
      firstName: 'Jane',
      lastName: 'Doe',
    };

    // No existing user with same email
    repoMock.findOne.mockResolvedValue(null);

    // Repository create returns an entity-like object
    repoMock.create.mockImplementation((payload) => ({ id: 1, ...payload }));
    // save returns the saved entity
    repoMock.save.mockImplementation(async (entity) => entity);

    // ---------- Act ----------
    const created = await service.createUser(dto as any);

    // ---------- Assert ----------
    // Repo should have been asked to check uniqueness
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { email: dto.email },
    });

    // The returned object should contain the email and a hashed password
    expect(created.email).toBe(dto.email);
    expect(created.passwordHash).toBeDefined();
    expect(created.passwordHash).not.toBe(dto.password);
    // Simple check for bcrypt format: starts with $2a/$2b/$2y
    expect(created.passwordHash).toMatch(/^\$2[aby]\$.{56}$/);

    // Repo should have created and saved the entity with the hashed password
    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalled();
  });

  it('throws ConflictException when email already exists', async () => {
    // ---------- Arrange ----------
    const dto = { email: 'dupe@example.com', password: 'Secret123!' };

    // Simulate "email already exists"
    repoMock.findOne.mockResolvedValue({ id: 42, email: dto.email });

    // ---------- Act & Assert ----------
    await expect(service.createUser(dto as any)).rejects.toBeInstanceOf(
      ConflictException,
    );

    // Assert that we do NOT call create/save when duplicate
    expect(repoMock.create).not.toHaveBeenCalled();
    expect(repoMock.save).not.toHaveBeenCalled();
  });
});
