import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt'

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    private readonly saltRounds = 10; // Definindo o custo do bcrypt

    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string, username: string) {
        // See if email is in use
        const [users] = await this.usersService.find(username);

        console.log(users.email, users.username);

        if (users.email && users.username) {
            throw new BadRequestException('email in use');
        }

        const hashedPassword = await this.hashPassword(password);

        const user = await this.usersService.create(email, username, hashedPassword);

        return user;
    }

    async signin(username: string, password: string) {
        const [user] = await this.usersService.find(username);

        console.log(user);

        if (!user) {
            throw new NotFoundException('user not found');
        }


        const isPasswordValid = await this.comparePasswords(password, user.password);

        console.log(isPasswordValid);

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        return user; // Retorna o usuário se as credenciais forem válidass
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    private async comparePasswords(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

}


