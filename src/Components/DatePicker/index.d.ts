import * as React from 'react';
import { TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {


	dateFormat: string,

	/**
	 * @description Unform field name
	 */
    name: string;

    /**
	 * @description Field label
	 */
    label: string;

    /**
	 * @description Maximum allowed date
	 */
    maxDate: Date;

    /**
	 * @description Stylesheet
	 */
    stylesheet: any
}

declare const DatePicker: React.FC<InputProps>;
export default React.memo(DatePicker);