import * as React from 'react';
import { TextInputProps } from 'react-native';

interface AgencyInputProps extends TextInputProps {
		/**
		 * @description Unform field name
		 */
		name: string;
		
		/**
		 * @description Field label
		 */
		label: string;

		/**
		 * @description Max length of agency field
		 */
		agencyMaxLength?: number;

		/**
		 * @description stylesheet
		 */
		stylesheet: any;
}

interface AgencyRef {
	focus(): void;
}

declare const AgencyInput: React.ForwardRefRenderFunction<AgencyRef,AgencyInputProps>;

export default React.forwardRef(AgencyInput);