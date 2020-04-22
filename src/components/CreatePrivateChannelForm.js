import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import BouncyInput from './BouncyInput';
import WhiteText from './WhiteText';

const CreatePrivateChannelForm = ({ showForm }) => {
	const [newChannelName, setNewChannelName] = useState('');
	const { state, createPrivateChannel } = useContext(ChannelContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [lifespan, setLifespan] = useState('');
	const [msgLife, setMsgLife] = useState('');
	const [errMsg, setErrMsg] = useState('');

	const cancelForm = () => {
		showForm(false);
	};

	const handleSubmit = async () => {
		if (!newChannelName) return;
		setIsLoading(true);
		const response = await createPrivateChannel({
			name: newChannelName,
			creator: state.currentUser.username,
			avatar: avatar.base64Uri,
			lifespan: lifespan > 0 ? parseInt(lifespan) : undefined,
			msgLife: msgLife > 0 ? parseInt(msgLife) : null,
		});
		setIsLoading(false);
		if (response && response.data.error) {
			console.log("yes", response.data);
			setErrMsg(response.data.error);
			return;
		}
		setNewChannelName('');
		setLifespan(0);
		showForm(false);
	};

	if (isLoading) return <LoadingIndicator />;

	return (
		<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
			<BouncyInput
				value={newChannelName}
				onChangeText={setNewChannelName}
				placeholder="Name your new Private channel"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
				autoFocus={true}
				maxLength={22}
			/>
			<BouncyInput
				value={String(lifespan)}
				onChangeText={setLifespan}
				keyboardType="numeric"
				selectTextOnFocus={true}
				label="Set Channel Lifespan in Minutes"
				placeholder="Forever"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
				maxLength={22}
			/>
			<BouncyInput
				value={String(msgLife)}
				onChangeText={setMsgLife}
				keyboardType="numeric"
				selectTextOnFocus={true}
				label="Set Message Lifespan in Minutes"
				placeholder="Forever"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
				maxLength={22}
			/>
			<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'Channel'} />
			<View style={styles.buttonRow}>
				<Button
					disabled={!newChannelName}
					buttonStyle={styles.button}
					title="Create New Private Channel"
					onPress={handleSubmit}
				/>
				<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
			</View>
			<WhiteText style={{ color: 'red' }}>{errMsg}</WhiteText>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		backgroundColor: '#301934',
	},
	button: {
		padding: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default CreatePrivateChannelForm;
