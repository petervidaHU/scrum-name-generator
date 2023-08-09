export type promptObjectArray = (promptVersionSelection | string)[];

export interface promptVersionType {
  id: string
  promptText: string,
  promptObject: promptObjectArray, 
  created: Date,
  description: string,
}
/*  export interface promptType {
  [k: string]: promptPieceType,
}  */

export interface promptCollectionType {
  id: string, 
  name: string,
  description: string,
  created: Date,
  versions: promptVersionType[],
}

export interface promptVersionSelection {
  collectionId: string,
  versionId: number,
}

export interface cursorPositionType {
 textBeforeCursor: string,
 textAfterCursor: string,
 subPromptId: number,
}

