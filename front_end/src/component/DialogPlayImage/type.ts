import { ALL, PLAY, LIST } from '@src/const/text';

export const options_enum = {
    ALL,
    PLAY,
    LIST,
} as const;

export type selectedOptions_type = (typeof options_enum)[keyof typeof options_enum];
