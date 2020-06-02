import { TriggerAction } from "./triggerAction";
import { MessagingAction } from "./specialMessageAction";

type FluentId = { string_id: string };
type FluentOrString = FluentId | string;

/** Action dispatched by the button */
interface CFRButton {
  label: {
    value: string;
    attributes: {
      /** A single character to be used as a shortcut key for the secondary button. This should be one of the characters that appears in the button label */
      accesskey: string;
    }
  } | FluentId,
  action: MessagingAction;
}

interface SimpleCFRContent {
  /** The text that shows up in the chiclet. 20 characters max. */
  notification_text: FluentOrString;
  /** The background color of the chiclet as a HEX code. */
  chiclet_color?: string;
  heading_text: FluentOrString;
  text: FluentOrString;
  /** The icon displayed in the pop-over. Should be 32x32px or 64x64px and png/svg */
  icon: string;
  /** Dark theme variant of the icon if needed */
  icon_dark_theme?: string;
  /** The label and functionality for the buttons in the pop-over */
  buttons: {
    primary: CFRButton;
    secondary: Array<CFRButton>;
  }
}

export interface StandardMessageRecipe {
  /** Unique identifier for the message */
  id: string;

  /** Identifier that routes the message definition to the right UI. */
  template: string;

  /** A JEXL expression representing targeting information */
  targeting?: string;

  trigger?: TriggerAction;

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
  content: SimpleCFRContent;
}

export interface SimpleCFRMessage extends StandardMessageRecipe {
  template: "cfr_doorhanger";
  // Triggers are required for CFR, not optional
  trigger: TriggerAction;
}