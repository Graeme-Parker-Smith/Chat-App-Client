import React, { useState } from 'react';
import { View, Switch, StyleSheet, TouchableOpacity } from 'react-native';

const AdvSwitch = (props) => {
	const { leftText, rightText } = props;
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

	return (
		<TouchableOpacity style={[styles.container, {backgroundColor: isEnabled ? '#f5dd4b' : '#f4f3f4'}]} onPress={toggleSwitch}>
			<View style={styles.thumb} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 50,
		height: 30,
		backgroundColor: '#3e3e3e',
		borderRadius: 15,
	},
	thumb: {
		height: 26,
		width: 26,
		borderRadius: 12,
		backgroundColor: '#f4f3f4',
		margin: 2,
	},
});

export default AdvSwitch;
