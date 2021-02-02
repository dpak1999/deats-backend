import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return [false, 'There is user with that email'];
      }
      await this.users.save(this.users.create({ email, password, role }));
      return [true];
    } catch (error) {
      return [false, 'Uh Oh! Something went wrong'];
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'No such user find',
        };
      }
      const correctPassword = await user.checkPassword(password);
      if (!correctPassword) {
        return {
          ok: false,
          error: 'Wrong credentials',
        };
      }
      const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
