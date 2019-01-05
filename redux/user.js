import { api } from '../App';

const SET_USER = 'SET_USER';
const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';

const userStub = {
    username: '',
    location: null,
    balance: '0.0',
};

export default function reducer(state = userStub, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, ...action.payload.user };
        case SET_CURRENT_LOCATION:
            return { ...state, location: action.payload.location };
        default:
            return state;
    }
}

export function setUser(user) {
    return {
        type: SET_USER,
        payload: {
            user,
        },
    };
}

export function setLocation(location) {
    return {
        type: SET_CURRENT_LOCATION,
        payload: {
            location,
        },
    };
}

export function fetchUser() {
    return async (dispatch) => {
        try {
            const resp = await api.get('/api/auth/user/');
            dispatch(setUser(resp.data));
        } catch (e) {
            console.warn(e);
        }
    };
}
