import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { config } from "../common/config.js";
import { UserModule } from "../user/user.module.js";
import { AuthenticationController } from "./authentication/authentication.controller.js";
import { AuthenticationService } from "./authentication/authentication.service.js";
import { GoogleStrategy } from "./authentication/google.strategy.js";
import { JwtStrategy } from "./authentication/jwt.strategy.js";
import { CredentialService } from "./credential/credential.service.js";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: config.auth.jwtSecret }),

    forwardRef(() => UserModule),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, GoogleStrategy, CredentialService],
  exports: [AuthenticationService, JwtModule],
})
export class AuthModule {}
