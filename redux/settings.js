import { api } from '../App';

import { fetchNearbyJobs } from './jobs';

const SET_SETTINGS = 'SET_SETTINGS';

const settingsStub = {
    radius: null,
    minPrice: null,
};

export default function reducer(state = { ...settingsStub }, action) {
    switch (action.type) {
        case SET_SETTINGS:
            return { ...action.payload.settings };
        default:
            return state;
    }
}

function setSettings(settings) {
    return {
        type: SET_SETTINGS,
        payload: {
            settings,
        },
    };
}

export function fetchSettings() {
    return async (dispatch) => {
        try {
            const resp = await api.get('/api/bees/filters/');
            const respSettings = {
                minPrice: resp.data.min_price,
                radius: String(resp.data.radius),
            };
            await dispatch(setSettings(respSettings));
            return respSettings;
        } catch (e) {
            console.warn(e);
        }
        return null;
    };
}

export function saveSettings(settings) {
    return async (dispatch) => {
        try {
            const resp = await api.put(
                '/api/bees/filters/',
                { ...settings },
            );
            const respSettings = {
                minPrice: resp.data.min_price,
                radius: resp.data.radius,
            };
            await dispatch(setSettings(respSettings));
            await dispatch(fetchNearbyJobs());
            return respSettings;
        } catch (e) {
            console.warn(e);
        }
        return null;
    };
}
