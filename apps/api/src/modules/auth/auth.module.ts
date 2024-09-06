import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { config } from "../../config.js";
import { UserModule } from "../user/user.module.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { CredentialService } from "./credential.service.js";
import { GoogleStrategy } from "./google.strategy.js";
import { JwtStrategy } from "./jwt.strategy.js";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: config.auth.jwtSecret,
      signOptions: { expiresIn: "3h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CredentialService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
