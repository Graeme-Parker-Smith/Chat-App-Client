import React, { useState, useEffect, forwardRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Input } from 'react-native-elements';

const BouncyInput = forwardRef(
	(
		{
			value,
			onChangeText,
			placeholder = '',
			label = false,
			autoFocus = false,
			autoCapitalize = 'none',
			autoCorrect = false,
			containerStyle = {},
			inputStyle = { color: 'white' },
			inputContainerStyle= {},
			returnKeyType = 'next',
			selectTextOnFocus = true,
			onSubmitEditing = null,
			maxLength,
			secure,
			multiline = false,
			keyboardType = 'default'
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

		return (
			<Animated.View style={{ transform: [{ translateY: introAnim }] }}>
				<Input
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					label={label}
					maxLength={maxLength}
					autoFocus={autoFocus}
					autoCapitalize={autoCapitalize}
					autoCorrect={autoCorrect}
					containerStyle={[{ ...containerStyle, borderColor: isFocused ? '#0af' : '#303030' }, styles.input]}
					inputStyle={inputStyle}
					returnKeyType={returnKeyType}
					selectTextOnFocus={selectTextOnFocus}
					onSubmitEditing={onSubmitEditing}
					keyboar
					ref={ref}
					inputContainerStyle={inputContainerStyle}
					onFocus={handleOnFocus}
					multiline={multiline}
					onBlur={handleOnBlur}
					secureTextEntry={secure}
					keyboardType={keyboardType}
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

export default BouncyInput;
