interface Audience {
  name: string;
  description: string;
  targeting?: string;
  filter_expression?: string;
  /**
   * A boolean BigQuery SQL expression expressing whether a single row in telemetry.main would have
   * matched the audience definition. These are used for sizing experiment populations,
   * not for targeting.
   */
  desktop_telemetry?: string;
}

const audiences :  {[id: string] : Audience } = {
  all_english: {
    name: "All English users",
    description: "All users in en-* locales.",
    targeting: "localeLanguageCode == \"en\"",
    desktop_telemetry: "STARTS_WITH(environment.settings.locale, 'en')"
  },
  us_only: {
    name: "US users (en)",
    description: "All users in the US with an en-* locale.",
    targeting: "localeLanguageCode == \"en\" && region == \"US\"",
    desktop_telemetry: "STARTS_WITH(environment.settings.locale, 'en') AND normalized_country_code = 'US'"
  },
  first_run: {
    name: "First start-up users (en)",
    description: "First start-up users (e.g. for about:welcome) with an en-* locale.",
    targeting: "localeLanguageCode == \"en\" && (isFirstStartup || currentExperiment.slug in activeExperiments) ",
    desktop_telemetry: "STARTS_WITH(environment.settings.locale, 'en') AND payload.info.profile_subsession_counter = 1"
  }
};

export default audiences;
