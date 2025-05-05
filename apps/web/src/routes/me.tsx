import { createFileRoute } from "@tanstack/react-router";
import { Page } from "~modules/user/me/page";

export const Route = createFileRoute("/me")({
  component: Page,
});
