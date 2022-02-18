/**
 * Experiment analysis results metadata is accessible to:
 * 1. Experimenter via the mozanalysis GCS bucket
 * 2. partybal via the mozanalysis GCS bucket
 */
export interface Metadata {
  /**
   * Version of the schema used to represent statistic results.
   * @asType integer
   */
  schema_version: number;

  /** jetstream-config URL to the external configuration file defined for the analysed experiment. */
  external_config?: ExternalConfigMetadata | null;

  /** Metadata for metrics that have been computed as part of the analysis. */
  metrics: Record<string, MetricMetadata>;

  /** Metadata for outcomes that have been used as part of the analysis. */
  outcomes: Record<string, OutcomeMetadata>;
}

export interface MetricMetadata {
  /** Descriptive name for the metric. */
  friendly_name: string;

  /** Description of what the metric represents. */
  description: string;

  /** Whether larger result numbers indicate better results. */
  bigger_is_better: boolean;

  /** Analysis bases statistic results are based on. */
  analysis_bases: Array<string>;
}

export interface OutcomeMetadata {
  /** Slug of the outcome. */
  slug: string;

  /** Descriptive name of the outcome. */
  friendly_name: string;

  /** Description of what the outcome represents. */
  description: string;

  /** List of metric slugs that are defined and get computed as part of the outcome. */
  metrics: Array<string>;

  /** List of metric slugs that are not defined as part of the outcome but are referenced and get computed. */
  default_metrics: Array<string>;

  /** Commit hash of the outcome config version used for the analysis. */
  commit_hash?: string;
}

export interface ExternalConfigMetadata {
  /** Slug of the branch that is configured as reference branch in the external config. */
  reference_branch?: string | null;

  /**
   * The end date that is configured in the external config.
   * @format date
   */
  end_date?: string | null;

  /**
   * The start date that is configured in the external config.
   * @format date
   */
  start_date?: string | null;

  /**
   * Enrollment period duration that has be defined in the external config.
   */
  enrollment_period?: number | null;

  /** Whether the analysis for this experiment is skipped. */
  skip?: boolean | null;

  /** URL to the external config file in the jetstream-config repo. */
  url: string;
}
