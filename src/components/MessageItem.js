import React, { memo, useState } from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements';
import Spacer from './Spacer';
import timeConverter from '../helpers/timeConverter';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import base64 from 'react-native-base64';

const DefaultAvatar = () => <Entypo name="user" size={20} color="#0af" />;

const MessageItem = ({
	content,
	username,
	time,
	avatar,
	isImage,
	isVideo,
	// setVideoState
}) => {
	const [vidRef, setVidRef] = useState('');
	// calculate how long ago msg was sent and create title content for msg
	let howLongAgo;
	if (time) {
		const now = new Date();
		howLongAgo = timeConverter(time, now);
	}
	const deets = howLongAgo ? 'from: ' + username + '  -  ' + howLongAgo : 'from: ' + username;

	// If user avatar, display that in left icon, else use default avatar
	let avatarImage;
	if (avatar) {
		avatarImage = (
			<View>
				<Image source={{ uri: avatar }} style={styles.avatarStyle} />
			</View>
		);
	} else {
		avatarImage = DefaultAvatar;
	}

	const PlayIcon = () => {
		return (
			<MaterialIcons
				name="replay"
				size={30}
				color="#c2c5cc"
				style={{
					height: 200,
					width: 200,
					position: 'absolute',
					top: 170,
					left: 170,
					// opacity: 0.5
				}}
				onPress={() => {
					if (vidRef) {
						vidRef.replayAsync();
					}
				}}
			/>
		);
	};

	const _handleVideoRef = component => {
		let playbackObject = component;
		setVidRef(playbackObject);
		// console.log("playbackObject", playbackObject);
	};

	// check whether subtitle prop should render content as Text, Image, or Video
	let renderedContent;
	if (isVideo) {
		renderedContent = (
			// <View style={{ height: 200, width: 200 }}>
			//   <FontAwesome
			//     name="play-circle"
			//     size={30}
			//     color="#0af"
			//     iconStyle={{
			//       height: 200,
			//       width: 200,
			//       position: "absolute",
			//       top: 100,
			//       right: 100,
			//       opacity: 0.5
			//     }}
			//     onPress={() =>
			//       setVideoState({ videoIsPlaying: true, videoUri: content })
			//     }
			//   >
			<View style={{ position: 'relative' }}>
				<Video
					ref={_handleVideoRef}
					source={{ uri: content }}
					rate={1.0}
					volume={1.0}
					isMuted={false}
					resizeMode="cover"
					// shouldPlay
					// isLooping
					natural
					useNativeControls={true}
					style={{ height: 200, width: 200, position: 'relative' }}
				/>
				<PlayIcon />
			</View>
		);
	} else if (isImage) {
		// function _arrayBufferToBase64(buffer) {
		// 	var binary = '';
		// 	var bytes = new Uint8Array(buffer);
		// 	var len = bytes.byteLength;
		// 	for (var i = 0; i < len; i++) {
		// 		binary += String.fromCharCode(bytes[i]);
		// 	}
		// 	return btoa(binary);
		// }
		// let imageSrc = base64.encode(content.data);
		// let imageString =
		// 	'ZmlsZTovLy92YXIvbW9iaWxlL0NvbnRhaW5lcnMvRGF0YS9BcHBsaWNhdGlvbi8xNEU4OEYxNy04ODYwLTQ2RjYtQkIwQi04OTJDMzQ5MTM2RTkvTGlicmFyeS9DYWNoZXMvRXhwb25lbnRFeHBlcmllbmNlRGF0YS8lMjU0MGdyYWVtZXNtaXRoJTI1MkZncmFlbWUtY2hhdC1hcHAvSW1hZ2VQaWNrZXIvQjdCQkZCREEtQjUyMC00OTJGLTlFREItMUU1NURDNTRCNkRDLmpwZw==';
		// console.log('imageSrc', imageSrc);
		// let imageSrc = `data:image/jpg;base64,${imageString}`
		// let imageSrc = content.data.toString('base64');
		// let imageSrc = "B9A71996-353E-4638-8148-B1AB2C653138.jpg"
		// let imageSrc = String.fromCharCode.apply(null, new Uint16Array(content.data));
		// console.log('imageSrc', imageSrc);
		// console.log(content);
		renderedContent = (
			<View>
				<Image source={{ uri: content }} style={{ height: 200, width: 200 }} />
			</View>
		);
	} else {
		renderedContent = content;
	}

	console.log('content', content);
	return (
		<ListItem
			containerStyle={
				username === 'Admin' ? { ...styles.messageBody, backgroundColor: 'green' } : styles.messageBody(isImage)
			}
			title={deets}
			titleStyle={styles.title}
			subtitle={renderedContent}
			subtitleStyle={styles.subtitle}
			leftAvatar={avatarImage}
			// onLayout={event => {
			//   const layout = event.nativeEvent.layout;
			//   addToLayoutsMap(layout, index);
			// }}
		></ListItem>
	);
};

const styles = StyleSheet.create({
	messageBody: () => ({
		backgroundColor: 'black',
		padding: 5,
		width: Dimensions.get('window').width,
	}),
	title: {
		color: '#0af',
		fontSize: 12,
	},
	subtitle: {
		color: 'white',
		fontSize: 18,
	},
	avatarStyle: {
		height: 45,
		width: 45,
		borderRadius: 20,
	},
});

export default memo(MessageItem);
