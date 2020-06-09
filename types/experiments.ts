/**
 * The experiment definition accessible via the API and available to clients.fail
 * This is what Firefox reads from Remote Settings, or Pensieve gets via the public
 * Experimenter API.
 */
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
  is_enrollment_paused: boolean;

  /** Reference to an Audience, which contains targeting information */
  audience: Audience;
  /** Bucketing configuration */
  bucket_config: BucketConfig;

  /** A list of features relevant to the experiment analysis */
  features: Array<Feature>;
  /** Branch configuration for the experiment */
  branches: Array<Branch>;

  /** Actual publish date of the experiment */
  start_date: Date;

  /** Duration of enrollment from the start date */
  proposed_enrollment: number;

  /** Actual end date of the experiment */
  end_date: Date | null;
}

/**
 * This is the Internal Experiment type used by the front-end.
 * It has some additional fields not included in the public api.
 */
export interface ExperimentInternal extends Experiment {
  /** Hypothesis for the experiment */
  objectives: string;
}


// TODO - Needs to be generated based on Features to be added to the /data directory
// probably like keyof typeof Features
type Feature = string;

interface BucketConfig {
  randomization_unit: "client_id" | "normandy_id";
  namespace: string;
  start: number;
  count: number;
  /**
   * Total number of buckets
   * @default 10000  */
  total: number;
}

export interface Audience {
  /** Human-readable name of the audience */
  name: string;
  /** Human-readable description */
  description: string;
  /** A targeting expression written in jexl */
  filter_expression: string;
}

interface Branch {
  /** Display name for variant, e.g. "control"  */
  slug: string;
  /** Is this a reference/"control" branch? */
  is_reference_branch: string;
  /**
   * Relative ratio of population for the branch (e.g. if branch A=1 and branch B=3,
   * branch A would get 25% of the population)
   * @default 1
   */
  ratio: number;
  /** The variant payload. TODO: This will be more strictly validated. */
  value: {[key: string]: any};
}

