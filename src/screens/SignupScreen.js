import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Spacer from '../components/Spacer';
// import { NavigationEvents } from "react-navigation";
import { SafeAreaView } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from '../components/LoadingIndicator';

const FadeInView = props => {
	const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 2000,
		}).start();
	}, []);

	return (
		<Animated.View // Special animatable View
			style={{
				...props.style,
				opacity: fadeAnim, // Bind opacity to animated value
			}}
		>
			{props.children}
		</Animated.View>
	);
};

const BouncyInput = ({
	value,
	onChangeText,
	placeholder = '',
	autoFocus = false,
	autoCapitalize = 'none',
	autoCorrect = false,
	containerStyle = {},
	inputStyle = { color: 'white' },
	returnKeyType = 'next',
	selectTextOnFocus = true,
	onSubmitEditing = null,
	refVal = null,
	onFocus = null,
}) => {
	const [bounceAnim] = useState(new Animated.Value(-50));

	useEffect(() => {
		Animated.timing(bounceAnim, {
			toValue: 0,
			duration: 500,
		}).start();
	}, []);

	console.log('bounceAnim', bounceAnim);

	return (
		<Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
			<Input
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				autoFocus={autoFocus}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				containerStyle={containerStyle}
				inputStyle={inputStyle}
				returnKeyType={returnKeyType}
				selectTextOnFocus={selectTextOnFocus}
				onSubmitEditing={onSubmitEditing}
				ref={ref => (refVal = ref)}
				onFocus={onFocus}
			/>
		</Animated.View>
	);
};

const SignupScreen = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { state, signup, clearErrorMessage } = useContext(AuthContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isFocused, setIsFocused] = useState('');
	// let _passwordInput;

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
				placeholder={isFocused === 'username' ? '' : 'username'}
				value={username}
				onChangeText={setUsername}
				autoFocus={true}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={[styles.input, { borderColor: isFocused === 'username' ? '#0af' : '#fff' }]}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				onSubmitEditing={_next}
				onFocus={e => setIsFocused('username')}
			/>
			<Spacer />
			<BouncyInput
				placeholder={isFocused === 'password' ? '' : 'password'}
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={[styles.input, { borderColor: isFocused === 'password' ? '#0af' : '#fff' }]}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				// ref={ref => (_passwordInput = ref)}
				onFocus={e => setIsFocused('password')}
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
