import { createStackNavigator } from 'react-navigation';

import Login from './LoginScreen';
import Register from './RegisterScreen';

import { honeyYellow } from '../../assets';

export default createStackNavigator(
    {
        Login,
        Register,
    },
    {
        navigationOptions: {
            headerTransparent: true,
            headerTintColor: honeyYellow,
        },
    },
);
