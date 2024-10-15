import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize  } from "src/interceptors/serialize.interceptors";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { SinginUserDto } from "./dtos/signin-user.dto";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./users.entity";

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) { }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId);
    // }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password, body.username);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: SinginUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.username, body.password);
        session.userId = user.id;
        return user;
    }

    @Serialize(UserDto)
    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);

    }
};