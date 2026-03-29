import dotenv from 'dotenv';
import { myEnv, MyEnv } from './type';

dotenv.config();

export function getEnv(): MyEnv {
    const env = process.env.NODE_ENV as MyEnv;
    switch (env) {
        case myEnv.Dev: {
            return myEnv.Dev;
        }
        case myEnv.Prod: {
            return myEnv.Prod;
        }
        case myEnv.Test: {
            return myEnv.Test;
        }
        default: {
            return myEnv.Dev;
        }
    }
}

export const dev_prefix = getEnv() === myEnv.Dev ? 'dev' : '';
