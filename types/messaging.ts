type FluentId = { string_id: string };
type FluentOrString = FluentId | string;

/** Button label and action */
interface CFRButton {
  label:
    | {
        value: string;
        attributes: {
          /**
           * A single character to be used as a shortcut key for the secondary button.
           * This should be one of the characters that appears in the button label
           *
           * @maxLength 1
           * @minLength 1
           */
          accesskey: string;
        };
      }
    | FluentId;
  action: SpecialMessagingAction;
}

interface SimpleCFRContent {
  /**
   * The text that shows up in the chiclet.
   *
   * @maxLength 20
   */
  notification_text: FluentOrString;
  /**
   * The background color of the chiclet as a HEX code.
   *
   * @default #0060df
   */
  active_color?: string;
  heading_text: FluentOrString;
  text: FluentOrString;
  /** The icon displayed in the pop-over. Should be 32x32px or 64x64px and png/svg */
  icon: string;
  /** Dark theme variant of the icon if needed */
  icon_dark_theme?: string;
  /** The label and functionality for the buttons in the pop-over */
  buttons: {
    primary: CFRButton;
    secondary: [CFRButton, CFRButton];
  };
}

interface StandardMessageRecipe {
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

  /** Definition of maximum impressions in a particular period, or groups of periods */
  frequency?: {
    /** The maximum lifetime impressions for a message. */
    lifetime?: number;
    custom?: Array<{
      /* Period of time in milliseconds (e.g. 86400000 for one day) or 'daily' */
      period: number | "daily";
      cap: number;
    }>;
  };

  /** Message-specific properties; each type of message template defines its own schema for content */
  content: SimpleCFRContent;
}

export interface SimpleCFRMessage extends StandardMessageRecipe {
  template: "cfr_doorhanger";
  // Triggers are required for CFR, not optional
  trigger: TriggerAction;
}

type TriggerAction =
  | OpenUrl
  | OpenArticleUrl
  | OpenBookmarkedUrl
  | FrequentVisits
  | NewSavedLogin
  | ContentBlocking;

/** List of urls we should match against */
type UrlParams = Array<string>;

/** List of Match pattern compatible strings to match against */
type UrlPatterns = Array<string>;

interface BaseTrigger {
  id: string;
  params?: UrlParams;
  patterns?: UrlPatterns;
}

/** Happens every time the user loads a new URL that matches the provided `hosts` or `patterns` */
interface OpenUrl extends BaseTrigger {
  id: "openURL";
}

/** Happens every time the user loads a document that is Reader Mode compatible */
interface OpenArticleUrl extends BaseTrigger {
  id: "openArticleURL";
}

/** Happens every time the user adds a bookmark from the URL bar star icon */
interface OpenBookmarkedUrl {
  id: "openBookmarkedURL";
}

/** Happens every time a user navigates (or switches tab to) to any of the `hosts` or `patterns` arguments but additionally provides information about the number of accesses to the matched domain. */
interface FrequentVisits extends BaseTrigger {
  id: "frequentVisits";
}

/** Happens every time the user adds or updates a login */
interface NewSavedLogin {
  id: "newSavedLogin";
}

/** Happens every time Firefox blocks the loading of a page script/asset/resource that matches the one of the tracking behaviours specifid through params. See https://searchfox.org/mozilla-central/rev/8ccea36c4fb09412609fb738c722830d7098602b/uriloader/base/nsIWebProgressListener.idl#336 */
interface ContentBlocking {
  id: "contentBlocking";
  params: Array<number>;
}

type SpecialMessagingAction =
  | DisableSTPDoorhangers
  | HighlightFeature
  | InstallAddonFromURL
  | OpenAboutPage
  | OpenApplicationsMenu
  | OpenAwesomeBar
  | OpenPreferencesPage
  | OpenPrivateBrowserWindow
  | OpenProtectionPanel
  | OpenProtectionReport
  | OpenUrlAction
  | PinCurrentTab
  | ShowFirefoxAccounts
  | ShowMigrationWizard
  | Minimize;

/** Disables all STP doorhangers. */
interface DisableSTPDoorhangers {
  type: "DISABLE_STP_DOORHANGERS";
}

/** Highlights an element, such as a menu item */
interface HighlightFeature {
  data: {
    /** The element to highlight */
    args: string;
  };
  type: "HIGHLIGHT_FEATURE";
}

/** Install an add-on from AMO */
interface InstallAddonFromURL {
  data: {
    telemetrySource: string;
    url: string;
  };
  type: "INSTALL_ADDON_FROM_URL";
}

/** Opens an about: page in Firefox */
interface OpenAboutPage {
  data: {
    /** The about page. E.g. "welcome" for about:welcome' */
    args: string;
    /**
     * Where the URL is opened
     *
     * @default "tab"
     */
    where: "current" | "save" | "tab" | "tabshifted" | "window";
    /** Any optional entrypoint value that will be added to the search. E.g. "foo=bar" would result in about:welcome?foo=bar' */
    entrypoint: string;
  };
  type: "OPEN_ABOUT_PAGE";
}

/** Opens an application menu */
interface OpenApplicationsMenu {
  data: {
    /** The menu name, e.g. "appMenu" */
    args: string;
  };
  type: "OPEN_APPLICATIONS_MENU";
}

/** Focuses and expands the awesome bar */
interface OpenAwesomeBar {
  type: "OPEN_AWESOME_BAR";
}

/** Opens a preference page */
interface OpenPreferencesPage {
  data: {
    /** Section of about:preferences, e.g. "privacy-reports" */
    category: string;
    /** Add a queryparam for metrics */
    entrypoint: string;
  };
  type: "OPEN_PREFERENCES_PAGE";
}

/** Opens a private browsing window. */
interface OpenPrivateBrowserWindow {
  type: "OPEN_PRIVATE_BROWSER_WINDOW";
}

/** Opens the protections panel */
interface OpenProtectionPanel {
  type: "OPEN_PROTECTION_PANEL";
}

/** Opens the protections panel report */
interface OpenProtectionReport {
  type: "OPEN_PROTECTION_REPORT";
}

/** Opens given URL */
interface OpenUrlAction {
  data: {
    /** URL to open */
    args: string;
    /**
     * Where the URL is opened
     *
     * @default "tab"
     */
    where: "current" | "save" | "tab" | "tabshifted" | "window";
  };
  type: "OPEN_URL";
}

/** Pin the current tab */
interface PinCurrentTab {
  type: "PIN_CURRENT_TAB";
}

/** Show Firefox Accounts */
interface ShowFirefoxAccounts {
  type: "SHOW_FIREFOX_ACCOUNTS";
  data: {
    /** Adds entrypoint={your value} to the FXA URL */
    entrypoint: string;
  };
}

/** Shows the Migration Wizard to import data from another Browser. See https://support.mozilla.org/en-US/kb/import-data-another-browser" */
interface ShowMigrationWizard {
  type: "SHOW_MIGRATION_WIZARD";
}

/** Minimize the CFR doorhanger back into the URLbar */
interface Minimize {
  type: "CANCEL";
}
