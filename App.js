import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import axios from 'axios';

import { store, persistor } from './redux/index';
import { resetToken } from './redux/auth';

import NavigationService from './navigator';

import AppScreen from './components/AppScreen.js';
import AuthScreen from './components/auth/AuthScreen.js';
import LoginStack from './components/auth/LoginStack';

const Navigator = createSwitchNavigator({
    Auth: { screen: AuthScreen },
    Login: { screen: LoginStack },
    App: { screen: AppScreen },
});

export const api = axios.create({
    baseURL: 'https://wpam-bees.herokuapp.com/',
    // baseURL: 'http://localhost:8000/',
    responseType: 'json',
});

api.interceptors.request.use(
    (config) => {
        const { auth: { token }, user: { location } } = store.getState();
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Token ${token}`,
            };
        }
        if (location) {
            config.headers = {
                ...config.headers,
                Geolocation: JSON.stringify({
                    lat: location.latitude,
                    lon: location.longitude,
                }),
            };
        }
        return config;
    },
    error => Promise.reject(error),
);

api.interceptors.response.use(
    null,
    (error) => {
        if (error.response.status === 401) {
            store.dispatch(resetToken());
            NavigationService.navigate('Login');
        }
        return Promise.reject(error);
    },
);

export default () => (
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
            <View style={StyleSheet.absoluteFill}>
                <Navigator
                    ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
                />
            </View>
        </PersistGate>
    </Provider>
);
