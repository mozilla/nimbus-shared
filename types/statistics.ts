/**
 * The experiment results accessible to:
 * 1. Experimenter via the mozanalysis GCS bucket
 * 2. partybal via the mozanalysis GCS bucket
 */
export type Statistics = Array<Statistic>;

export interface Statistic {
  /** The segment of the population being analyzed. "all" for the entire population. */
  segment: string;

  /** The slug of the metric. */
  metric: string;

  /** The slug of the statistic that was used to summarize the metric. */
  statistic: string;

  /**
   * A statistic-dependent quantity. For two-dimensional statistics like "decile,"
   * this represents the x axis of the plot. For one-dimensional statistics,
   * this is NULL or not available.
   */
  parameter?: number | string | null;

  /**
   * If this row represents a comparison between two branches, this row describes
   * what kind of comparison, like difference or relative_uplift. If this row
   * represents a measurement of a single branch, then this column is NULL or not available.
   */
  comparison?: string | null;

  /**
   * If this row represents a comparison between two branches,
   * this row describes which branch is being compared to.
   */
  comparison_to_branch?: string | null;

  /**
   * A value between 0 and 1 describing the width of the confidence interval
   * represented by the lower and upper columns.
   */
  ci_width?: number;

  /**
   * The point estimate of the statistic for the metric given the parameter.
   */
  point: number;

  /**
   * The lower bound of the confidence interval for the estimate.
   */
  lower?: number;

  /**
   * The upper bound of the confidence interval for the estimate.
   */
  upper?: number;

  /** A base-1 index reflecting the analysis window from which the row is drawn. */
  window_index: string;

  /** Analysis basis statistic result is based on. */
  analysis_basis: string;
}
