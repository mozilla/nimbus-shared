import { Audience } from "../types/targeting";

const audiences :  {[id: string] : Audience } = {
  all_english: {
    name: "All English users (release)",
    description: "All users in en-* locales using the release channel.",
    targeting: "localeLanguageCode == 'en' && browserSettings.update.channel == 'release'",
    desktop_telemetry: "STARTS_WITH(environment.settings.locale, 'en') AND normalized_channel = 'release'"
  },
  us_only: {
    name: "US users (en; release)",
    description: "All users in the US with an en-* locale using the release channel.",
    targeting: "localeLanguageCode == 'en' && region == 'US' && browserSettings.update.channel == 'release'",
    desktop_telemetry: "STARTS_WITH(environment.settings.locale, 'en') AND normalized_country_code = 'US' AND normalized_channel = 'release'"
  },
  first_run: {
    name: "First start-up users (en; release)",
    description: "First start-up users (e.g. for about:welcome) with an en-* locale using the release channel.",
    targeting: "localeLanguageCode == 'en' && (isFirstStartup || currentExperiment.slug in activeExperiments) && browserSettings.update.channel == 'release'",
    desktop_telemetry: "STARTS_WITH(environment.settings.locale, 'en') AND payload.info.profile_subsession_counter = 1 AND normalized_channel = 'release'"
  }
};

export default audiences;
