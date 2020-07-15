import { ExperimentRecipe } from "../types/experiments";

// Utility type to being able to specify partials of nested objects
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<RecursivePartial<U>> // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : T[P] extends { [key: string]: any }
    ? RecursivePartial<T[P]>
    : T[P];
};

// Utility type for specifiying a partial of any experiment design
interface Preset<T> {
  name: string;
  description: string;
  preset: RecursivePartial<T>;
}

const presets: { [id: string]: Preset<ExperimentRecipe> } = {
  empty_aa: {
    name: "A/A Experiment",
    description:
      "A design for diagnostic testing of targeting or enrollment. Fixed to 1% of the population.",
    preset: {
      filter_expression:
        "env.version|versionCompare('{minFirefoxVersion}') >= 0 && {audienceFilterExpression}",
      targeting:
        '[{randomizationUnit}, "{bucketNamespace}"]|bucketSample({bucketStart}, {bucketCount}, {bucketTotal}) && {audienceTargeting}',
      arguments: {
        proposedDuration: 28,
        proposedEnrollment: 7,
        branches: [
          { slug: "control", ratio: 1, value: null },
          { slug: "treatment", ratio: 1, value: null },
        ],
        bucketConfig: {
          randomizationUnit: "normandy_id",
          count: 100,
          total: 10000,
        },
      },
    },
  },
};

export default presets;
