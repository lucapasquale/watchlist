import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { config } from "../../config.js";

import { AuthenticationController } from "./authentication/authentication.controller.js";
import { AuthenticationService } from "./authentication/authentication.service.js";
import { GoogleStrategy } from "./authentication/google.strategy.js";
import { JwtStrategy } from "./authentication/jwt.strategy.js";
import { CredentialService } from "./credential/credential.service.js";
import { MeResolver } from "./user/me.resolver.js";
import { UserResolver } from "./user/user.resolver.js";
import { UserService } from "./user/user.service.js";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.auth.jwtSecret,
      signOptions: { expiresIn: "3h" },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    GoogleStrategy,
    CredentialService,
    UserService,
    MeResolver,
    UserResolver,
  ],
  exports: [AuthenticationService, UserService],
})
export class AuthModule {}
