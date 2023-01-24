import * as React from 'react';
import { FormHandles } from '@unform/core';

export interface BankFormData {
	bank: number;
	typeAccount:
		| 'conta_corrente'
		| 'conta_corrente_conjunta'
		| 'conta_poupanca'
		| 'conta_poupanca_conjunta';
	agency: string;
	account: string;
	accountDigit: string;
	agencyDigit: string;
	accountTitular: string;
}

interface Params {
	id: number;
	token: string;
	lang: string;
	country_iso?: string;
}

interface BankFormProps {
	route: string;
	params: Params;
	minAge?: number;
	initialData?: BankFormData | undefined;
	onSubmit: (data) => void;
}

interface BankRef extends FormHandles {
	current: any;
}

export interface Bank {
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

declare const BankForm: React.ForwardRefRenderFunction<BankRef, BankFormProps>;

export default BankForm;

