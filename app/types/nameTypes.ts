type statusType = true | false | 'investigation'; 

export interface iResult{
  name: string,
  tags?: string[],
  options?: {
    active: statusType,
  },
};

export interface iResultWithTags extends Omit<iResult, 'tags'>, Pick<iResult, 'tags'> {}

export interface iResultComplete extends Required<iResult> {}
