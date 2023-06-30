import { ResultListProperties } from "@/app/types/nameTypes";
import { tagGeneration } from "@/prompts/tags";

export type promptPropertiesType = {
  maxToken: number;
  temperature: number;
  pName: ResultListProperties;
};

export type promptGenFunction = {
  [K in ResultListProperties]: (name: string) => string;
}  

interface iPropmtProperties extends Partial<Record<ResultListProperties, promptPropertiesType>> {}

export const extendResultListDatabase: iPropmtProperties = {
  tags: {
    pName: 'tags',
    maxToken: 100,
    temperature: 1,

  },
  description: {
    pName: 'description',
    maxToken: 100,
    temperature: 0.8,
  },
}

export const promtGenerationForExtendList: Partial<promptGenFunction> = {
  tags: (name: string) => `Create tags for this topic: ${name}. ${tagGeneration} Answer with a JSON object with this schema: {"answer":["tag1", "tag2", "tag3", "tag4"]}`,
  description: (name: string) => `Create a short description for this: ${name}. Answer with a JSON object with this schema: {"answer": "2-3 short sentences"}`,
}
