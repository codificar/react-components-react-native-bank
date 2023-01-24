import * as React from 'react';
import { TextInputProps } from 'react-native';

interface AccountInputProps extends TextInputProps {
	/**
	 * @description Unform field name
	 */
    name: string;
    
    /**
	 * @description Field label
	 */
    label: string;

	/**
	 * @description Max length of account field
	 */
    accountMaxLength?: number;

	/**
	 * @description stylesheet
	 */
    stylesheet: any;
}

interface AccountRef {
	focus(): void;
}

declare const AccountInput: React.ForwardRefRenderFunction<AccountRef,AccountInputProps>;

export default React.forwardRef(AccountInput);