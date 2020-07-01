export interface FeatureInterface {
  /** Should match the filename of the feature definition */
  slug: string;

  /** Human-readable short name */
  name: string;

  /** Longer description of the feature under measure */
  description: string;

  /** Telemetry indicating whether the feature was used */
  telemetry: Array<FeatureTelemetry>;
}

type FeatureTelemetry = FeatureEventTelemetry | FeatureScalarTelemetry;

interface FeatureEventTelemetry {
  kind: "event";

  /** Category of the event to match */
  event_category: string;

  /** Method of the event to match. If provided, must match exactly */
  event_method?: string;

  /** Object of the event to match. If provided, must match exactly */
  event_object?: string;

  /** String value of the event to match. If provided, must match exactly */
  event_value?: string;
}

interface FeatureScalarTelemetry {
  kind: "scalar";

  /**
   * Name of the scalar to match, in dot-separated form, like
    `browser.engagement.tab_pinned_event_count`.
   */
  name: string;
}
