import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '../config/config.service';
import { IUserDto } from '../user/interfaces/user.interface';
import { IAccountDto } from './account/interfaces/account.interface';
import { IToken, ITokenPayload } from './interfaces/auth.interface';
import { LoginHistoryDto } from './loginHistory/loginHistory.dto';
import { LoginHistoryService } from './loginHistory/loginHistory.service';
import { DefaultRoles } from './role/role.const';
import { Session } from './session.entity';

@Injectable()
export class AuthService {
  static jwtSecret: string = process.env.MAGISHIFT_JWT_SECRET || 'super-secret-jwt';

  constructor(
    @InjectRepository(Session) protected readonly sessionRepository: Repository<Session>,
    protected readonly loginHistoryService: LoginHistoryService,
  ) {}

  async validateNewPassword(newPass: string, confirmNewPass: string): Promise<string> {
    if (newPass !== confirmNewPass) {
      throw new HttpException(`Confirmation password doesn't match with password`, 400);
    }

    return this.encryptPassword(newPass);
  }

  async createNewSession(account: IAccountDto, userData: IUserDto): Promise<IToken> {
    // check if user already logged in
    const checkLoggedInUser = await this.sessionRepository.findOne({
      accountId: account.id,
    });

    // delete old session if account already logged in
    if (checkLoggedInUser) {
      await this.sessionRepository.delete({ accountId: account.id });
    }

    const sessionId = uuid();

    const token: IToken = await this.createToken(account, userData, sessionId, account.realm, [
      DefaultRoles.public,
      DefaultRoles.authenticated,
      account.realm,
      ...account.roles,
    ]);

    const session: DeepPartial<Session> = {
      id: sessionId,
      accountId: account.id,
      token: token.id,
      expireOn: token.ttl,
    };

    await this.sessionRepository.save(session);

    const loginHistory = new LoginHistoryDto({
      loginTime: new Date(),
      sessionId,
      account,
    });

    this.loginHistoryService.create(loginHistory);

    return token;
  }

  async logout(token: string): Promise<void> {
    const authHeader = token.split(' ');

    await this.sessionRepository.delete({
      token: authHeader[authHeader.length - 1],
    });
  }

  async encryptPassword(password: string): Promise<string> {
    if (!password) {
      throw new HttpException('encryptPassword: Parameter password is empty or invalid', 400);
    }

    const salt = await this.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    return hashedPass;
  }

  async comparePassword(plainPassword: string, hashedPass: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPass);
  }

  private async createToken(
    account: IAccountDto,
    userData: IUserDto,
    sessionId: string,
    realm: string,
    roles: string[],
  ): Promise<IToken> {
    const expiresIn = ConfigService.getConfig.jwtExpiresIn || '30d';
    const secretOrKey = AuthService.jwtSecret;

    delete account.password;
    delete account.createdBy;
    delete account.updatedBy;
    delete account.loginHistories;

    // cleanse unnecessary data
    const userDataPayload: IUserDto = {
      id: userData.id,
      accountId: account.id,
      username: userData.username,
      account: null,
      password: null,
      passwordConfirm: null,
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      photo: null,
      createdBy: null,
      updatedBy: null,
      isDeleted: null,
      isActive: null,
      realm: userData.realm,
      role: userData.role,
      validate: null,
      _dataStatus: null,
    };

    const token: ITokenPayload = {
      accountId: account.id,
      userData: userDataPayload,
      sessionId,
      realm,
      roles,
    };

    return {
      ttl: expiresIn,
      id: jwt.sign(token, secretOrKey, { expiresIn }),
    };
  }

  private async genSalt(saltRounds: number = 10): Promise<string> {
    return bcrypt.genSalt(saltRounds);
  }
}
