import React, { memo, useState } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import EditMessageForm from './EditMessageForm';
import timeConverter from '../helpers/timeConverter';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import CacheImage from './CacheImage';
import UserProfile from './UserProfile';

const DefaultAvatar = () => <Entypo name="user" size={35} color="#0af" />;

const MessageItem = ({
	currentUserUsername,
	itemId,
	content,
	username,
	time,
	avatar,
	isImage,
	isVideo,
	channelId,
	index,
	addToLayoutsMap,
	// setVideoState
}) => {
	const [vidRef, setVidRef] = useState('');
	const [editMessageVisible, setEditMessageVisible] = useState(false);
	const [showUserProfile, setShowUserProfile] = useState(false);
	// should either use id or ensure username gets changed on updates.
	const isOwner = currentUserUsername === username;
	// calculate how long ago msg was sent and create title content for msg
	let howLongAgo;
	if (time) {
		const now = new Date();
		howLongAgo = timeConverter(time, now);
	}
	const deets = (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<Text style={{ color: '#0af', fontSize: 16, fontWeight: 'bold' }}>{username}</Text>
			<Text style={{ color: '#808080', fontSize: 12 }}>{howLongAgo ? '  -  ' + howLongAgo : null}</Text>
		</View>
	);

	// If user avatar, display that in left icon, else use default avatar
	let avatarImage;
	if (avatar) {
		avatarImage = (
			<TouchableOpacity>
				<CacheImage uri={avatar} style={styles.avatarStyle} />
			</TouchableOpacity>
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

	const _handleVideoRef = (component) => {
		let playbackObject = component;
		setVidRef(playbackObject);
	};

	const handleLongPress = () => {
		// console.log('msg creator', username);
		// console.log('isOwner', isOwner);
		// console.log('itemId', itemId);
		if (isOwner) {
			setEditMessageVisible(true);
		} else {
			// console.log('show USER PROFILE!');
			setShowUserProfile(true);
		}
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
				<CacheImage uri={content} style={{ height: 200, width: 200 }} />
			</View>
		);
	} else {
		renderedContent = content;
	}

	return (
		<>
			{editMessageVisible ? (
				<EditMessageForm
					itemId={itemId}
					isOwner={isOwner}
					currentContent={content}
					editMessageVisible={editMessageVisible}
					setEditMessageVisible={setEditMessageVisible}
					channelId={channelId}
				/>
			) : null}
			{showUserProfile ? (
				<UserProfile
					username={username}
					source={avatar}
					modalVisible={showUserProfile}
					setModalVisible={setShowUserProfile}
				/>
			) : null}
			<ListItem
				containerStyle={
					username === 'Admin'
						? { ...styles.messageBody, backgroundColor: 'green' }
						: styles.messageBody(isImage)
				}
				title={deets}
				titleStyle={styles.title}
				subtitle={renderedContent}
				subtitleStyle={styles.subtitle}
				leftAvatar={avatarImage}
				onLongPress={handleLongPress}
				onLayout={(event) => {
					const layout = event.nativeEvent.layout;
					addToLayoutsMap(layout.height, index);
				}}
			></ListItem>
		</>
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

export default MessageItem;
