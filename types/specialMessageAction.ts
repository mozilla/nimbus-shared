export type SpecialMessagingAction =
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
  }
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
  type: "PIN_CURRENT_TAB",
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
