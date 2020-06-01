// TODO: This needs expanding
interface MessageTrigger {
  /** Name of the trigger */
  id: string;
  /** Additional parameters of the trigger */
  params?: Array<string|number>
}

export interface StandardMessageRecipe {
  /** Unique identifier for the message */
  id: string;

  /** Identifier that routes the message definition to the right UI. */
  template: string;

  /** A JEXL expression representing targeting information */
  targeting?: string;

  trigger?: MessageTrigger;

  /** If more than one message is valid, the message with the higher priority will be shown  */
  priority?: number;

  /**
   * For messages types that are randomly chosen (e.g. snippets), determines the relative probabily
   * of a message being shown. For example, a message with a weight of 200 will show up twice as
   * often as other messages (since the default is 100).
   *
   * @default 100
   */
  weight?: number;

  /* Definition of maximum impressions in a particular period, or groups of periods */
  frequency?: {
    /* The maximum lifetime impressions for a message. */
    lifetime?: number;
    custom?: Array<{
      /* Period of time in milliseconds (e.g. 86400000 for one day) or 'daily' */
      period: number | "daily";
      cap: number;
    }>
  }

  /* Message-specific properties; each type of message template defines its own schema for content */
  content: {[key: string]: any};
}

export interface SimpleCFRMessage extends StandardMessageRecipe {
  template: "cfr_doorhanger";
  // Triggers are requried for CFR, not optional
  trigger: MessageTrigger;

}
