export interface promptProperties {
  pText: string,
  v: number,
  created: Date,
}

export interface promptType {
  [k: string]: promptProperties,
}
