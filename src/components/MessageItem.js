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
	console.log("avatar", avatar)
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
	};

	// check whether subtitle prop should render content as Text, Image, or Video
	let renderedContent;
	if (isVideo) {
		renderedContent = (
			<View style={{ position: 'relative' }}>
				<Video
					ref={_handleVideoRef}
					source={{ uri: content }}
					rate={1.0}
					volume={1.0}
					isMuted={false}
					resizeMode="cover"
					natural
					useNativeControls={true}
					style={{ height: 200, width: 200, position: 'relative' }}
				/>
				<PlayIcon />
			</View>
		);
	} else if (isImage) {
		renderedContent = (
			<View>
				<Image source={{ uri: content }} style={{ height: 200, width: 200 }} />
			</View>
		);
	} else {
		renderedContent = content;
	}

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
