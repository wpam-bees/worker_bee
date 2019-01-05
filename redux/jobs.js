import { api } from '../App';

import { fetchUser } from './user';

const SET_JOBS = 'SET_JOBS';
const SET_ACTIVE_JOBS = 'SET_ACTIVE_JOBS';
const MAKE_ACTIVE = 'MAKE_ACTIVE';
const REMOVE_JOB = 'REMOVE_JOB';
const FETCH = 'FETCH';
const FETCH_FAIL = 'FETCH_FAIL';

export default function reducer(state = { available: [], active: [] }, action) {
    switch (action.type) {
        case SET_JOBS:
            return { ...state, available: [...action.payload.jobs], isLoading: false };
        case SET_ACTIVE_JOBS:
            return { ...state, active: [...action.payload.jobs] };
        case MAKE_ACTIVE:
            return {
                available: state.available.filter(job => job.id !== action.payload.job.id),
                active: [...state.active, action.payload.job],
            };
        case REMOVE_JOB:
            return {
                available: state.available.filter(job => job.id !== action.payload.job.id),
                active: state.active.filter(job => job.id !== action.payload.job.id),
            };
        case FETCH:
            return { ...state, isLoading: true };
        case FETCH_FAIL:
            return { ...state, isLoading: false };
        default:
            return state;
    }
}

function setJobs(jobs) {
    return {
        type: SET_JOBS,
        payload: {
            jobs,
        },
    };
}

function setActiveJobs(jobs) {
    return {
        type: SET_ACTIVE_JOBS,
        payload: {
            jobs,
        },
    };
}

function removeJob(job) {
    return {
        type: REMOVE_JOB,
        payload: {
            job,
        },
    };
}

function makeActive(job) {
    return {
        type: MAKE_ACTIVE,
        payload: {
            job,
        },
    };
}

export function fetchNearbyJobs() {
    return async (dispatch) => {
        dispatch({ type: FETCH });
        try {
            const resp = await api.get('/api/bees/job/nearby/');
            dispatch(setJobs(resp.data));
        } catch (e) {
            console.warn(e);
            dispatch({ type: FETCH_FAIL });
        }
    };
}

export function fetchActiveJobs() {
    return async (dispatch) => {
        dispatch({ type: FETCH });
        try {
            const resp = await api.get('/api/bees/job/active/');
            dispatch(setActiveJobs(resp.data));
        } catch (e) {
            console.warn(e);
            dispatch({ type: FETCH_FAIL });
        }
    };
}

export function markFinished(job) {
    return async (dispatch) => {
        try {
            const resp = await api.post(`/api/bees/job/${job.id}/finish/`);
            if (resp.data.finished) {
                dispatch(removeJob(resp.data));
                dispatch(fetchUser());
            }
            return resp.data;
        } catch (e) {
            console.warn(e);
        }
        return null;
    };
}

export function markAccepted(job) {
    return async (dispatch) => {
        try {
            const resp = await api.post(`/api/bees/job/${job.id}/accept/`);
            await dispatch(makeActive(resp.data));
            return resp.data;
        } catch (e) {
            console.warn(e);
        }
        return null;
    };
}
