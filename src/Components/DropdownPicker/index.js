import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { useField } from '@unform/core';

const DropdownPicker = (props) => {
	const { label, datasource, name, onChange, stylesheet } = props;

	const pickerRef = useRef(null);
	const { fieldName, registerField, defaultValue, error } = useField(name);
	const [option, setOption] = useState(defaultValue);

	const [showPicker, setShowPicker] = useState(true);

	useEffect(() => {
		setOption(defaultValue);
		if (pickerRef.current) {
			pickerRef.current.value = defaultValue;
			setShowPicker(!showPicker)
		}
	}, [defaultValue]);

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: pickerRef.current,
			path: 'value',

			clearValue(ref) {
				ref.value = '';
				//ref.clear();
			},

			setValue(ref, value) {
				//ref.setNativeProps({ text: value });
				pickerRef.current.value = value;
			},
		});
	}, [fieldName, registerField]);

	const getDataSourceFields = () => {
		return Object.keys(datasource).map((value) => {
			const text = datasource[value];
			if (typeof text === 'string') {
				return {
					value,
					text,
				};
			} else {
				throw new Error(
					'Invalid datasource field! It must be a string!',
				);
			}
		});
	};

	var formGroupStyle = stylesheet.select.normal;
	var controlLabelStyle = stylesheet.controlLabel.normal;
	var textboxStyle = Platform.OS === 'ios' ? {} : stylesheet.textbox.normal;
	var errorBlockStyle = stylesheet.errorBlock;

	if (!!error) {
		formGroupStyle = stylesheet.select.error;
		controlLabelStyle = stylesheet.controlLabel.error;
		textboxStyle = stylesheet.textbox.error;
		textboxViewStyle = stylesheet.textboxView.error;
	}

	const showIOSPicker = () => {
		setShowPicker(!showPicker);
	}

	const renderPicker = () => {
		return (
			<Picker
				ref={pickerRef}
				style={[styles.textInput, textboxStyle]}
				selectedValue={option}
				onValueChange={(itemValue) => {
					onChange(itemValue);
					setOption(itemValue);
					if (pickerRef.current) {
						pickerRef.current.value = itemValue;
					}
				}}
				{...props}>
				{ renderOptions}
				{!!error && (
					<Text accessibilityLiveRegion="polite" style={[styles.error, errorBlockStyle]}>
						{error}
					</Text>
				)}
			</Picker>
		)
	}

	const renderOptions = getDataSourceFields().map(({ value, text }) => {
		return (<Picker.Item color="#3e3e3e" key={value} value={value} label={text} />)
	});

	const renderAndroid = () => {
		return (
			<View style={[styles.container, formGroupStyle]}>
				{label && (
					<Text style={[styles.label, controlLabelStyle]}>{label}</Text>
				)}
				{ renderPicker()}
			</View>
		)
	}

	const renderIOS = () => {
		return (
			<View style={[styles.container, formGroupStyle]}>
				<TouchableOpacity onPress={showIOSPicker}>
					{label && (
						<Text style={[styles.label, controlLabelStyle]}>{label}</Text>
					)}
					<Text style={[styles.textInputIos, textboxStyle]}>{datasource[option]}</Text>
				</TouchableOpacity>
				{ showPicker && renderPicker()}
			</View>
		)
	}

	return (
		Platform.OS === 'ios' ? renderIOS() : renderAndroid()
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 15,
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	label: {
		fontSize: 13,
	},
	textInput: {
		fontSize: 17
	},
	textInputIos: {
		fontSize: 17,
		paddingVertical: 5,
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	error: {
		color: '#f00',
		fontSize: 12,
	},
});

export default DropdownPicker;