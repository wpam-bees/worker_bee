import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk';

import AuthReducer from './auth';
import User from './user';
import Jobs from './jobs';
import Groups from './groups';
import Settings from './settings';

const reducers = combineReducers({
    auth: persistReducer({ key: 'beesAuth', storage }, AuthReducer),
    user: User,
    jobs: Jobs,
    groups: Groups,
    settings: Settings,
});

export const store = createStore(
    reducers,
    applyMiddleware(thunk),
);

export const persistor = persistStore(store);
