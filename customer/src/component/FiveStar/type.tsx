import { SMALLER, EQUAL, LARGER, HALF_STAR, STAR, STAR_COLOR, EMPTY_STAR_COLOR } from './const';

export type fiveStar_prop = {
    rate?: number;
};

export type rate_status_type = typeof SMALLER | typeof EQUAL | typeof LARGER;

const _SMALLER = SMALLER;
const _EQUAL = EQUAL;
const _LARGER = LARGER;
export enum rate_status_enum {
    SMALLER = _SMALLER,
    EQUAL = _EQUAL,
    LARGER = _LARGER,
}

type star_type = typeof STAR | typeof HALF_STAR;
type star_color_type = typeof STAR_COLOR | typeof EMPTY_STAR_COLOR;
export interface star_prop {
    color: star_color_type;
    type: star_type;
}

const _STAR = STAR;
const _HALF_STAR = HALF_STAR;
export enum star_types {
    STAR = _STAR,
    HALF_STAR = _HALF_STAR,
}

const _STAR_COLOR = STAR_COLOR;
const _EMPTY_STAR_COLOR = EMPTY_STAR_COLOR;
export enum star_color_types {
    STAR_COLOR = _STAR_COLOR,
    EMPTY_STAR_COLOR = _EMPTY_STAR_COLOR,
}
