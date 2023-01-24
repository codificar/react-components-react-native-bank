import * as React from 'react';
import { TextInputProps } from 'react-native';

interface Bank {
	id: number;
	name: string;
	code: string;
	agency_max_length: number;
	agency_digit_required: number;
	agency_digit_max_length: number;

	account_max_length: number;
	account_digit_required: number;
	account_digit_max_length: number;
}

export interface BankSearchInputProps extends TextInputProps {
	/**
	 * @description Unform field name
	 */
    name: string;

	/**
	 * @description Field label
	 */
    label: string;
    
	/**
	 * @description Field label
	 */
    banks: Array<Bank>;

	/**
	 * @description Field label
	 */
    selectedBank: number;

	/**
	 * @description Field label
	 */
    stylesheet: any;

    /**
     * Function that captures the selected bank by user
     * @typedef {Bank} bank
     * @param {number} id
     * @param {string} name
     * @param {string} code
     * @param {number} agency_max_length
     * @param {number} agency_digit_required
     * @param {number} agency_digit_max_length
     * @param {number} account_max_length
     * @param {number} account_digit_required
     * @param {number} account_digit_max_length
     */
    onSelectBank: (bank: Bank) => void;

    /**
	 * Function to clear the errors of unform
	 */
	clearErrors: () => void;
}
declare const BankSearchInput: React.FC<BankSearchInputProps>;

export default BankSearchInput;
