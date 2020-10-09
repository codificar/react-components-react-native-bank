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

interface AgencyDigitRef {
	focus(): void;
}

declare const AgencyDigitInput: React.ForwardRefRenderFunction<AgencyDigitRef,AgencyDigitInputProps>;

export default React.forwardRef(AgencyDigitInput);