import { errorResponse, ParameterType, PromptCollectionType, PromptVersionType, ResultObject } from './versionTypes';

export interface DBInterface {
  getList()
    : Promise<PromptCollectionType[]>,

  getOnePromptCollection(
    id: string,
  )
    : Promise<PromptCollectionType | {}>,

  initializePrompt(
    p: PromptCollectionType,
  )
    : void,

  savePromptVersion(
    collectionId: string,
    p: PromptVersionType,
  )
    : Promise<any>,

  getParametersList()
    : Promise<ParameterType[]>,

  saveOneParameter(
    newParameter: ParameterType,
  )
    : void,

  getOneParameter(
    parameterId: string,
  )
    : Promise<ParameterType>,

  createResult(
    collectionId: string,
    paramId: string,
    resultId: string,
  )
    : Promise<string>,

  getVersions(
    ids: string[],
  )
    : Promise<PromptVersionType[]>,

  initializeResultCollection(
    requestId: string,
    content: any,
  )
    : Promise<any>,

  getResultCollection(
    promptId: string,
  )
    : Promise<boolean>,

  saveResult(
    resultObject: ResultObject
  )
    : void,
}

