const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const TEST = 'test';

export enum myEnv {
    Dev = DEVELOPMENT,
    Prod = PRODUCTION,
    Test = TEST,
}

export type MyEnv = myEnv.Dev | myEnv.Prod | myEnv.Test;
