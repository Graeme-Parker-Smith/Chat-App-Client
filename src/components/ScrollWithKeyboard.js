import React, { useState, useEffect } from 'react';
import { ScrollView, Keyboard, Dimensions } from 'react-native';

const CreateChannelForm = (props) => {
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
		setKeyboardHeight(e.endCoordinates.height);
	};

	const _keyboardDidHide = () => {
		setKeyboardHeight(0);
	};

	return (
		<ScrollView style={{ height: Dimensions.get('window').height - keyboardHeight - 75 }}>{props.children}</ScrollView>
	);
};

export default CreateChannelForm;
