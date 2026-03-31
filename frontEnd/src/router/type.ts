import {
    HOME,
    SIGNUP,
    SIGNIN,
    SIGNOUT,
    FORGET_PASSWORD,
    MESSAGE,
    SUPPORT_ROOM,
    PROFILE,
    NOTE,
    OA,
    OA_SETTING,
    ORDER,
    ACCOUNT_RECEIVE_MESSAGE,
    MANAGE_AGENT,
    MEMBER,
} from '@src/const/text';

const _HOME = HOME;
const _SIGNUP = SIGNUP;
const _SIGNIN = SIGNIN;
const _SIGNOUT = SIGNOUT;
const _FORGET_PASSWORD = FORGET_PASSWORD;
const _MESSAGE = MESSAGE;
const _MESSAGE1 = MESSAGE;
const _SUPPORT_ROOM = SUPPORT_ROOM;
const _NOTE = NOTE;
const _PROFILE = PROFILE;
const _OA = OA;
const _OA_SETTING = OA_SETTING;
const _ORDER = ORDER;
const _ACCOUNT_RECEIVE_MESSAGE = ACCOUNT_RECEIVE_MESSAGE;
const _MANAGE_AGENT = MANAGE_AGENT;
const _MEMBER = MEMBER;

export enum select_enum {
    HOME = _HOME,
    SIGNUP = _SIGNUP,
    SIGNIN = _SIGNIN,
    SIGNOUT = _SIGNOUT,
    FORGET_PASSWORD = _FORGET_PASSWORD,
    MESSAGE = _MESSAGE,
    MESSAGE1 = _MESSAGE1,
    SUPPORT_ROOM = _SUPPORT_ROOM,
    NOTE = _NOTE,
    PROFILE = _PROFILE,
    OA = _OA,
    OA_SETTING = _OA_SETTING,
    ORDER = _ORDER,
    ACCOUNT_RECEIVE_MESSAGE = _ACCOUNT_RECEIVE_MESSAGE,
    MANAGE_AGENT = _MANAGE_AGENT,
    MEMBER = _MEMBER,
}
export type selected_type =
    | select_enum.HOME
    | select_enum.SIGNUP
    | select_enum.SIGNIN
    | select_enum.SIGNOUT
    | select_enum.FORGET_PASSWORD
    | select_enum.MESSAGE
    | select_enum.MESSAGE1
    | select_enum.SUPPORT_ROOM
    | select_enum.NOTE
    | select_enum.PROFILE
    | select_enum.OA
    | select_enum.OA_SETTING
    | select_enum.ORDER
    | select_enum.ACCOUNT_RECEIVE_MESSAGE
    | select_enum.MANAGE_AGENT
    | select_enum.MEMBER;

export enum route_enum {
    HOME = '/',
    SIGNUP = '/signup',
    SIGNIN = '/signin',
    SIGNOUT = '/signout',
    FORGET_PASSWORD = '/forget_password',
    MESSAGE = '/message',
    MESSAGE1 = '/message1',
    SUPPORT_ROOM = '/support_room',
    NOTE = '/note',
    PROFILE = '/profile',
    // MEMBER_RECEIVE_MESSAGE = '/member_receive_message',
    // MANAGE_MEMBERS = '/manage_members',
    OA = '/oa',
    OA_SETTING = '/oa_setting',
    ORDER = '/order',
    ACCOUNT_RECEIVE_MESSAGE = '/account_receive_message',
    MANAGE_AGENT = '/manage_agent',
    MEMBER = '/member',
}
export type routed_type =
    | route_enum.HOME
    | route_enum.SIGNUP
    | route_enum.SIGNIN
    | route_enum.SIGNOUT
    | route_enum.FORGET_PASSWORD
    | route_enum.MESSAGE
    | route_enum.MESSAGE1
    | route_enum.SUPPORT_ROOM
    | route_enum.NOTE
    // | route_enum.MEMBER_RECEIVE_MESSAGE
    // | route_enum.MANAGE_MEMBERS
    | route_enum.PROFILE
    | route_enum.OA
    | route_enum.OA_SETTING
    | route_enum.ORDER
    | route_enum.ACCOUNT_RECEIVE_MESSAGE
    | route_enum.MANAGE_AGENT
    | route_enum.MEMBER;
