import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string, username: string) {
        const [users] = await this.usersService.find(username);

        if (users?.email && users?.username) {
            throw new BadRequestException('email in use');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        const result = salt + "." + hash.toString('hex');

        const user = this.usersService.create(email, username, result);

        return user;
        // See if email is in use
        // const [users] = await this.usersService.find(username);


        // if (users?.email && users?.username) {
        //     throw new BadRequestException('email in use');
        // }

        // const hashedPassword = await this.hashPassword(password);

        // const user = await this.usersService.create(email, username, hashedPassword);

        // return user;
    }

    async signin(username: string, password: string) {

        const [user] = await this.usersService.find(username);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        console.log(user);

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;
        console.log(storedHash);
        console.log(hash.toString('hex'));
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;

        // const [user] = await this.usersService.find(username);

        // console.log(user);

        // if (!user) {
        //     throw new NotFoundException('user not found');
        // }


        // const isPasswordValid = await this.comparePasswords(password, user.password);

        // console.log(isPasswordValid);

        // if (!isPasswordValid) {
        //     throw new BadRequestException('Invalid password');
        // }

        // return user; // Retorna o usuário se as credenciais forem válidass
    }
}


