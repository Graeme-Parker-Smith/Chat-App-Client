import React, { useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Spacer from './Spacer';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Context as ChannelContext } from '../context/ChannelContext';

const UserInteractButton = ({ status, friendName }) => {
	const {
		addFriend,
		state: { currentUser },
	} = useContext(ChannelContext);
	const activated = status === 'pending' || status === 'added';

	const handleClick = () => {
		if (!activated) addFriend({ username: currentUser.username, friendName });
		return;
	};

	const Icon = ({ status }) => {
		return (
			<View>
				{activated ? (
					<Feather name="user-check" size={20} color="#0af" />
				) : (
					<AntDesign name="adduser" size={20} color="black" />
				)}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity disabled={activated} onPress={handleClick}>
				<View style={{ flexDirection: 'row', padding: 10 }}>
					<Icon status={status} />
          <Spacer margin={10} />
					<Text style={styles.color(activated)}>{status}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = {
	color: activated => ({
		color: activated ? '#0af' : '#000',
	}),
	container: {
		backgroundColor: 'white',
		borderRadius: 15,
		flexDirection: 'row',
	},
};

export default UserInteractButton;
