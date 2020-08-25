import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Context as AuthContext } from '../context/AuthContext';
import Spacer from '../components/Spacer';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from '../components/LoadingIndicator';
import BouncyInput from '../components/BouncyInput';
import { back, navigate } from '../navigationRef';
import AreYouSure from '../components/AreYouSure';
import WhiteText from '../components/WhiteText';

const EditUserScreen = () => {
	const {
		state: { currentUser },
		updateUser,
		fetchChannels,
		clearState
	} = useContext(ChannelContext);
	const { deleteUser, signout } = useContext(AuthContext);

	const [newUsername, setNewUsername] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newAvatar, setNewAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	const handleSubmit = async () => {
		setIsLoading(true);
		const response = await updateUser({
			username: currentUser.username,
			newUsername,
			newPassword,
			newAvatar: newAvatar.base64Uri,
		});
		if (response && response.data.error) {
			console.log('yes', response.data);
			setIsLoading(false);
			setErrMsg(response.data.error);
			return;
		}
		navigate('Dash');
		await fetchChannels();
	};

	const cancelForm = () => {
		navigate('Dash');
	};

	const handleDelete = async () => {
		await deleteUser({
			username: currentUser.username,
			user_id: currentUser._id,
		});
	};

	const handleSignout = () => {
		signout({ user_id: currentUser._id });
		clearState();
	};

	if (!currentUser || isLoading) {
		return (
			<View>
				<LoadingIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{modalVisible ? (
				<AreYouSure
					yesAction={handleDelete}
					isOwner={true}
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
				/>
			) : null}
			<Spacer />
			<WhiteText style={{ fontSize: 24, alignSelf: 'center' }}>Edit Account</WhiteText>
			<View style={styles.userBox}>
				<WhiteText>{currentUser.username}</WhiteText>
				<WhiteText>Created:{currentUser.createdAt}</WhiteText>
				<WhiteText>Score: {currentUser.msgsSent}</WhiteText>
			</View>
			<Spacer>
				<BouncyInput
					label="Change Username"
					value={newUsername}
					onChangeText={setNewUsername}
					autoFocus={false}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
				/>
			</Spacer>
			<Spacer>
				<BouncyInput
					secureTextEntry
					placeholder="Change Password"
					value={newPassword}
					onChangeText={setNewPassword}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
					secure={true}
				/>
			</Spacer>
			<AvatarPicker avatar={newAvatar} setAvatar={setNewAvatar} whichForm={'User'} />
			<Spacer />
			<View style={styles.buttonRow}>
				<Button buttonStyle={styles.button} title="Update User Info" onPress={handleSubmit} />
				{/* <Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} /> */}
				<TouchableOpacity
					onPress={handleSignout}
					style={{
						backgroundColor: 'transparent',
						borderWidth: 1,
						borderColor: '#0af',
						padding: 10,
						borderRadius: 2,
						margin: 10,
					}}
				>
					<WhiteText style={{ color: '#0af', alignSelf: 'center', fontWeight: 'bold' }}>Sign Out</WhiteText>
				</TouchableOpacity>
				<Button
					buttonStyle={styles.deleteButton}
					title="Delete Account"
					onPress={() => setModalVisible(true)}
				/>
			</View>
			<WhiteText style={{ color: 'red' }}>{errMsg}</WhiteText>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		backgroundColor: '#000',
	},
	button: {
		padding: 10,
	},
	deleteButton: {
		padding: 10,
		backgroundColor: 'red',
	},
	userBox: {
		marginTop: 0,
		alignSelf: 'center',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default EditUserScreen;
