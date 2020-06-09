/** A Normandy recipe */
export interface NormandyRecipe {
  /** The primary key of the recipe */
  id: number;

  /** The name of the recipe, for usage in internal systems */
  name: string;

  /** The name of the action to enact */
  action_name: string;

  /** The arguments to pass to the action */
  arguments: Arguments;
}

type Arguments =
  | ShowHeartbeatArguments
  | PreferenceRolloutArguments
  | PreferenceRollbackArguments
  | PreferenceExperimentArguments
  | OptOutStudyArguments
  | MultiPreferenceExperimentArguments
  | MessagingExperimentArguments
  | BranchedAddonStudyArguments
  | AddonRolloutArguments
  | AddonRollbackArguments;

/** Log a message to the console */
export interface ConsoleLogArguments {
  /** Message to log to the console */
  message: string;
}

type PreferenceValue = number | string | boolean;

type PreferenceBranchType = "user" | "default";

/** This action shows a single survey */
export interface ShowHeartbeatArguments {
  /** Slug unique identifying this survey in telemetry */
  surveyId: string;

  /** Message to show to the user */
  message: string;

  /** Text to display in the "learn more" link */
  learnMoreMessage: string;

  /** URL to show to the user when the click the "learn more" link */
  learnMoreUrl: string;

  /** URL to redirect the user to after rating Firefox or clicking the engagement button */
  postAnswerUrl: string;

  /** Thanks message to show to the user after they've rated Firefox */
  thanksMessage: string;

  /**
   * Text for the engagement button.
   *
   * If specified, this button will be shown instead of rating stars.
   */
  engagementButtonLabel?: string;

  /** Include unique user ID in post-answer-url and Telemetry */
  includeTelemetryUUID?: boolean;

  /** Determines how often a prompt is shown executes */
  repeatOption?: "once" | "xdays" | "nag";

  /** For repeatOption=xdays, how often (in days) the prompt is displayed */
  repeatEvery?: number;
}

/** Change preferences permanently */
export interface PreferenceRolloutArguments {
  /**
   * Unique identifier for the rollout, used in telemetry and rollbacks
   *
   * @pattern ^[a-z0-9\-_]+$
   */
  slug: string;

  /** The preferences to change, and their values */
  preferences: Array<{
    /** Full dotted path of the preference being changed*/
    preferenceName: string;

    /** Value to set the preference to */
    value: PreferenceValue;
  }>;
}

/** Undo a preference rollout */
export interface PreferenceRollbackArguments {
  /** Unique identifier for the rollout to undo */
  rolloutSlug: string;
}

/** Run a feature experiment activated by a preference */
export interface PreferenceExperimentArguments {
  /**
   * List of experimental branches
   * @minItems 1
   */
  branches: Array<PreferenceExperimentBranch>;

  /** Full dotted path of the preference that controls this experiment */
  preferenceName: string;

  /** Data type of the preference that controls this experiment */
  preferenceType: "string" | "integer" | "boolean";

  /** Controls whether the default or user value of the preference is modified. */
  preferenceBranchType: PreferenceBranchType;

  /**
   * Unique identifier for this experiment
   *
   * @pattern ^[A-Za-z0-9\-_]+$
   */
  slug: string;

  /**
   * URL of a document describing the experiment
   *
   * @default [{}]
   * @format uri
   */
  experimentDocumentUrl: string;

  /**
   * If true, new users will not be enrolled in the study.
   * @default false
   */
  isEnrollmentPaused?: boolean;

  /**
   * If true, marks the preference as a high population experiment that should
   * be excluded from certain types of telemetry.
   * @default false
   */
  isHighVolume?: boolean;
}

/** A branch in a preference experiment */
interface PreferenceExperimentBranch {
  /**
   * Unique identifier for this branch of the experiment.
   * @pattern ^[A-Za-z0-9\-_]+$
   */
  slug: string;

  /** Value to set the preference to for this branch */
  value: PreferenceValue;

  /**
   * Ratio of users who should be grouped into this branch.
   * @minimum 1
   */

  ratio: number;
}

/** Enroll a user in an opt-out add-on study */
export interface OptOutStudyArguments {
  /**
   * URL of the add-on XPI file to install
   * @minLength 1
   */
  addonUrl: string;

  /**
   * User-facing name of the study
   * @minLength 1
   */
  name: string;

  /**
   * User-facing description of the study
   * @minLength 1
   */
  description: string;

  /** The record ID of the extension used for Normandy API calls. */
  extensionApiId: number;

  /** If true, new users will not be enrolled in the study */
  isEnrollmentPaused?: boolean;
}

