import * as React from 'react';
import { PickerProps } from '@react-native-community/picker/typings/Picker';

interface DropDownProps extends PickerProps {
	/**
	 * @description Unform field name
	 */
    name: string;

	/**
	 * @description Field label
	 */
    label?: string;
    
    /**
	 * @description Field label
	 */
    datasource: any;
    
    /**
     * Function that handle the changed field
	 */
    onChange: (value: any) => void;

    /**
	 * @description Stylesheet
	 */
    stylesheet: any;
}

declare const DropdownPicker: React.FC<DropDownProps>;

export default DropdownPicker;