import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import MapScreen from './jobsMap/MapScreen.js';
import SettingsScreen from './settings/SettingsStack';
import ListScreen from './jobsList/ListScreen.js';

import LocationWatcher from './LocationWatcher';
import JobsWatcher from './JobsWatcher';

const Nav = createBottomTabNavigator(
    {
        Map: MapScreen,
        List: ListScreen,
        Settings: SettingsScreen,
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Map') {
                    iconName = 'map';
                } else if (routeName === 'List') {
                    iconName = 'list-ul';
                } else if (routeName === 'Settings') {
                    iconName = 'wrench';
                }

                return <FontAwesome name={iconName} size={20} color={tintColor} />;
            },
        }),
    },
);

export default class AppScreen extends Component {
    static router = Nav.router;

    render() {
        const { navigation } = this.props;
        return (
            <View style={StyleSheet.absoluteFill}>
                <JobsWatcher />
                <LocationWatcher />
                <Nav navigation={navigation} />
            </View>
        );
    }
}
