import { ResultListProperties } from "@/app/types/nameTypes";
import { tagGeneration } from "@/prompts/tags";

type ExProperties = {
  prompt: (name: string) => string;
  maxToken: number;
  temperature: number;
  propertyName: ResultListProperties;
};

interface Ex extends Partial<Record<ResultListProperties, ExProperties>> {
  }


export const extendResultListDatabase: Ex = {
  tags: {
    prompt: (name: string) => `Create tags for this topic: ${name}. ${tagGeneration} Answer with a JSON object with this schema: {"answer":["tag1", "tag2", "tag3", "tag4"]}`,
    propertyName: 'tags',
    maxToken: 100,
    temperature: 1,

  },
  description: {
    prompt: (name: string) => `Create a short description for this: ${name}. Answer with a JSON object with this schema: {"answer": "2-3 short sentences"}`,
    propertyName: 'description',
    maxToken: 100,
    temperature: 0.8,
  },
}
