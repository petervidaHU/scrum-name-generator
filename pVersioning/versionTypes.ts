export type promptObjectArray = (promptVersionSelection | string)[];

export interface promptVersionType {
  id: string
  promptText: string,
  promptObject: promptObjectArray, 
  created: Date,
  description: string,
  params: string | null,
  result: any[],
}

export interface promptCollectionType {
  id: string, 
  name: string,
  description: string,
  created: Date,
  versions: promptVersionType[],
  defaultParametersId: string,
}

export interface promptVersionSelection {
  collectionId: string,
  versionId: string,
  promptText: string,
}

export interface cursorPositionType {
 textBeforeCursor: string,
 textAfterCursor: string,
 subPromptId: number,
}


// parameters

export interface parameterPropertiesType {
  temperature: number,
  max_tokens: number,
  top_p: number,
  frequency_penalty: number,
  presence_penalty: number,
  model: models,
  stop: string[]
}

export interface parameterType {
  id: string
  name: string,
  description: string,
  created: Date,
  parameters: parameterPropertiesType,
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
  errorMessage : string,
  error: unknown,
}

export interface resultConnectionType {
  requestId: string,
    resultId: string,
}