import { JwtService } from '@nestjs/jwt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../features/user/user.service';
import { LoginUserDto } from './dto/auth-mutation.dto';
import { LoginResponseDto } from './dto/login-response';
import { User } from 'src/route/features/user/entities/user.entity';
import { CreateUserDto } from '../features/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByName(username);
    const valid = await bcrypt.compare(password, user?.password);
    if (user && valid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  async handleVerifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token); // this.configService.get('SECRETKEY')
      return payload['sub'];
    } catch (e) {
      throw new HttpException(
        {
          key: '',
          data: {},
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(body: LoginUserDto): Promise<LoginResponseDto> {
    const valid = await this.validateUser(body.username, body.password);
    if (!valid) {
      throw new UnauthorizedException();
    }
    const result = valid;
    return {
      access_token: this.jwtService.sign({
        username: result.username,
        sub: result.id,
        role: result.role,
      }),
      user: result,
      expiresIn: process.env.EXPIRESIN,
    };
  }

  async signup(body: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(body.password, 10);
    return this.userService.createUser({ ...body, password });
  }
}
