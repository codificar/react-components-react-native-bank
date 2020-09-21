import React, { useState, useRef, useEffect } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useField } from '@unform/core';

const BankSearchInput = (props) => {
	const {
		banks = [],
		clearErrors,
		label,
		name,
		onSelectBank,
		selectedBank,
		stylesheet,
	} = props;

	const [input, setInput] = useState('');
	const [bankArray, setBankArray] = useState([]);

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
		const bank = banks.find((value) => value.id === selectedBank);
		if (bank) {
			inputRef.current.value = selectedBank;
			setInput(bank.code + ' - ' + bank.name);
		} else {
			inputRef.current.value = undefined;
		}
	}, [banks, selectedBank, onSelectBank]);

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

	const clear = () => {
		inputRef.current.value = '';
		setBankArray([]);
		return setInput('');
	};

	/**
	 *
	 * @param {string} bank
	 */
	const handleTextInputChange = (text) => {
		clearErrors();
		if (text.length !== 0) {
			const bankFiltered = banks.filter((value) => {
				const bankName = value.code + ' - ' + value.name.toLowerCase();
				return bankName.includes(text.toLowerCase());
			});
			setInput(text);
			setBankArray(bankFiltered);
			if (bankFiltered.length === 0) {
				inputRef.current.value = undefined;
			}
		} else {
			setInput('');
			setBankArray([]);
		}
	};

	/**
	 * @param item
	 */
	const selectBank = (item) => {
		if (item) {
			if (inputRef.current) {
				onSelectBank(item);
				setInput(item.code + ' - ' + item.name);
				inputRef.current.value = item.id;
			}
			setBankArray([]);
		}
	};

	return (
		<>
			{label && (
				<Text style={[styles.label, controlLabelStyle]}>{label}</Text>
			)}
			<View style={styles.input}>
				<TextInput
					ref={inputRef}
					style={[styles.textInput, textboxStyle, { borderBottomWidth: 0 }]}
					value={input}
					onChangeText={(text) => handleTextInputChange(text)}
					autoFocus
					{...props}
				/>
				<View style={styles.areaIcons}>
					{input ? (
						<Icon
							name="close"
							size={20}
							color="#777"
							onPress={() => clear()}
						/>
					) : null}
				</View>
			</View>
			<FlatList
				data={bankArray}
				keyExtractor={(x, i) => i.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => selectBank(item)}
						activeOpacity={0.6}
						style={styles.item}>
						<Text>{item.code + ' - ' + item.name}</Text>
					</TouchableOpacity>
				)}
			/>
			{!!error && (
				<Text accessibilityLiveRegion="polite" style={[styles.error, errorBlockStyle]}>
					{error}
				</Text>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	label: {
		fontSize: 13,
	},
	input: {
		borderBottomWidth: 0.5,

		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	textInput: {
		fontSize: 17,

		width: '90%',
		marginLeft: 5,
	},
	button: {
		height: 50,
		width: 60,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
		marginRight: 20,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	item: {
		borderBottomColor: '#ccc',
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingVertical: 15,
		marginHorizontal: 15,
	},
	areaIcons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginRight: 20,
	},
	error: {
		color: '#f00',
		fontSize: 12,
	},
});

export default BankSearchInput;
