import { api } from '../App';

import { fetchNearbyJobs } from './jobs';

const SET_GROUPS = 'SET_GROUPS';
const SET_ACTIVE = 'SET_ACTIVE';

export default function reducer(state = [], action) {
    switch (action.type) {
        case SET_GROUPS:
            return [...action.payload.groups];
        case SET_ACTIVE:
            return state.map((group) => {
                return group.id === action.payload.group.id ? { ...group, active: action.payload.value } : group;
            });
        default:
            return state;
    }
}

function setGroups(groups) {
    return {
        type: SET_GROUPS,
        payload: {
            groups,
        },
    };
}

function setGroupActive(group, value) {
    return {
        type: SET_ACTIVE,
        payload: {
            group,
            value,
        },
    };
}

export function fetchGroups() {
    return async (dispatch) => {
        try {
            const resp = await api.get('/api/bees/category/');
            await dispatch(setGroups(resp.data));
        } catch (e) {
            console.warn(e);
        }
    };
}

export function toggleGroup(group, value) {
    return async (dispatch) => {
        dispatch(setGroupActive(group, value));
        try {
            const resp = await api.post(
                `/api/bees/category/${group.id}/mark_interest/`,
                { interested: value },
            );
            await dispatch(setGroupActive(group, resp.data));
            await dispatch(fetchNearbyJobs());
        } catch (e) {
            console.warn(e);
        }
    };
}
