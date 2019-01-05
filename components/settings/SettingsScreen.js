import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Divider, ListItem } from 'react-native-elements';

import { resetToken } from '../../redux/auth';
import { saveSettings, fetchSettings } from '../../redux/settings';

import { appleRed, backgroundColor } from '../../assets';
import { api } from '../../App';


class SettingsScreen extends Component {
    static navigationOptions = {
        headerStyle: {
            height: 20,
        },
    };

    constructor(props) {
        super(props);

        this.state = {
            settings: { ...props.settings },
        };
    }

    componentDidMount() {
        this.getSettings();
    }

    logOut = () => {
        const { resetToken, navigation } = this.props;
        resetToken();
        navigation.navigate('Login');
    }

    getSettings = async () => {
        const { fetchSettings } = this.props;
        const respData = await fetchSettings();
        if (respData) {
            this.setState({ settings: respData });
        }
    }

    setSettings = (kwarg) => {
        const { settings } = this.state;
        this.setState({ settings: { ...settings, ...kwarg } });
    }

    pushToServer = async () => {
        const { settings } = this.state;
        const { saveSettings } = this.props;
        const respData = await saveSettings(settings);
        if (respData) {
            this.setState({ settings: respData });
        }
    }

    render() {
        const { navigation, balance } = this.props;
        const { settings } = this.state;
        return (
            <ScrollView style={styles.container}>
                <Divider style={styles.separator} />
                <ListItem
                    containerStyle={styles.listItemContainer}
                    title="Your balance"
                    rightTitle={`${balance} zł`}
                    hideChevron
                />
                <Divider style={styles.separator} />
                <Divider style={styles.divider} />
                <Divider style={styles.separator} />
                <ListItem
                    containerStyle={styles.listItemContainer}
                    title="Search radius [km]"
                    textInputKeyboardType="decimal-pad"
                    textInputOnChangeText={value => this.setSettings({ radius: value })}
                    textInputOnBlur={this.pushToServer}
                    textInputValue={settings.radius}
                    textInput
                    hideChevron
                />
                <Divider style={styles.separator} />
                <ListItem
                    containerStyle={styles.listItemContainer}
                    title="Minimal price"
                    textInputKeyboardType="decimal-pad"
                    textInputOnChangeText={value => this.setSettings({ minPrice: value })}
                    textInputOnBlur={this.pushToServer}
                    textInputValue={settings.minPrice}
                    textInput
                    hideChevron
                />
                <Divider style={styles.separator} />
                <ListItem
                    title="Add group"
                    containerStyle={styles.listItemContainer}
                    onPress={() => navigation.navigate('SettingsGroups')}
                />
                <Divider style={styles.separator} />
                <Divider style={styles.divider} />
                <Divider style={styles.separator} />
                <ListItem
                    title="Log Out"
                    hideChevron
                    containerStyle={styles.listItemContainer}
                    titleStyle={{
                        color: appleRed,
                        textAlign: 'center',
                    }}
                    onPress={this.logOut}
                />
                <Divider style={styles.separator} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: 'transparent',
    },
    listItemContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 0,
    },
    divider: {
        backgroundColor,
        height: 20,
    },
});

const mapStateToProps = state => ({
    settings: state.settings,
    balance: state.user.balance,
});


const mapDispatchToProps = {
    resetToken,
    saveSettings,
    fetchSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
