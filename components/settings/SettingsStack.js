import { createStackNavigator } from 'react-navigation';

import Settings from './SettingsScreen';
import GroupsModal from './GroupsModal';

export default createStackNavigator(
    {
        Settings,
        SettingsGroups: GroupsModal,
    },
);
