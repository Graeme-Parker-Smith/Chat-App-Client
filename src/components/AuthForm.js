import React, { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import FadeInView from '../components/FadeInView';
import BouncyInput from '../components/BouncyInput';
import WhiteText from '../components/WhiteText';
import Spacer from './Spacer';

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText }) => {
	const [username, setusername] = useState('');
	const [password, setPassword] = useState('');
	const _usernameInput = useRef();
	const _passwordInput = useRef();

	const _next = () => {
		_passwordInput && _passwordInput.focus();
	};

	return (
		<>
			<Spacer>
				<FadeInView>
					<WhiteText h3>{headerText}</WhiteText>
				</FadeInView>
			</Spacer>
			<BouncyInput
				placeholder="username"
				value={username}
				autoFocus={true}
				onChangeText={setusername}
				autoCapitalize="none"
				autoCorrect={false}
				returnKeyType="next"
				selectTextOnFocus={true}
				ref={_usernameInput}
				onSubmitEditing={_next}
				textContentType="none"
			/>
			<Spacer />
			<BouncyInput
				label="Password"
				value={password}
				textContentType="none"
				onChangeText={setPassword}
				autoCapitalize="none"
				autoCorrect={false}
				returnKeyType="send"
				selectTextOnFocus={true}
				ref={_passwordInput}
				onSubmitEditing={() => onSubmit({ username, password })}
			/>
			{errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
			<Spacer>
				<Button title={submitButtonText} onPress={() => onSubmit({ username, password })} />
			</Spacer>
		</>
	);
};

const styles = StyleSheet.create({
	errorMessage: {
		fontSize: 16,
		color: 'red',
		marginLeft: 15,
		marginTop: 15,
	},
});

export default AuthForm;
