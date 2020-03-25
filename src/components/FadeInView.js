import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';

const FadeInView = props => {
	const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 2000,
		}).start();
	}, []);

	return (
		<Animated.View // Special animatable View
			style={{
				...props.style,
				opacity: fadeAnim, // Bind opacity to animated value
			}}
		>
			{props.children}
		</Animated.View>
	);
};

export default FadeInView;
