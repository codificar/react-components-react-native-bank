import React, { useEffect, useRef } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

import { useField } from '@unform/core';

const AgencyDigitInput = (props) => {
	const {
		name,
		label,
		agencyDigitRequired = false,
		agencyDigitMaxLength = 1,
		stylesheet
	} = props;

	// Adiciona 1 ao length para inserir - na mascara
	const maxLenght = agencyDigitRequired ? agencyDigitMaxLength : 1;

	const inputRef = useRef(null);
	const { fieldName, registerField, defaultValue, error } = useField(name);

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
		inputRef.current.value = defaultValue;
	}, [defaultValue]);

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value',

			clearValue(ref) {
				ref.value = '';
				ref.clear();
			},

			setValue(ref, value) {
				ref.setNativeProps({ text: value });
				inputRef.current.value = value;
			},
		});
	}, [fieldName, registerField]);

	/**
	 * Atualiza o valor do campo
	 * @param {string} value
	 **/
	const onChangeText = (value) => {
		if (inputRef.current) {
			inputRef.current.value = value;
		}
	};

	return (
		<View style={[styles.container, formGroupStyle]}>
			{label && (
				<Text style={[styles.label, controlLabelStyle]}>{label}</Text>
			)}
			<TextInput
				ref={inputRef}
				style={[styles.textInput, textboxStyle]}
				maxLength={maxLenght}
				defaultValue={defaultValue}
				onChangeText={onChangeText}
				//value={text}
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

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	label: {
		fontSize: 13,
	},
	textInput: {
		fontSize: 17,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	error: {
		color: '#f00',
		fontSize: 12,
	},
});

export default AgencyDigitInput;
