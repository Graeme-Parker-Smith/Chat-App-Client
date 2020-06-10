import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import FadeInView from '../components/FadeInView';
import BouncyInput from '../components/BouncyInput';
import WhiteText from '../components/WhiteText';
import AvatarPicker from '../components/AvatarPicker';
import Spacer from './Spacer';
import AdvSwitch from './AdvSwitch';
import GSwitch from './GSwitch';
import NumberDial from './NumberDial';

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText, isSignup = false }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [avatar, setAvatar] = useState('');
	const [gender, setGender] = useState('female');
	const [isLoading, setIsLoading] = useState(false);
	const _usernameInput = useRef();
	const _passwordInput = useRef();
	// console.log(gender);

	const _next = () => {
		_passwordInput && _passwordInput.current.focus();
	};

	return (
		<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
			<Spacer />
			<Spacer>
				<FadeInView>
					<WhiteText fontSize={40} style={{ color: 'white', alignSelf: 'center' }} h3>
						{headerText}
					</WhiteText>
				</FadeInView>
			</Spacer>
			<BouncyInput
				placeholder={'username'}
				value={username}
				onChangeText={setUsername}
				autoFocus={true}
				autoCapitalize="none"
				maxLength={30}
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
				secure={true}
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				maxLength={22}
				autoCorrect={false}
				containerStyle={styles.input}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				ref={_passwordInput}
				onSubmitEditing={isSignup ? null : () => onSubmit({ username, password })}
			/>
			<Spacer />
			{isSignup ? (
				<View>
					<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'User'} displayName={username} />
				</View>
			) : null}
			{errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
			<Spacer />
			<Button
				disabled={!username || !password}
				title={submitButtonText}
				onPress={() => onSubmit({ username, password, avatar: avatar.base64Uri ? avatar.base64Uri : null })}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		// height: Dimensions.get('window').height,
		// backgroundColor: '#000',
		// color: 'white',
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

export default AuthForm;
