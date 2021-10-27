/**
 * The experiment definition accessible to:
 * 1. The Nimbus SDK via Remote Settings
 * 2. Jetstream via the Experimenter API
 */
export interface NimbusExperiment {
  /**
   * Version of the NimbusExperiment schema this experiment refers to
   */
  schemaVersion: string;

  /** Unique identifier for the experiment */
  slug: string;

  /**
   * Unique identifier for the experiment. This is a duplicate of slug, but is a required field
   * for all Remote Settings records.
   */
  id: string;

  /** A slug identifying the targeted product for this experiment.
   * It should be a lowercase_with_underscores name that is short and unambiguous and it should
   * match the app_name found in https://probeinfo.telemetry.mozilla.org/glean/repositories.
   * Examples are "fenix" or "firefox_desktop".
   */
  appName: string;

  /** The platform identifier for the targeted app.
   * The app's identifier exactly as it appears in the relevant app store listing
   * (for relevant platforms) or in the app's Glean initialization call
   * (for other platforms). Examples are "org.mozilla.firefox_beta" or "firefox-desktop".
   */
  appId: string;

  /** A specific channel of an application such as "nightly", "beta", or "release" */
  channel: string;

  /** Public name of the experiment displayed on "about:studies" */
  userFacingName: string;

  /** Short public description of the experiment displayed on on "about:studies" */
  userFacingDescription: string;

  /**
   * When this property is set to true, the the SDK should not enroll new users
   * into the experiment that have not already been enrolled.
   */
  isEnrollmentPaused: boolean;

  /** Bucketing configuration */
  bucketConfig: BucketConfig;

  /** A list of outcomes relevant to the experiment analysis. */
  outcomes?: Array<Outcome>;

  /** A list of featureIds the experiment contains configurations for.
   */
  featureIds?: Array<string>;

  /** Branch configuration for the experiment */
  branches: Array<Branch>;

  /**
   * JEXL expression used to filter experiments based on locale, geo, etc.
   */

  targeting?: string | null;

  /**
   * Actual publish date of the experiment
   * Note that this value is expected to be null in Remote Settings.
   * @format date
   */
  startDate: string | null;

  /**
   * Actual end date of the experiment.
   * Note that this value is expected to be null in Remote Settings.
   * @format date
   */
  endDate: string | null;

  /**
   * Duration of the experiment from the start date in days.
   * Note that this property is only used during the analysis phase (not by the SDK)
   * @asType integer
   */
  proposedDuration?: number;

  /**
   * This represents the number of days that we expect to enroll new users.
   * Note that this property is only used during the analysis phase (not by the SDK)
   * @asType integer
   */
  proposedEnrollment: number;

  /** The slug of the reference branch (that is, which branch we consider "control") */
  referenceBranch: string | null;

  /**
   * This is NOT used by Nimbus, but has special functionality in Remote Settings.
   * See https://remote-settings.readthedocs.io/en/latest/target-filters.html#how
   */
  filter_expression?: string;
}

interface BucketConfig {
  /**
   * A unique, stable identifier for the user used as an input to bucket hashing
   */
  randomizationUnit: string;

  /** Additional inputs to the hashing function */
  namespace: string;

  /**
   * Index of start of the range of buckets
   * @asType integer
   * */
  start: number;

  /**
   * Number of buckets to check
   * @asType integer
   * */
  count: number;

  /**
   * Total number of buckets. You can assume this will always be 10000.
   * @asType integer
   * @default 10000  */
  total: number;
}

interface FeatureConfig {
  /** The identifier for the feature flag */
  featureId: string;

  /** This can be used to turn the whole feature on/off */
  enabled?: boolean;

  /** Optional extra params for the feature (this should be validated against a schema) */
  value: { [key: string]: unknown };
}

interface Branch {
  /** Identifier for the branch */
  slug: string;

  /**
   * Relative ratio of population for the branch (e.g. if branch A=1 and branch B=3,
   * branch A would get 25% of the population)
   * @asType integer
   * @default 1
   */
  ratio: number;

  /**
   * Firefox Desktop <95
   */
  feature: FeatureConfig;

  /**
   * Firefox Desktop >=95
   */
  features?: Array<FeatureConfig>;
}

interface Outcome {
  /** Identifier for the outcome */
  slug: string;

  /** e.g. "primary" or "secondary" */
  priority: string;
}
