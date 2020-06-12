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
	const [keyboardShowing, setKeyboardShowing] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
		keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const _keyboardDidShow = (e) => {
		setKeyboardShowing(true);
		setKeyboardHeight(e.endCoordinates.height);
	};

	const _keyboardDidHide = () => {
		setKeyboardShowing(false);
		setKeyboardHeight(0);
	};

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
