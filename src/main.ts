export const delayMillis = (delayMs: number): Promise<void> => new Promise(resolve => setTimeout(resolve, delayMs));

export const greet = (name: string): string => `Hello ${name}`

export const foo = async (): Promise<boolean> => {
  console.log(greet('World'))
  await delayMillis(1000)
  console.log('done')
  return true
}

// import { v4 as uuid } from 'uuid';
export type ScriptSkeleton = {
  _id: string;
  name: string;
  description: string;
  default: boolean;
  script: {},
  language: string;
  context: string;
  createdBy: string;
  creationDate: number;
  lastModifiedBy: string;
  lastModifiedDate: number;
};

export const idReplacer = (scripts: ScriptSkeleton, guid: Function): string => {
  console.log(scripts)
  return guid();
};