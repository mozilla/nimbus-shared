export interface Audience {
  name: string;
  description: string;
  targeting?: string;
  /**
   * A boolean BigQuery SQL expression expressing whether a single row in telemetry.main would have
   * matched the audience definition. These are used for sizing experiment populations,
   * not for targeting.
   */
  desktop_telemetry?: string;
}
