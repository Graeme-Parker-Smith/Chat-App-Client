import React, { useState, useEffect, forwardRef } from 'react';
import { Animated, Easing, Dimensions } from 'react-native';
import { Input } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

const AnimSearchBar = forwardRef(
	(
		{
			value,
			onChangeText,
			placeholder = '',
			autoFocus = false,
			autoCapitalize = 'none',
			autoCorrect = false,
			containerStyle = {},
			inputStyle = { color: 'white' },
			returnKeyType = 'next',
			selectTextOnFocus = true,
			onSubmitEditing = null,
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const [introAnim] = useState(new Animated.Value(-50));
		const [widthAnim] = useState(new Animated.Value(200));
		// useEffect(() => {
		// 	Animated.timing(introAnim, {
		// 		toValue: 0,
		// 		easing: Easing.bounce,
		// 		duration: 500,
		// 	}).start();
		// }, []);

		// const [bounceAnim] = useState(new Animated.Value(0));
		const handleOnFocus = () => {
			Animated.sequence([
				Animated.timing(widthAnim, {
					toValue: Dimensions.get('window').width * 0.95,
					duration: 200,
				}),
				Animated.timing(widthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 200,
				}),
			]).start();
			setIsFocused(true);
		};

		const handleOnBlur = () => {
			Animated.sequence([
				Animated.timing(widthAnim, {
					toValue: 190,
					duration: 200,
					useNativeDriver: false
				}),
				Animated.timing(widthAnim, {
					toValue: 200,
					duration: 200,
					useNativeDriver: false
				}),
			]).start();
			setIsFocused(false);
		};

		return (
			<Animated.View style={{ alignSelf: 'center', width: widthAnim }}>
				<Input
					leftIcon={() => <FontAwesome name="search" size={32} color={isFocused ? '#0af' : '#303030'} />}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					autoFocus={autoFocus}
					autoCapitalize={autoCapitalize}
					autoCorrect={autoCorrect}
					containerStyle={[{ ...containerStyle, borderColor: isFocused ? '#0af' : '#303030' }, styles.input]}
					inputStyle={inputStyle}
					returnKeyType={returnKeyType}
					selectTextOnFocus={selectTextOnFocus}
					onSubmitEditing={onSubmitEditing}
					ref={ref}
					onFocus={handleOnFocus}
					onBlur={handleOnBlur}
					placeholderTextColor={isFocused ? '#0af' : '#303030'}
				/>
			</Animated.View>
		);
	}
);

const styles = {
	input: {
		borderWidth: 1,
		borderRadius: 10,
	},
};

export default AnimSearchBar;
