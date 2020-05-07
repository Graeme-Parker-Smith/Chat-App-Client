import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
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
	} = useContext(ChannelContext);
	const { deleteUser } = useContext(AuthContext);

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
		navigate('Account');
		await fetchChannels();
	};

	const cancelForm = () => {
		navigate('Account');
	};

	const handleDelete = async () => {
		await deleteUser({
			username: currentUser.username,
			user_id: currentUser._id,
		});
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
			<Spacer>
				<BouncyInput
					label="Change Username"
					value={newUsername}
					onChangeText={setNewUsername}
					autoFocus={true}
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
				<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
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
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default EditUserScreen;
