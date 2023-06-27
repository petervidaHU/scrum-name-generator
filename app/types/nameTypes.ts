export type statusType = true | false | 'investigation'; 

export interface iResult{
  name: string,
  description?: string,
  tags?: string[],
  options?: {
    active: statusType,
  },
};

export interface iResultWithTags extends Omit<iResult, 'tags' >, Required<Pick<iResult, 'tags'>> {}

export interface iResultComplete extends Required<iResult> {}

export type ResultListProperties = keyof iResult;