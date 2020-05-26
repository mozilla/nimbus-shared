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

type Arguments = ConsoleLogArguments;

/** Print a simple message to the browser console */
export interface ConsoleLogArguments {
  /** The message to print to the console */
  message: string;
}

type PreferenceValue = number | string | boolean;

type PreferenceBranchType = "user" | "default";

export interface ShowHeartbeatArguments {
  engagementButtonLabel?: string;
  includeTelemetryUUID?: boolean;
  learnMoreMessage?: string;
  learnMoreUrl?: string;
  message: string;
  postAnswerUrl?: string;
  repeatOption?: string;
  surveyId: string;
  thanksMessage: string;
  repeatEvery?: number;
}

export interface PreferenceRolloutArguments {
  preferences: Array<{ preferenceName: string; value: PreferenceValue }>;
  slug: string;
}

export interface PreferenceRollbackArguments {
  rolloutSlug: string;
}

export interface PreferenceExperimentArguments {
  branches: Array<PreferenceExperimentBranch>;
  experimentDocumentUrl: string;
  isEnrollmentPaused?: boolean;
  isHighVolume?: boolean;
  preferenceBranchType: PreferenceBranchType;
  preferenceName: string;
  preferenceType: string;
  slug: string;
}

interface PreferenceExperimentBranch {
  ratio: number;
  slug: string;
  value: PreferenceValue;
}

export interface OptOutStudyArguments {
  addonUrl: string;
  description: string;
  extensionApiId: number;
  isEnrollmentPaused?: boolean;
  name: string;
}

export interface MultiPreferenceExperimentArguments {
  branches: Array<MultiPreferenceExperimentBranch>;
  experimentDocumentUrl?: string;
  slug: string;
  userFacingDescription: string;
  userFacingName: string;
  isEnrollmentPaused?: boolean;
  isHighPopulation?: boolean;
  isHighVolume?: boolean;
  preferenceBranchType?: PreferenceBranchType;
}

interface MultiPreferenceExperimentBranch {
  preferences: {
    [prefName: string]: {
      preferenceBranchType: PreferenceBranchType;
      preferenceType: string;
      preferenceValue: PreferenceValue;
    };
  };
  ratio: number;
  slug: string;
}

export interface MessagingExperimentArguments {
  branches: Array<MessagingExperimentBranch>;
  experimentDocumentUrl: string;
  isEnrollmentPaused?: boolean;
  slug: string;
  userFacingDescription: string;
  userFacingName: string;
}

interface MessagingExperimentBranch {
  groups: Array<string>;
  ratio: number;
  slug: string;
  value: { [key: string]: any };
}

export interface BranchedAddonStudyArguments {
  branches: Array<BranchedAddonStudyBranch>;
  isEnrollmentPaused: boolean;
  slug: string;
  userFacingDescription: string;
  userFacingName: string;
}

interface BranchedAddonStudyBranch {
  extensionApiId: number;
  ratio: number;
  slug: string;
}

export interface AddonRolloutArguments {
  slug: string;
  extensionApiId: number;
}

export interface AddonRollbackArguments {
  rolloutSlug: string;
}
