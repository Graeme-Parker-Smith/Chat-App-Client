import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native';
import Spacer from './Spacer';
import WhiteText from './WhiteText';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { MaterialIcons, Entypo } from '@expo/vector-icons';

const DefaultAvatar = () => <Entypo style={styles.avatarStyle} name="user" size={50} color="#0af" />;

const AvatarPicker = ({ avatar, setAvatar, whichForm, _toPassword, displayName = '' }) => {
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
		if (!result.cancelled) {
			setAvatar({ localUri: result.uri, base64Uri: `data:image/jpg;base64,${result.base64}` });
		}
	};
	return (
		<View>
			<Text style={{ color: 'white', textAlign: 'center' }}>Set {whichForm} Avatar</Text>
			<View style={styles.imagePickerStyle}>
				<TouchableOpacity style={styles.obviousButton} onPress={launchCamera}>
					<MaterialIcons style={{ alignSelf: 'center' }} name="photo-camera" size={50} color="#0af" />
				</TouchableOpacity>
				<View style={{ alignItems: 'center' }}>
					{avatar ? (
						<Image source={{ uri: avatar.localUri || avatar }} style={styles.avatarStyle} />
					) : (
						<DefaultAvatar />
					)}
					<WhiteText>{displayName}</WhiteText>
				</View>
				<TouchableOpacity style={styles.obviousButton} onPress={_pickImage}>
					<MaterialIcons style={{ alignSelf: 'center' }} name="photo-library" size={50} color="#0af" />
				</TouchableOpacity>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	avatarStyle: {
		height: 50,
		width: 50,
		alignSelf: 'center',
		borderRadius: 25,
	},
	imagePickerStyle: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	obviousButton: {
		backgroundColor: '#303030',
		height: 65,
		width: 65,
		borderRadius: 40,
		alignContent: 'center',
		justifyContent: 'center',
	},
});

export default AvatarPicker;
