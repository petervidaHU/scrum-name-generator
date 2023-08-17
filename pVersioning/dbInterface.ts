import { errorResponse, parameterType, promptCollectionType, promptVersionType } from './versionTypes';

export interface DBInterface {
  getList(): Promise<promptCollectionType[]>,
  getOnePromptCollection(id: string): Promise<promptCollectionType | {}>,
  initializePrompt(p: promptCollectionType): void,
  savePromptVersion(collectionId: string, p: promptVersionType): Promise<any>,
  getParametersList(): Promise<parameterType[]>,
  saveOneParameter(newParameter: parameterType): void,
  getOneParameter(parameterId: string): Promise<parameterType>,
  createResult(promptId: string, resultId: string): void,
  getVersions(ids: string[]): Promise<promptVersionType[]>,
  initializeResultCollection(requestId: string, content: any): Promise<any>,
  getResultCollection(promptId: string, paramId: string): Promise<any>, 
  createResultId(collection: string): Promise<string>,
}

