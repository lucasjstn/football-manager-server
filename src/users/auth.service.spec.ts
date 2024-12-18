import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // Create a fake copy of the users service
    fakeUsersService = {
      find: (username: string) => {
        const filteredUsers = users.filter(
          (user) => user.username === username,
        );
        console.log('filter', filteredUsers, this);

        return Promise.resolve(filteredUsers);
      },
      create: (email: string, username: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          username,
          password,
        } as User;
        // console.log(user)
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup(
      'asdfasd@email.com',
      'asdfadfaf',
      'adfafaf',
    );

    expect(user.password).not.toEqual('asdfadfaf');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'asdf@asdf.com',
          password: '12345678',
          username: 'username',
        },
      ]);

    await expect(
      service.signup('asdf@asdf.com', '12345678', 'username'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('username', '')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'asdf@asdf.com',
          username: 'username',
          password: '12345678',
        },
      ]);

    await expect(service.signin('asdf@asdf.com', '1234567'));
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () => Promise.resolve([{
    //     id: 1,
    //     email: 'email@email.com',
    //     username: 'username',
    //     password: '2fe13452b5533f8b.48778eb4c88273265ea76b005b8a44a21b97ec79c10c6a6e54a24bdd6d516fa3'
    // } as User]);

    // await service.signup('asdf@asdf.com', 'username', 'mypassword');

    // const user = await service.signin('username', 'mypassword');

    // expect(user).toBeDefined();
    // const user = await service.signup('email@email.com', 'username', 'mypassword')
    // console.log(user);
    await service.signup('asdf@asdf.com', 'mypassword', 'username');

    const user = await service.signin('username', 'mypassword');
    expect(user).toBeDefined();
  });
});
