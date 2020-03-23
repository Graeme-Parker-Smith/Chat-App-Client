import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Spacer from '../components/Spacer';
// import { NavigationEvents } from "react-navigation";
import { SafeAreaView } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from '../components/LoadingIndicator';

const SignupScreen = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { state, signup, clearErrorMessage } = useContext(AuthContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isFocused, setIsFocused] = useState('');

	const _next = () => {
		_passwordInput && _passwordInput.focus();
	};

	const handleSignup = () => {
		setIsLoading(true);
		signup({ username, password, avatar: avatar.base64Uri });
	};

	useEffect(() => {
		if (state.errorMessage) setIsLoading(false);
	}, [state]);

	if (isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
			<Spacer>
				<Text style={{ color: 'white', alignSelf: 'center' }} h3>
					Sign Up
				</Text>
			</Spacer>
			<Input
				// label={isFocused === 'username' ? "username" : ""}
				placeholder={isFocused === 'username' ? "" : 'username'}
				value={username}
				onChangeText={setUsername}
				autoFocus={true}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={[styles.input, {borderColor: isFocused === 'username' ? '#0af' : '#fff'}]}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				onSubmitEditing={_next}
				ref={ref => (_usernameInput = ref)}
				onFocus={e => setIsFocused('username')}
			/>
			<Spacer />
			<Input
				// label="Password"
				placeholder={isFocused === 'password' ? "" : 'password'}
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={[styles.input, {borderColor: isFocused === 'password' ? '#0af' : '#fff'}]}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				ref={ref => (_passwordInput = ref)}
				onFocus={e => setIsFocused('password')}
			/>
			<Spacer />
			<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'User'} displayName={username} />
			{state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
			<Spacer>
				<Button title="Register User" disabled={!username || !password} onPress={handleSignup} />
			</Spacer>
			<NavLink routeName="Signin" text="Go back to Sign In" />
		</SafeAreaView>
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
		borderWidth: 1,
		borderRadius: 10,
		// borderColor: '#fff',
		alignSelf: 'center',
	},
});

export default SignupScreen;
