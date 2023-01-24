import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useField } from '@unform/core';
//Moment date
import moment from 'moment';

const DatePicker = (props) => {
	const {dateFormat, label, name, maxDate, stylesheet } = props;

	const dateRef = useRef(null);
	const { fieldName, registerField, defaultValue, error } = useField(name);

	// Testa se a data de entrada é menor que a data máxima permitida.
	const [date, setDate] = useState(moment(maxDate) > moment(defaultValue) ? defaultValue : maxDate);
	const [show, setShow] = useState(false);

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
		const dateValue = moment(maxDate) > moment(defaultValue) ? defaultValue : maxDate;
		setDate(dateValue);
		dateRef.current.value = dateValue;
	}, [defaultValue, maxDate]);

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: dateRef.current,
			path: 'value',

			clearValue(ref) {
				ref.value = '';
			},

			setValue(ref, value) {
				ref.setNativeProps({ text: value });
				const dateValue = moment(maxDate) > moment(value) ? value : maxDate;
				setDate(dateValue);
				dateRef.current.value = value;
			},
		});
	}, [fieldName, registerField]);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);

		if (dateRef.current) {
			dateRef.current.value = currentDate;
		}
	};

	const showMode = () => {
		setShow(true);
	};

	const showDatepicker = () => {
		showMode();
	};

	const getFormattedDate = () => {
		return date ? moment(date).format(dateFormat) : '';
	};

	return (
		<TouchableOpacity onPress={showDatepicker}>
			<View style={[styles.container, formGroupStyle]}>
				{label && (
					<Text style={[styles.label, controlLabelStyle]}>
						{label}
					</Text>
				)}
				<Text
					ref={dateRef}
					style={[styles.textInput, textboxStyle]}>
					{getFormattedDate().toString()}
				</Text>
				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date ? date : maxDate}
						maximumDate={maxDate}
						is24Hour={true}
						display="spinner"
						onChange={onChange}
					/>
				)}
				{!!error && (
					<Text accessibilityLiveRegion="polite" style={[styles.error, errorBlockStyle]}>
						{error}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	label: {
		marginBottom: 8,
		fontSize: 13,
	},
	textInput: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		fontSize: 17,
	},
	error: {
		color: '#f00',
		fontSize: 12,
	},
});

export default memo(DatePicker);
