import { createFileRoute, redirect } from "@tanstack/react-router";
import { Page } from "~modules/user/me/page";

export const Route = createFileRoute("/me")({
  beforeLoad: ({ context, location }) => {
    if (!context.hasToken) {
      const url = new URL(window.location.href);
      url.pathname = location.pathname;

      throw redirect({
        to: "/",
        search: { signIn: "true", redirect: url.toString() },
      });
    }
  },
  component: Page,
});
