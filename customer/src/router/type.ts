import { HOME, SIGNUP, SIGNIN, SIGNOUT, VOUCHER, ORDER, FORGET_PASSWORD, POST_DETAIL } from '@src/const/text';

const _HOME = HOME;
const _SIGNUP = SIGNUP;
const _SIGNIN = SIGNIN;
const _SIGNOUT = SIGNOUT;
const _FORGET_PASSWORD = FORGET_PASSWORD;
const _VOUCHER = VOUCHER;
const _ORDER = ORDER;
const _POST_DETAIL = POST_DETAIL;

export enum select_enum {
    HOME = _HOME,
    SIGNUP = _SIGNUP,
    SIGNIN = _SIGNIN,
    SIGNOUT = _SIGNOUT,
    FORGET_PASSWORD = _FORGET_PASSWORD,
    VOUCHER = _VOUCHER,
    ORDER = _ORDER,
    POST_DETAIL = _POST_DETAIL,
}
export type selected_type =
    | select_enum.HOME
    | select_enum.SIGNUP
    | select_enum.SIGNIN
    | select_enum.SIGNOUT
    | select_enum.FORGET_PASSWORD
    | select_enum.VOUCHER
    | select_enum.ORDER
    | select_enum.POST_DETAIL;

export enum route_enum {
    HOME = '/',
    SIGNUP = '/signup',
    SIGNIN = '/signin',
    SIGNOUT = '/signout',
    FORGET_PASSWORD = '/forget_password',
    VOUCHER = '/voucher',
    ORDER = '/order',
    POST_DETAIL = 'post_detail',
}
export type routed_type =
    | route_enum.HOME
    | route_enum.SIGNUP
    | route_enum.SIGNIN
    | route_enum.SIGNOUT
    | route_enum.FORGET_PASSWORD
    | route_enum.VOUCHER
    | route_enum.ORDER
    | route_enum.POST_DETAIL;
