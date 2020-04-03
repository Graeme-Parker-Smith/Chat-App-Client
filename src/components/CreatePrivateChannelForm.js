import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import BouncyInput from './BouncyInput';


const CreatePrivateChannelForm = ({ showForm }) => {
	const [newChannelName, setNewChannelName] = useState('');
	const { state, createPrivateChannel } = useContext(ChannelContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [lifespan, setLifespan] = useState('');
	const [msgLife, setMsgLife] = useState('');

	const cancelForm = () => {
		showForm(false);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		await createPrivateChannel({
			name: newChannelName,
			creator: state.currentUser.username,
			avatar: avatar.base64Uri,
			lifespan: lifespan > 0 ? parseInt(lifespan) : undefined,
			msgLife: msgLife > 0 ? parseInt(msgLife) : null,
		});
		setNewChannelName('');
		setLifespan(0);
		setIsLoading(false);
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
			/>
			<Input
				value={String(lifespan)}
				onChangeText={setLifespan}
				keyboardType="numeric"
				selectTextOnFocus={true}
				label="Set Channel Lifespan"
				placeholder="Forever"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
			/>
			<Input
				value={String(msgLife)}
				onChangeText={setMsgLife}
				keyboardType="numeric"
				selectTextOnFocus={true}
				label="Set Message Lifespan"
				placeholder="Forever"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
			/>
			<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'Channel'} />
			<View style={styles.buttonRow}>
				<Button buttonStyle={styles.button} title="Create New Private Channel" onPress={handleSubmit} />
				<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
			</View>
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
