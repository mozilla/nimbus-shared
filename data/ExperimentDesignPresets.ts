import {AAExperiment} from "../types/experiments";

interface Preset<T> {
  name: string;
  description: string;
  presets: Partial<T>
}

export const AAType: Preset<AAExperiment> = {
  name: "A/A Experiment",
  description: "A design for diagnostic testing of targeting or enrollment. Fixed to 1% of the population.",
  presets: {
    branches: [
      {slug: "control", is_reference_branch: true, ratio: 1, value: {}},
      {slug: "treatment", ratio: 1, value: {}}
    ],
    bucket_config: {
      randomization_unit: "normandy_id",
      // This needs to be generated based on the slug.
      namespace: "",
      start: 0,
      count: 100,
      total: 10000
    }
  }
};
