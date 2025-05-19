import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

import { config } from "../../common/config.js";
import { UserService } from "../../user/user.service.js";
import { CredentialService } from "../credential/credential.service.js";

type Profile = {
  id: string;
  provider: "google";
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private userService: UserService,
    private credentialService: CredentialService,
  ) {
    super({
      clientID: config.auth.google.clientID,
      clientSecret: config.auth.google.clientSecret,
      callbackURL: config.serverUrl + "/auth/google-redirect",
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const credential = await this.credentialService.findByProviderAndSubject("google", profile.id);
    if (credential) {
      const user = await this.userService.getById(credential.userId);
      done(null, user);
      return;
    }

    const newUser = await this.userService.create({
      email: profile.emails[0]!.value,
      name: profile.displayName,
      profilePictureUrl: profile.photos[0]?.value,
    });

    await this.credentialService.create({
      provider: "google",
      subject: profile.id,
      userId: newUser.id,
    });

    done(null, newUser);
  }
}
