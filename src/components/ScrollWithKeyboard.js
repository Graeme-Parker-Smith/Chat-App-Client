import React, { useState, useContext, useEffect, useRef, memo, useMemo } from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	Dimensions,
	Animated,
	PanResponder,
} from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import { NavigationEvents, withNavigationFocus, SafeAreaView } from 'react-navigation';
import { back, navigate } from '../navigationRef';
import Spacer from '../components/Spacer';
import { Context as MessageContext } from '../context/MessageContext';
import { Context as ChannelContext } from '../context/ChannelContext';
import SocketContext from '../context/SocketContext';
import uuid from 'uuid/v4';
import MessageItem from '../components/MessageItem';
import KeyboardShift from '../components/KeyBoardShift';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import imgUpload from '../helpers/imgUpload';
import InviteMenu from '../components/InviteMenu';
import LoadingIndicator from '../components/LoadingIndicator';

const CreateChannelForm = (props) => {
	const [newChannelName, setNewChannelName] = useState('');
	const [description, setDescription] = useState('');
	const { state, createChannel } = useContext(ChannelContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [lifespan, setLifespan] = useState('');
	const [msgLife, setMsgLife] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [mature, setMature] = useState(false);

	const cancelForm = () => {
		showForm(false);
	};

	const handleSubmit = async () => {
		if (!newChannelName) return;
		setIsLoading(true);
		const response = await createChannel({
			name: newChannelName,
			creator: state.currentUser.username,
			avatar: avatar.base64Uri,
			description,
			lifespan: lifespan > 0 ? parseInt(lifespan) : null,
			msgLife: msgLife > 0 ? parseInt(msgLife) : null,
			mature,
		});
		if (response && response.data.error) {
			console.log('yes', response.data);
			setIsLoading(false);
			setErrMsg(response.data.error);
			return;
		}
		setNewChannelName('');
		setLifespan(0);
		setIsLoading(false);
		showForm(false);
	};

	if (isLoading) return <LoadingIndicator />;

	return <ScrollView style={styles.scrollView}>{props.children}</ScrollView>;
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#000',
	},
	scrollView: {
		height: Dimensions.get('window').height * 0.5,
	},
	button: {
		padding: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default CreateChannelForm;
