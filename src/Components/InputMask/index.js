import React, { useCallback, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import styles from './styles';
import Input from './Input';
import { useField } from '@unform/core';

const InputMask = (props) => {
	const { label, name, type, stylesheet } = props;

	const { defaultValue, error } = useField(name);
	const [value, setValue] = useState(defaultValue);
	const [rawValue, setRawValue] = useState(defaultValue);

	var formGroupStyle = stylesheet.formGroup.normal;
	var controlLabelStyle = stylesheet.controlLabel.normal;
	var textboxStyle = stylesheet.textbox.normal;
	var textboxViewStyle = stylesheet.textboxView.normal;
	var helpBlockStyle = stylesheet.helpBlock.normal;
	var errorBlockStyle = stylesheet.errorBlock;

	if (!!error) {
		formGroupStyle = stylesheet.formGroup.error;
		controlLabelStyle = stylesheet.controlLabel.error;
		textboxStyle = stylesheet.textbox.error;
		textboxViewStyle = stylesheet.textboxView.error;
		helpBlockStyle = stylesheet.helpBlock.error;
	}

	useEffect(() => {
		setValue(defaultValue);
		setRawValue(defaultValue);
	}, [defaultValue]);

	const handleOnChangeText = useCallback((maskedValue, unmaskedValue) => {
		setValue(maskedValue);
		setRawValue(unmaskedValue);
	}, []);

	return (
		<View style={[styles.container, formGroupStyle]}>
			<Text style={[styles.label, controlLabelStyle]}>{label}</Text>
			<TextInputMask
				style={[styles.textInput, textboxStyle]}
				includeRawValueInChangeText
				value={value}
				type={type}
				onChangeText={handleOnChangeText}
				customTextInput={Input}
				customTextInputProps={{
					rawValue,
					...props,
				}}
				{...props}
			/>
			{!!error && (
				<Text accessibilityLiveRegion="polite" style={[styles.error, errorBlockStyle]}>
					{error}
				</Text>
			)}
		</View>
	);
};

export default InputMask;
