interface Audience {
  name: string;
  description: string;
  targeting?: string;
  filter_expression?: string;
}

const audiences :  {[id: string] : Audience } = {
  all_english: {
    name: "All English users",
    description: "All users in en-* locales.",
    targeting: "localeLanguageCode == \"en\""
  },
  us_only: {
    name: "US users (en)",
    description: "All users in the US with an en-* locale.",
    targeting: "localeLanguageCode == \"en\" && region == \"US\""
  },
  first_run: {
    name: "First start-up users (en)",
    description: "First start-up users (e.g. for about:welcome) with an en-* locale.",
    targeting: "localeLanguageCode == \"en\" && (isFirstStartup || currentExperiment.slug in activeExperiments) "
  }
};

export default audiences;
