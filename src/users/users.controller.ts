import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize, SerializeInterceptor } from "src/interceptors/serialize.interceptors";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { SinginUserDto } from "./dtos/signin-user.dto";

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) { }

    @Post('/signup')
    @Serialize(UserDto)
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body.email, body.password, body.username );
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

    @Post('/signin')
    @Serialize(UserDto)
    signin(@Body() body: SinginUserDto) {
        return this.authService.signin(body.username, body.password);
    }
};