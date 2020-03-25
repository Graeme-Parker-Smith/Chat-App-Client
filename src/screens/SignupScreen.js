import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { SafeAreaView } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from '../components/LoadingIndicator';
import FadeInView from '../components/FadeInView';
import BouncyInput from '../components/BouncyInput';

const SignupScreen = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { state, signup, clearErrorMessage } = useContext(AuthContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const _passwordInput = useRef();

	const _next = () => {
		// use _passwordInput.current.focus instead of _passwordInput.focus
		_passwordInput && _passwordInput.current.focus();
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
				<FadeInView>
					<Text style={{ color: 'white', alignSelf: 'center', fontFamily: 'Snell Roundhand' }} h3>
						Sign Up
					</Text>
				</FadeInView>
				{/* <Text style={{ color: 'white', alignSelf: 'center', fontFamily: 'Savoye LET' }} h3>
					Sign Up
				</Text> */}
			</Spacer>
			<BouncyInput
				placeholder={'username'}
				value={username}
				onChangeText={setUsername}
				autoFocus={true}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={styles.input}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				onSubmitEditing={_next}
			/>
			<Spacer />
			<BouncyInput
				placeholder={'password'}
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={styles.input}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				// ref={ref => (_passwordInput = ref)}
				ref={_passwordInput}
			/>
			<Spacer />
			<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'User'} displayName={username} />
			{state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
			<Spacer />
			<Button title="Register User" disabled={!username || !password} onPress={handleSignup} />
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
		alignSelf: 'center',
	},
});

export default SignupScreen;
