import { Configuration, OpenAIApi } from "openai";

export const openAIClient = () => new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);
