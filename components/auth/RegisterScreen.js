import React, { Component } from 'react';
import { StyleSheet, ImageBackground, TextInput, Button, Text, ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView, Header } from 'react-navigation';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';

import { api } from '../../App';
import { setToken } from '../../redux/auth';

import { beesBackground, honeyYellow, appleRed } from '../../assets';

const requiredValidator = {
    validator: (args) => {
        if (!args || args[0] === undefined) {
            return false;
        }
        return true;
    },
    message: '{TITLE} is required',
};

const formValidators = {
    username: {
        title: 'Username',
        validate: [
            requiredValidator,
            {
                validator: 'isLength',
                arguments: [3, 32],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
            },
        ],
    },
    firstName: {
        title: 'First name',
        validate: [requiredValidator],
    },
    lastName: {
        title: 'Last name',
        validate: [requiredValidator],
    },
    email: {
        title: 'Email',
        validate: [
            requiredValidator,
            { validator: 'isEmail' },
        ],
    },
    password: {
        title: 'Password',
        validate: [requiredValidator],
    },
    password2: {
        validate: [
            {
                validator: (...args) => {
                    if (args[0] === GiftedFormManager.getValue('registerForm', 'password')) {
                        return true;
                    }
                    return false;
                },
                message: 'Passwords must be the same',
            },
        ],
    },
};

const SignupSchema = Yup.object().shape({
    username: Yup.string()
        .required('This field is required'),
    firstName: Yup.string()
        .required('This field is required'),
    lastName: Yup.string()
        .required('This field is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('This field is required'),
    password: Yup.string()
        .required('This field is required'),
    password2: Yup.string()
        .required('This field is required'),
});


class RegisterScreen extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            title: 'Register',
        };
    }

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
        };

        this._form = null;
    }

    register = async (values) => {
        const { setToken, navigation } = this.props;
        try {
            this.setState({ isLoading: true });
            const resp = await api.post(
                '/api/auth/new/',
                { ...values },
            );
            setToken(resp.data);
            this.setState({ isLoading: false });
            navigation.navigate('SettingsGroups');
        } catch (e) {
            console.error(e)
            const errors = e.response.data;
            Object.keys(errors).forEach((k) => { errors[k] = errors[k][0]; });
            this._form.setErrors(errors);
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <ImageBackground
                source={beesBackground}
                style={styles.container}
            >
                <SafeAreaView style={styles.formWrapper}>
                    <Formik
                        initialValues={{ email: '' }}
                        onSubmit={this.register}
                        validationSchema={SignupSchema}
                        ref={(c) => { this._form = c; }}
                    >
                        {props => (
                            <KeyboardAwareScrollView
                                contentContainerStyle={styles.container}
                                showsVerticalScrollIndicator={false}
                            >
                                <TextInput
                                    onChangeText={props.handleChange('username')}
                                    onBlur={props.handleBlur('username')}
                                    placeholder="Username"
                                    textContentType="username"
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    value={props.values.username}
                                    style={styles.input}
                                />
                                {
                                    props.errors.username
                                    && props.touched.username
                                    && <Text style={styles.errorText}>{props.errors.username}</Text>
                                }
                                <TextInput
                                    onChangeText={props.handleChange('firstName')}
                                    onBlur={props.handleBlur('firstName')}
                                    placeholder="First Name"
                                    textContentType="name"
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    value={props.values.firstName}
                                    style={styles.input}
                                />
                                {
                                    props.errors.firstName
                                    && props.touched.firstName
                                    && <Text style={styles.errorText}>{props.errors.firstName}</Text>
                                }
                                <TextInput
                                    onChangeText={props.handleChange('lastName')}
                                    onBlur={props.handleBlur('lastName')}
                                    placeholder="Last Name"
                                    textContentType="familyName"
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    value={props.values.lastName}
                                    style={styles.input}
                                />
                                {
                                    props.errors.lastName
                                    && props.touched.lastName
                                    && <Text style={styles.errorText}>{props.errors.lastName}</Text>
                                }
                                <TextInput
                                    onChangeText={props.handleChange('email')}
                                    onBlur={props.handleBlur('email')}
                                    placeholder="Email"
                                    textContentType="emailAddress"
                                    keyboardType="email-address"
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    value={props.values.email}
                                    style={styles.input}
                                />
                                {
                                    props.errors.email
                                    && props.touched.email
                                    && <Text style={styles.errorText}>{props.errors.email}</Text>
                                }
                                <TextInput
                                    onChangeText={props.handleChange('password')}
                                    onBlur={props.handleBlur('password')}
                                    placeholder="Password"
                                    textContentType="password"
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    value={props.values.password}
                                    style={styles.input}
                                    secureTextEntry
                                />
                                {
                                    props.errors.password
                                    && props.touched.password
                                    && <Text style={styles.errorText}>{props.errors.password}</Text>
                                }
                                <TextInput
                                    onChangeText={props.handleChange('password2')}
                                    onBlur={props.handleBlur('password2')}
                                    placeholder="Repeat Password"
                                    textContentType="password"
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    value={props.values.password2}
                                    style={styles.input}
                                    secureTextEntry
                                />
                                {
                                    props.errors.password2
                                    && props.touched.password2
                                    && <Text style={styles.errorText}>{props.errors.password2}</Text>
                                }
                                <View style={styles.submitWrapper}>
                                    {
                                        !this.state.isLoading ? (
                                            <Button
                                                onPress={props.handleSubmit}
                                                style={styles.button}
                                                color={honeyYellow}
                                                title="Submit"
                                            />
                                        ) : <ActivityIndicator color={honeyYellow} size="large" />
                                    }
                                </View>
                            </KeyboardAwareScrollView>
                        )}
                    </Formik>
                </SafeAreaView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formWrapper: {
        marginTop: Header.HEIGHT,
        flex: 1,
        alignItems: 'center',
    },
    form: {
        backgroundColor: 'transparent',
    },
    input: {
        color: '#FFFFFF',
        height: 40,
        width: 300,
        fontSize: 20,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: honeyYellow,
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    errorText: {
        textAlign: 'left',
        color: appleRed,
    },
    submitWrapper: {
        padding: 20,
    },
});


const mapDispatchToProps = {
    setToken,
};

export default connect(null, mapDispatchToProps)(RegisterScreen);
