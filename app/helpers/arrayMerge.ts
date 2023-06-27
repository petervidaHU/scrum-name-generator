export const arrayMerge = (arr1: any[], arr2: any[]) => arr1.map(obj1 => {
  const obj2 = arr2.find(obj2 => obj2.name === obj1.name);
  return { ...obj1, ...obj2 };
});