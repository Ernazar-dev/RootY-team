import type { ComponentType } from "react";
import type { Locale } from "@/shared/i18n/config";
import type { WidgetId } from "@/frontend/lessons/types";
import { CipherLab } from "@/frontend/widgets/cipher-lab";
import { FlagHunt } from "@/frontend/widgets/flag-hunt";
import { HttpExchange } from "@/frontend/widgets/http-exchange";
import { LinuxTerminal } from "@/frontend/widgets/linux-terminal";
import { PasswordMeter } from "@/frontend/widgets/password-meter";
import { RequestJourney } from "@/frontend/widgets/request-journey";

// Every interactive widget takes the page language and translates itself.
const widgets: Record<WidgetId, ComponentType<{ locale: Locale }>> = {
  "http-exchange": HttpExchange,
  "linux-terminal": LinuxTerminal,
  "request-journey": RequestJourney,
  "flag-hunt": FlagHunt,
  "cipher-lab": CipherLab,
  "password-meter": PasswordMeter,
};

export function Widget({ id, locale }: { id: WidgetId; locale: Locale }) {
  const Component = widgets[id];
  return <Component locale={locale} />;
}
