import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ListItem } from 'react-native-elements';
import { AntDesign, Entypo } from '@expo/vector-icons';
import CacheImage from './CacheImage';

const ChannelListItem = ({ item, color }) => {
	const [showDescription, setShowDescription] = useState(false);
	const [heightAnim] = useState(new Animated.Value(60));

	const handleHeightAnim = () => {
		if (!showDescription) {
			Animated.timing(heightAnim, {
				toValue: 180,
				duration: 500,
			}).start();
			setTimeout(() => {
				setShowDescription(true);
			}, 500);
		} else {
			Animated.timing(heightAnim, {
				toValue: 60,
				duration: 500,
			}).start();
			setShowDescription(false);
		}
	};

	return (
		<Animated.View style={{ height: heightAnim, backgroundColor: color, margin: 5, borderRadius: 10 }}>
			{item.mature ? (
				<View style={{ position: 'absolute', left: 80, top: 0, backgroundColor: 'red', zIndex: 1000 }}>
					<Text>M</Text>
				</View>
			) : null}
			<ListItem
				// badge={<Badge value={item.msgCount ? item.msgCount : 73} />}
				// # of messages on channel in badge
				// badge={{
				// 	value: item.msgCount >= 0 ? item.msgCount : null,
				// 	badgeStyle: { backgroundColor: item.msgCount >= 0 ? '#0af' : 'transparent' },
				// }}
				// value={73}
				containerStyle={
					// { backgroundColor: 'transparent', alignSelf: 'center' }
					[
						styles.channel(item.username ? '#036' : color),
						{
							height: showDescription ? 180 : 60,
							justifyContent: 'center',
							alignItems: 'center',
							padding: 0,
						},
					]
				}
				// Component={<Animated.View style={{ height: heightAnim }} />}
				contentContainerStyle={
					showDescription
						? { justifyContent: 'flex-start', height: 140 }
						: { justifyContent: 'center', height: 20 }
				}
				title={item.name ? item.name : item.username}
				subtitle={
					showDescription
						? item.username
							? `I'm your friend! We're friends, right?`
							: item.description || 'No Description'
						: null
				}
				titleStyle={styles.title}
				subtitleStyle={styles.subtitle}
				rightElement={
					<TouchableOpacity
						onPress={handleHeightAnim}
						style={{
							borderLeftWidth: 1,
							borderLeftColor: 'black',
							height: showDescription ? 180 : 60,
							backgroundColor: 'green',
							width: 40,
							borderRadius: 10,
							justifyContent: 'center',
						}}
					>
						<AntDesign
							name={showDescription ? 'caretup' : 'caretdown'}
							size={20}
							color="black"
							style={{ alignSelf: 'center' }}
						/>
					</TouchableOpacity>
				}
				leftAvatar={
					item.avatar ? (
						<View style={showDescription ? { position: 'relative', top: -60 } : null}>
							<CacheImage uri={item.avatar} style={styles.avatarStyle} />
						</View>
					) : (
						<Entypo
							style={showDescription ? { position: 'relative', top: -60 } : null}
							name={item.username ? 'user' : 'users'}
							size={40}
							color="#0af"
						/>
					)
				}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	channel: (color) => ({
		height: 60,
		backgroundColor: color,
		// margin: 5,
		borderRadius: 10,
	}),
	title: {
		color: 'white',
	},
	subtitle: {
		fontSize: 12,
		color: 'green',
	},
	avatarStyle: {
		height: 40,
		width: 40,
		borderRadius: 20,
	},
});

export default ChannelListItem;
