import { Audience } from "../types/targeting";

const audiences: { [id: string]: Audience } = {
  all_english: {
    name: "All English users",
    description: "All users in en-* locales using the release channel.",
    targeting:
      "localeLanguageCode == 'en' && browserSettings.update.channel == '{firefox_channel}'",
    desktop_telemetry: "STARTS_WITH(environment.settings.locale, 'en')",
  },
  us_only: {
    name: "US users (en)",
    description: "All users in the US with an en-* locale using the release channel.",
    targeting:
      "localeLanguageCode == 'en' && region == 'US' && browserSettings.update.channel == '{firefox_channel}'",
    desktop_telemetry:
      "STARTS_WITH(environment.settings.locale, 'en') AND normalized_country_code = 'US'",
  },
  first_run: {
    name: "First start-up users (en)",
    description:
      "First start-up users (e.g. for about:welcome) with an en-* locale using the release channel.",
    targeting:
      "localeLanguageCode == 'en' && (isFirstStartup || '{slug}' in activeExperiments) && browserSettings.update.channel == '{firefox_channel}'",
    desktop_telemetry:
      "STARTS_WITH(environment.settings.locale, 'en') AND payload.info.profile_subsession_counter = 1",
  },
};

export default audiences;
