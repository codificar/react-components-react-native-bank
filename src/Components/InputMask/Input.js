import React, { useRef, useEffect, forwardRef } from 'react';

import { TextInput } from 'react-native';

import { useField } from '@unform/core';

const Input = (
	props,
	_ref,
) => {
	const { name, rawValue } = props;
	const inputRef = useRef(null);
	const { fieldName, registerField, defaultValue } = useField(name);

	useEffect(() => {
		inputRef.current.value = rawValue;
	}, [rawValue]);

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value',
			clearValue(reference) {
				reference.value = '';
				reference.clear();
			},
			setValue(reference, value) {
				reference.setNativeProps({ text: value });
				inputRef.current.value = value;
			},
		});
	}, [fieldName, registerField]);

	return <TextInput ref={inputRef} defaultValue={defaultValue} {...props} />;
};

export default forwardRef(Input);
