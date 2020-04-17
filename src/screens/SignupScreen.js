import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Text, Button } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { SafeAreaView } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from '../components/LoadingIndicator';
import FadeInView from '../components/FadeInView';
import BouncyInput from '../components/BouncyInput';
import AuthForm from '../components/AuthForm';

const SignupScreen = () => {
	// const [username, setUsername] = useState('');
	// const [password, setPassword] = useState('');
	// const [avatar, setAvatar] = useState('');
	const { state, signup, clearErrorMessage } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	// const _passwordInput = useRef();

	// const _next = () => {
	// 	// use _passwordInput.current.focus instead of _passwordInput.focus
	// 	_passwordInput && _passwordInput.current.focus();
	// };

	const handleSignup = ({ username, password, avatar }) => {
		setIsLoading(true);
		signup({ username, password, avatar: avatar });
	};

	useEffect(() => {
		if (state.errorMessage) setIsLoading(false);
	}, [state]);

	if (isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<View style={styles.container}>
			<NavigationEvents onWillBlur={clearErrorMessage} />
			<AuthForm
				headerText="Sign Up"
				errorMessage={state.errorMessage}
				submitButtonText="Create User"
				onSubmit={handleSignup}
				isSignup={true}
			/>
			<NavLink routeName="Signin" text="Back to Sign In" />
		</View>
	);
};

SignupScreen.navigationOptions = () => {
	return {
		header: null,
	};
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		backgroundColor: '#000',
		color: 'white',
	},
	errorMessage: {
		fontSize: 16,
		color: 'red',
		marginLeft: 15,
		marginTop: 15,
	},
	input: {
		width: '75%',
		alignSelf: 'center',
	},
});

export default SignupScreen;
