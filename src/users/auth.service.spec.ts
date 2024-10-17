import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './users.entity'

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const fakeUsersService: Partial<UsersService> = {
            find: () => Promise.resolve([]),
            create: (email: string, username: string, password: string) => Promise.resolve({ id: 1, email, username, password } as User)
        }

        const module = await Test.createTestingModule({
            providers: [AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()

        service = module.get(AuthService);
    })
    it('can create an instance of auth service', async () => {

        expect(service).toBeDefined();
    });

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signup('asdfasd@email.com', "asdfadfaf", "adfafaf")

        expect(user.password).not.toEqual('asdfadfaf')
        const [salt, hash] = user.password.split('.');

        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

})