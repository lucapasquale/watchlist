import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "../user/user.module.js";

import { jwtConstants } from "./auth.constants.js";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./local.strategy.js";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