/** Run a feature experiment activated by a set of preferences */
export interface MultiPreferenceExperimentArguments {
  /**
   * Unique identifier for this experiment
   * @pattern ^[A-Za-z0-9\-_]+$
   */
  slug: string;

  /**
   * User-facing name of the experiment
   * @minLength 1
   */
  userFacingDescription: string;

  /**
   * User-facing description of the experiment
   * @minLength 1
   */
  userFacingName: string;

  /**
   * List of experimental branches
   * @minItems 1
   */
  branches: Array<MultiPreferenceExperimentBranch>;

  /**
   * URL of a document describing the experiment
   * @format uri
   * @default ""
   */
  experimentDocumentUrl?: string;

  /**
   * Marks the preference experiment as a high population experiment, that
   * should be excluded from certain types of telemetry.
   * @default false
   */
  isHighPopulation?: boolean;

  /**
   * Incorrect version of `isHighPopulation`. Included here for compatibility, but should not be used.
   * @deprecated
   */
  isHighVolume?: boolean;

  /**
   * If true, new users will not be enrolled in the study.
   * @default false
   */
  isEnrollmentPaused?: boolean;
}

/** A branch in a multi-preference experiment */
interface MultiPreferenceExperimentBranch {
  /**
   * Unique identifier for this branch of the experiment
   * @pattern ^[A-Za-z0-9\-_]+$
   */
  slug: string;

  /** Ratio of users that should be grouped into this branch */
  ratio: number;

  /** The set of preferences to be set if this branch is chosen */
  preferences: {
    [prefName: string]: {
      /** Value for this preference when this branch is chosen */
      preferenceValue: PreferenceValue;

      /** Data type of the preference that controls this experiment */
      preferenceBranchType: PreferenceBranchType;

      /** Data type of the preference that controls this experiment */
      preferenceType: "string" | "integer" | "boolean";
    };
  };
}

/** Messaging experiment */
export interface MessagingExperimentArguments {
  /**
   * Unique identifier for this experiment
   * @pattern ^[A-Za-z0-9\-_]+$
   */
  slug: string;

  /**
   * User-facing name of the experiment
   * @minLength 1
   */
  userFacingName: string;

  /**
   * User-facing description of the experiment
   * @minLength 1
   */
  userFacingDescription: string;

  /** List of experimental branches */
  branches: Array<MessagingExperimentBranch>;

  /**
   * URL of a document describing the experiment
   * @format uri
   * @default ""
   */
  experimentDocumentUrl: string;

  /**
   * If true, new users will not be enrolled in the study.
   * @default false
   */
  isEnrollmentPaused?: boolean;
}

/** Messaging experiment branch */
interface MessagingExperimentBranch {
  /** Unique identifier for this branch of the experiment */
  slug: string;

  /**
   * Ratio of users who should be grouped into this branch
   * @minimum 1
   */
  ratio: number;

  /**
   * A list of experiment groups that can be used to exclude or select related
   * experiments. May be empty.
   */
  groups: Array<string>;

  /** Message content  */
  value: Record<string, unknown>;
}

/** Enroll a user in an add-on experiment, with managed branches */
export interface BranchedAddonStudyArguments {
  /**
   * Machine-readable identifier
   * @minLength 1
   */
  slug: string;

  /**
   * User-facing name of the experiment
   * @minLength 1
   */
  userFacingName: string;

  /**
   * User-facing description of the experiment
   * @minLength 1
   */
  userFacingDescription: string;

  /**
   * List of experimental branches
   * @minItems 1
   */
  branches: Array<BranchedAddonStudyBranch>;

  /**
   * If true, new users will not be enrolled in the study.
   * @default false
   */
  isEnrollmentPaused?: boolean;
}

/** A branched add-on study branch */
interface BranchedAddonStudyBranch {
  /** Unique identifier for this this branch of the experiment */
  slug: string;

  /** Ratio of users who should be grouped into this branch */
  ratio: number;

  /** The record ID of the add-on uploaded to the Normandy server */
  extensionApiId: number;
}

/** Install an add-on permanently */
export interface AddonRolloutArguments {
  /**
   * Unique identifier for the rollout, used in telemetry and rollbacks
   * @pattern ^[a-z0-9\-_]+$
   */
  slug: string;

  /** The record ID of the extension used for Normandy API calls */
  extensionApiId: number;
}

/** Undo an add-on rollout */
export interface AddonRollbackArguments {
  /**
   * Unique identifier of the rollout to undo
   * @pattern ^[a-z0-9\-_]+$
   */
  rolloutSlug: string;
}
