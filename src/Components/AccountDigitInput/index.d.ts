import * as React from 'react';
import { TextInputProps } from 'react-native';

interface AccountDigitInputProps extends TextInputProps {
	/**
	 * @description Unform field name
	 */
	name: string;
	
	/**
	 * @description Field label
	 */
	label: string;

	/**
	 *  @default false
	 */
	accountDigitRequired?: boolean;
	
	/**
	 * @description Max length of account digit field
	 */
	accountDigitMaxLength?: number;

	/**
	 * @description stylesheet
	 */
	stylesheet: any;
}

interface AccountDigitRef {
	focus(): void;
}

declare const AccountDigitInput: React.ForwardRefRenderFunction<AccountDigitRef,AccountDigitInputProps>;

export default React.forwardRef(AccountDigitInput);