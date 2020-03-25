import React, { useState, useEffect, forwardRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Input } from 'react-native-elements';

const BouncyInput = forwardRef(
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
		useEffect(() => {
			Animated.timing(introAnim, {
				toValue: 0,
				easing: Easing.bounce,
				duration: 500,
			}).start();
		}, []);

		// const [bounceAnim] = useState(new Animated.Value(0));
		const handleOnFocus = () => {
			Animated.sequence([
				Animated.timing(introAnim, {
					toValue: -10,
					duration: 130,
				}),
				Animated.timing(introAnim, {
					toValue: 0,
					duration: 130,
				}),
			]).start();
			setIsFocused(true);
		};

		const handleOnBlur = () => {
			setIsFocused(false);
		};

		console.log('introAnim', introAnim);

		return (
			<Animated.View style={{ transform: [{ translateY: introAnim }] }}>
				<Input
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					autoFocus={autoFocus}
					autoCapitalize={autoCapitalize}
					autoCorrect={autoCorrect}
					containerStyle={{ ...containerStyle, borderColor: isFocused ? '#0af' : '#303030' }}
					inputStyle={inputStyle}
					returnKeyType={returnKeyType}
					selectTextOnFocus={selectTextOnFocus}
					onSubmitEditing={onSubmitEditing}
					ref={ref}
					onFocus={handleOnFocus}
					onBlur={handleOnBlur}
				/>
			</Animated.View>
		);
	}
);

export default BouncyInput;