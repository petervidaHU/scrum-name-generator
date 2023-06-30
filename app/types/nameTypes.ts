export type statusType = 'active' | 'deactivated' | 'investigation';

export interface iResult {
  name: string,
  description?: string,
  tags?: string[],
  status: statusType,
};

export interface iResultWithTags extends Omit<iResult, 'tags'>, Required<Pick<iResult, 'tags'>> { }

export interface iResultComplete extends Required<iResult> { }

export type ResultListProperties = keyof iResult;

export type centralizedAPICall = Promise<{ result: iResult[]; error?: never; } | { result?: never; error: string; }>;
