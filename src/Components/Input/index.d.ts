import * as React from 'react';
import { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
	/**
	 * @description Unform field name
	 */
    name: string;

    /**
	 * @description Field label
	 */
    label: string;

    /**
	 * @description Stylesheet
	 */
    stylesheet: any;
}

declare const Input: React.FC<InputProps>;

export default Input;