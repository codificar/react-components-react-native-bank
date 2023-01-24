import * as React from 'react';
import { TextInputMaskProps } from 'react-native-masked-text';

export interface InputProps extends TextInputMaskProps {
	/**
	 * @description Unform field name
	 */
    name: string;

    /**
	 * @description Field label
	 */
    label: string;

    /**
	 * @description TextInputMask type
	 */
    type: string;

    /**
	 * @description Stylesheet
	 */
    stylesheet: any;
}

declare const InputMask: React.FC<InputProps>;

export default InputMask;