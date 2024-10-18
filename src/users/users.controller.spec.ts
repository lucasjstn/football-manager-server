import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
          username: 'asdf',
        } as User);
      },
      find: (username: string) => {
        return Promise.resolve([
          { id: 1, email: 'asdf@asdf.com', password: 'asdf', username } as User,
        ]);
      },
      //   remove: () => {},
      //   update: () => {},
    };
    fakeAuthService = {
      //   signup: () => {},
      signin: (username: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email: 'asdf@asdf.com',
          username,
          password,
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('username');

    expect(users.length).toEqual(1);
    expect(users[0].username).toEqual('username');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () =>
      Promise.reject(new Error('User not found'));

    await expect(controller.findUser('1')).rejects.toThrow('User not found');
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      { username: 'username', password: 'password' },
      session,
    );

    console.log(user);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
