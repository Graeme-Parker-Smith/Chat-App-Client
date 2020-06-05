import React, { useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';

const AdvSwitch = (props) => {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

	return (
		<View style={styles.container}>
			<View style={styles.thumb} />
		</View>
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
    margin: 2
	},
});

export default AdvSwitch;
