import React, { useState } from 'react';
import { View, Switch, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const AdvSwitch = (props) => {
	const { leftText, rightText, gender, setGender } = props;
	// const [isEnabled, setIsEnabled] = useState(true);
	const [thumbAnim] = useState(new Animated.Value(0));
	const toggleSwitch = () => {
		Animated.spring(thumbAnim, {
			duration: 200,
			toValue: gender === 'female' ? 20 : 0,
		}).start();
		setGender((previousState) => (previousState === 'female' ? 'male' : 'female'));
	};

	return (
		<TouchableOpacity
			style={[styles.container, { backgroundColor: gender === 'female' ? '#3e3e3e' : '#81b0ff' }]}
			onPress={toggleSwitch}
			activeOpacity={1}
		>
			<Animated.View
				style={[
					styles.thumb,
					{ backgroundColor: gender === 'female' ? '#f4f3f4' : '#f5dd4b', left: thumbAnim },
				]}
			/>
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
