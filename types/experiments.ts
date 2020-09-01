/**
 * The experiment definition accessible to Firefox via Remote Settings.
 * It is compatible with ExperimentManager.
 */
export interface ExperimentRecipe {
  /** A unique identifier for the Recipe */
  id: string;
  /** JEXL expression defined in an Audience */
  filter_expression: string;
  /**
   * JEXL expression using messaging system environment
   * @deprecated */
  targeting?: string;
  /** Is the experiment enabled? */
  enabled: boolean;
  /** Experiment definition */
  arguments: Experiment;
}

export interface Experiment {
  /** Unique identifier for the experiment */
  slug: string;
  /** Publically-accesible name of the experiment */
  userFacingName: string;
  /** Short public description of the experiment */
  userFacingDescription: string;
  /** Is the experiment currently live in production? i.e., published to remote settings? */
  active: boolean;
  /** Are we continuing to enroll new users into the experiment? */
  isEnrollmentPaused: boolean;
  /** Bucketing configuration */
  bucketConfig: BucketConfig;
  /** A list of feature slugs relevant to the experiment analysis */
  features: Array<string>;
  /** Branch configuration for the experiment */
  branches: Array<Branch>;
  /**
   * Actual publish date of the experiment
   * @format date-time
   */
  startDate: string;
  /**
   * Actual end date of the experiment
   * @format date-time
   */
  endDate: string | null;
  /** Duration of the experiment from the start date in days */
  proposedDuration: number;
  /** Duration of enrollment from the start date in days */
  proposedEnrollment: number;
  /** The slug of the reference branch */
  referenceBranch: string | null;
  /** The platform for the experiment */
  platform?: "fenix" | "firefox-desktop";
}

interface BucketConfig {
  /**
   * The randomization unit. Note that client_id is not yet implemented.
   * @default "normandy_id"
   */
  randomizationUnit: "client_id" | "normandy_id";
  /** Additional inputs to the hashing function */
  namespace: string;
  /**  Index of start of the range of buckets */
  start: number;
  /**  Number of buckets to check */
  count: number;
  /**
   * Total number of buckets
   * @default 10000  */
  total: number;
}

interface FeatureConfig {
  featureId: "cfr" | "aboutwelcome";
  enabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: { [key: string]: any } | null;
}

interface Branch {
  /** Identifier for the branch */
  slug: string;
  /**
   * Relative ratio of population for the branch (e.g. if branch A=1 and branch B=3,
   * branch A would get 25% of the population)
   * @default 1
   */
  ratio: number;
  feature: FeatureConfig;
}
