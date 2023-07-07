export type statusType = 'active' | 'deactivated' | 'investigation';

export interface iNameItem {
  name: string,
  description?: string,
  tags?: string[],
  status?: statusType,
};

export interface iNameItemWithTags extends Omit<iNameItem, 'tags'>, Required<Pick<iNameItem, 'tags'>> { }

export interface iNameItemComplete extends Required<iNameItem> { }

export type NameItemProperties = keyof iNameItem;

export type centralizedAPICall = Promise<{ result: iNameItem[]; error?: never; } | { result?: never; error: string; }>;
