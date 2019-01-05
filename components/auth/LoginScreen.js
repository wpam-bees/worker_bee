import React, { Component } from 'react';
import {
    StatusBar,
    Text,
    View,
    ImageBackground,
    Button,
    TextInput,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import { connect } from 'react-redux';

import { setToken } from '../../redux/auth';
import { api } from '../../App';
import {
    beesBackground,
    honeyYellow,
    appleRed,
} from '../../assets';

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };

        this._form = null;
    }

    login = async (data) => {
        const { navigate } = this.props.navigation; // eslint-disable-line react/prop-types
        try {
            this.setState({ isLoading: true });
            const resp = await api.post('/api/auth/token/', data);
            this.props.setToken(resp.data.token);
            this.setState({ isLoading: false });
            navigate('App');
        } catch (e) {
            const errors = e.response.data;
            Object.keys(errors).forEach((k) => { errors[k] = errors[k][0]; });
            this._form.setErrors(errors);
            this.setState({ isLoading: false });
            console.warn(errors);
        }
    }

    register = () => {
        const { navigate } = this.props.navigation; // eslint-disable-line react/prop-types
        navigate('Register');
    }

    render() {
        return (
            <ImageBackground
                source={beesBackground}
                style={styles.container}
            >
                <StatusBar
                    barStyle="light-content"
                />
                <Formik
                    initialValues={{ email: '' }}
                    onSubmit={this.login}
                    // validationSchema={SignupSchema}
                    ref={(c) => { this._form = c; }}
                >
                    {props => (
                        <View>
                            <TextInput
                                onChangeText={props.handleChange('username')}
                                onBlur={props.handleBlur('username')}
                                style={styles.input}
                                placeholder="Login"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                textContentType="username"
                            />
                            <TextInput
                                onChangeText={props.handleChange('password')}
                                onBlur={props.handleBlur('password')}
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                textContentType="password"
                                secureTextEntry
                            />
                            {
                                props.errors.non_field_errors
                                && <Text style={styles.errorText}>{props.errors.non_field_errors}</Text>
                            }
                            <View
                                style={styles.controls}
                            >
                                {
                                    !this.state.isLoading ? (
                                        <View>
                                            <Button
                                                onPress={props.handleSubmit}
                                                style={styles.button}
                                                color={honeyYellow}
                                                title="Login"
                                            />
                                            <Text style={styles.text}>or</Text>
                                            <Button
                                                style={styles.button}
                                                color={honeyYellow}
                                                title="Create new account"
                                                onPress={this.register}
                                            />
                                        </View>
                                    ) : <ActivityIndicator color={honeyYellow} size="large" />
                                }
                            </View>
                        </View>
                    )}
                </Formik>
                <Text>{this.props.token}</Text>
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
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    input: {
        color: '#FFFFFF',
        height: 40,
        width: 300,
        fontSize: 20,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: honeyYellow,
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    text: {
        color: '#FFFFFF',
        marginVertical: 10,
        textAlign: 'center',
    },
    button: {
        fontSize: 20,
    },
    errorText: {
        color: appleRed,
        textAlign: 'center',
        marginBottom: 10,
    },
});

const mapStateToProps = state => ({
    token: state.token,
});


const mapDispatchToProps = {
    setToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
