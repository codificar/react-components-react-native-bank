import * as React from 'react';
import { TextInputProps } from 'react-native';

interface AgencyDigitInputProps extends TextInputProps {
	/**
	 * @description Unform field name
	 */
    name: string;
    
	/**
	 * @description Field label
	 */
    label: string;

	/**
	 * @default false
	 */
    agencyDigitRequired?: boolean;

	/**
	 * @description Max length of agency digit field
	 */
    agencyDigitMaxLength?: number;

	/**
	 * @description stylesheet
	 */
    stylesheet: any;
}

declare const AgencyDigitInput: React.FC<AgencyDigitInputProps>;

export default AgencyDigitInput;