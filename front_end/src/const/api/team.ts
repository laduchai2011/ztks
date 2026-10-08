import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const TEAM_API = {
    GET_TEAMS: `${BASE_URL}${apiString}/service__team/query/get_teams`,
    GET_TEAM_MEMBERS: `${BASE_URL}${apiString}/service__team/query/get_team_members`,
    GET_TEAM_BY_ID: `${BASE_URL}${apiString}/service__team/query/get_team_by_id`,
    GET_TEAM_LEADER: `${BASE_URL}${apiString}/service__team/query/get_team_leader`,
    CREATE_TEAM: `${BASE_URL}${apiString}/service__team/mutate/create_team`,
    ADD_TEAM_MEMBER: `${BASE_URL}${apiString}/service__team/mutate/add_team_member`,
    LOCK_TEAM: `${BASE_URL}${apiString}/service__team/mutate/lock_team`,
    LOCK_TEAM_MEMBER: `${BASE_URL}${apiString}/service__team/mutate/lock_team_member`,
    EDIT_TEAM: `${BASE_URL}${apiString}/service__team/mutate/edit_team`,
    DELETE_TEAM: `${BASE_URL}${apiString}/service__team/mutate/delete_team`,
    DELETE_TEAM_MEMBER: `${BASE_URL}${apiString}/service__team/mutate/delete_team_member`,
};
