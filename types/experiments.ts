/**
 * The experiment definition accessible to Firefox via Remote Settings.
 * It is compatible with ExperimentManager.
 */
export interface ExperimentRecipe {
  /** A unique identifier for the Recipe */
  id: string;
  /** JEXL expression defined in an Audience */
  filter_expression: string;
  /** Experiment definition */
  arguments: Experiment;
}

export interface Experiment {
  /** Unique identifier for the experiment */
  slug: string;
  /** Publically-accesible name of the experiment */
  public_name: string;
  /** Short public description of the experiment */
  public_description: string;
  /** Experimenter URL */
  experiment_url: string;
  /** Is the experiment currently live in production? i.e., published to remote settings? */
  is_published: boolean;
  /** Are we continuing to enroll new users into the experiment? */
  isEnrollmentPaused: boolean;
  /** Bucketing configuration */
  bucket_config: BucketConfig;
  /** A list of features relevant to the experiment analysis */
  features: Array<Feature>;
  /** Branch configuration for the experiment */
  branches: Array<Branch>;
  /** Actual publish date of the experiment */
  start_date: Date;
  /** Actual end date of the experiment */
  end_date: Date | null;
  /** Duration of enrollment from the start date in days */
  proposed_enrollment: number;
}

// TODO - Needs to be generated based on Features to be added to the /data directory
// probably like keyof typeof Features
type Feature = string;

interface BucketConfig {
  /**
   * The randomization unit. Note that client_id is not yet implemented.
   * @default "normandy_id"
   */
  randomization_unit: "client_id" | "normandy_id";
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

interface Branch {
  /** Display name for variant, e.g. "control"  */
  slug: string;
  /** Is this a reference/"control" branch? */
  is_control?: boolean;
  /**
   * Relative ratio of population for the branch (e.g. if branch A=1 and branch B=3,
   * branch A would get 25% of the population)
   * @default 1
   */
  ratio: number;
  /** The variant payload. TODO: This will be more strictly validated. */
  value: {[key: string]: any} | null;
}

