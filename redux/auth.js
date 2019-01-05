export const SET_TOKEN = 'SET_TOKEN';
export const RESET_TOKEN = 'RESET_TOKEN';

export default function reducer(state = { token: null }, action) {
    switch (action.type) {
        case SET_TOKEN:
            return { ...state, token: action.payload.token };
        case RESET_TOKEN:
            return { ...state, token: null };
        default:
            return state;
    }
}

export function setToken(token) {
    return {
        type: SET_TOKEN,
        payload: {
            token,
        },
    };
}

export function resetToken() {
    return {
        type: RESET_TOKEN,
    };
}
