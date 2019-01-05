import React, { Component } from 'react';
import {
    ImageBackground,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

import { fetchUser } from '../../redux/user';

import {
    honeyYellow,
    beesBackground,
} from '../../assets';

class AuthScreen extends Component {
    constructor(props) {
        super(props);
        this.getToken();
    }

    // Tries to get token from AsyncStorage
    getToken = async () => {
        const { token, fetchUser } = this.props;
        if (token) {
            await fetchUser();
        }
        this.props.navigation.navigate(token ? 'App' : 'Login'); // eslint-disable-line react/prop-types
    }

    render() {
        return (
            <ImageBackground
                style={styles.container}
                source={beesBackground}
            >
                <ActivityIndicator
                    size="large"
                    color={honeyYellow}
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const mapDispatchToProps = {
    fetchUser,
};

const mapStateToProps = state => ({
    token: state.auth.token,
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
