import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {

   constructor(@InjectRepository(User) private repo: Repository<User>) { }

    create(email: string, username: string, password: string) {
        const user = this.repo.create({ email, username, password })

        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }

    find(username: string) {
        return this.repo.find({ where: { username } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id)

        if(!user) {
            throw new Error(`User not found`);
        }

        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id)

        if (!user) {
            throw new Error(`User not found`);
        }        

        return this.repo.remove(user);
    }


}
