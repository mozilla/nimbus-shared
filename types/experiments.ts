/**
 * The experiment definition accessible to applications via Remote Settings.
 */
export interface NimbusExperiment {
  /** Unique identifier for the experiment */
  slug: string;
  /** Publically-accesible name of the experiment */
  userFacingName: string;
  /** Short public description of the experiment */
  userFacingDescription: string;
  /** Are we continuing to enroll new users into the experiment? */
  isEnrollmentPaused: boolean;
  /** Bucketing configuration */
  bucketConfig: BucketConfig;
  /** A list of probe set slugs relevant to the experiment analysis */
  probeSets: Array<string>;
  /** Branch configuration for the experiment */
  branches: Array<Branch>;
  /**
   * JEXL expression using messaging system environment
   */
  targeting?: string;
  /**
   * Actual publish date of the experiment
   * @format date-time
   */
  startDate: string | null;
  /**
   * Actual end date of the experiment
   * @format date-time
   */
  endDate: string | null;
  /** Duration of the experiment from the start date in days */
  proposedDuration?: number;
  /** Duration of enrollment from the start date in days */
  proposedEnrollment: number;
  /** The slug of the reference branch */
  referenceBranch: string | null;
  /** A specific product such as Firefox Desktop or Fenix that supports Nimbus experiments */
  application: string;
}

interface BucketConfig {
  /**
   * The randomization unit.
   */
  randomizationUnit: string;
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
  featureId: string;
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
  feature?: FeatureConfig;
}
