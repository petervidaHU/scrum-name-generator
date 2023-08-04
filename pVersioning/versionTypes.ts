export interface promptProperties {
  pText: string,
  v: number,
  created: Date,
  description: string,
}

export interface promptType {
  [k: string]: promptProperties,
}

export interface promptCollectionType {
  id: string, 
  name: string,
  description: string,
  created: Date,
  prompts: promptType,
}
