export type PromptObjectArray = (PromptVersionSelection | string)[];

export interface PromptVersionType {
  id: string
  promptText: string,
  promptObject: PromptObjectArray,
  created: Date,
  description: string,
  params: string | null,
  result: any[],
}

export interface PromptCollectionType {
  id: string,
  name: string,
  description: string,
  created: Date,
  versions: PromptVersionType[],
  defaultParametersId: string,
}

export interface PromptVersionSelection {
  collectionId: string,
  versionId: string,
  promptText: string,
}

export interface CursorPositionType {
  isInput: boolean,
  textBeforeCursor?: string,
  textAfterCursor?: string,
  subPromptId?: number,
}


// parameters

export interface ParameterPropertiesType {
  temperature: number,
  max_tokens: number,
  top_p: number,
  frequency_penalty: number,
  presence_penalty: number,
  model: models,
  stop: string[]
}

export interface ParameterType {
  id: string
  name: string,
  description: string,
  created: Date,
  parameters: ParameterPropertiesType,
}

export enum models {
  gpt35 = 'gpt-3.5-turbo',
  gpt35_16 = 'gpt-3.5-turbo-16k',
  gpt4 = 'gpt-4'
}

export interface StringTemplate {
  template: string;
  factory: string[];
}

export interface errorResponse {
  errorMessage: string,
  error: unknown,
}

export interface ResultConnectionType {
  requestId: string,
  resultId: string,
}

export interface ResultCollectionType {
  promptId: string,
  results: {
    [paramId: string]: string[],
  }
}

// result types

export interface TrueAndFalseEvaluatorType {
  true: number,
  false: number,
}

export interface PercentageEvaluatorType {
  true: number,
  false: number,
}

export type EvaluatorResults = TrueAndFalseEvaluatorType | PercentageEvaluatorType;

export interface ResultObject {
  resultId: string,
  resultObject: EvaluatorResults,
  evaluatorName: string,
}