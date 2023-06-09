type apiCallResult = 'error' | 'ok';

export interface iResult {
  message: apiCallResult | null,
  data: string[],
};
