import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Input, Button, Text } from 'react-native';
import Spacer from './Spacer';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { MaterialIcons, Entypo } from '@expo/vector-icons';

const DefaultAvatar = () => <Entypo style={styles.avatarStyle} name="user" size={90} color="#0af" />;


const AvatarPicker = ({ avatar, setAvatar, whichForm, _toPassword }) => {
	const _pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			base64: true,
		});

		if (!result.cancelled) {
			setAvatar({ localUri: result.uri, base64Uri: `data:image/jpg;base64,${result.base64}` });
		}
	};
	const launchCamera = async () => {
		await Permissions.askAsync(Permissions.CAMERA_ROLL);
		await Permissions.askAsync(Permissions.CAMERA);
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			base64: true,
		});

		// console.log(result);

		if (!result.cancelled) {
			setAvatar({ localUri: result.uri, base64Uri: `data:image/jpg;base64,${result.base64}` });
			// if (_toPassword) _toPassword();
		}
	};
	return (
		<View>
			<Text style={{ color: 'white', textAlign: 'center' }}>Set {whichForm} Avatar</Text>
			<View style={styles.imagePickerStyle}>
				<MaterialIcons name="photo-camera" size={100} color="#0af" onPress={launchCamera} />
				<View>
					{avatar ? <Image source={{ uri: avatar.localUri || avatar }} style={styles.avatarStyle} /> : <DefaultAvatar />}
				</View>
				<MaterialIcons name="photo-library" size={100} color="#0af" onPress={_pickImage} />
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	avatarStyle: {
		height: 100,
    width: 100,
    alignSelf: 'center',
		borderRadius: 50,
	},
	imagePickerStyle: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default AvatarPicker;
