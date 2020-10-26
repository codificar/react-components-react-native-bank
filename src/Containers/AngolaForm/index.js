import React, {
	forwardRef,
	useEffect,
	useRef,
	useState,
	useImperativeHandle,
} from 'react';
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import { Form } from '@unform/mobile';

import * as Yup from 'yup';
import { strings } from '../../Locales/i18n';

// Fields do Formulário
import Input from '../../Components/Input';
import DropdownPicker from '../../Components/DropdownPicker';
import BankSearchInput from '../../Components/BankSearchInput';

const TypeAccount = {
	conta_corrente: strings('bank_lib.current_account'),
	conta_corrente_conjunta: strings('bank_lib.joint_current_account'),
	conta_poupanca: strings('bank_lib.saving_account'),
	conta_poupanca_conjunta: strings('bank_lib.joint_saving_account'),
};

const BankFormAngola = ( props , ref) => {

	const { banks, initialData, stylesheet , submit } = props;
	const [bank, setBank] = useState(undefined);

	const formRef = useRef(null);
	const agencyRef = useRef(null);
	const accountRef = useRef(null);

	// Em caso de ediçao dos dados, seta o banco do component para o indicado no initialData
	useEffect(() => {

		if (initialData?.bank && banks) {
			const b = banks.find((value) => value.id === initialData.bank);
			if (b) {
				setBank(b);
			}
		}
	}, [banks, initialData.bank]);

	useEffect(() => {
		Keyboard.addListener('keyboardDidHide', hide);
	
		return () => Keyboard.removeListener('keyboardDidHide', hide);
	})
	
	const hide = () => {
		const type = formRef.current.getFieldValue('typeAccount')
		const ag = formRef.current.getFieldValue('agency')
		const ac = formRef.current.getFieldValue('account')
		
		if(bank && type && ag && ac){
			formRef.current.submitForm();
		}

	}

	/**
	 * Realiza as validaçoes dos campos para enviar o form
	 * @param {} data
	 * @param {} reset
	 */
	async function handleSubmit(data, { reset }) {

		data.agencyDigit = 0;
		data.accountDigit = 0;
		
		try {
			formRef.current.setErrors({});
			const schema = Yup.object().shape({

				typeAccount: Yup.string().required('bank_lib.empty_account_type'),

				bank: Yup.string().required('bank_lib.empty_bank'),

				agency: Yup.string()
					.required('bank_lib.empty_agency')
					.min(3, 'bank_lib.agency_min'),


				account: Yup.string()
					.required('bank_lib.empty_account')
					.min(3, 'bank_lib.account_min'),

			});

			await schema.validate(data, { abortEarly: true });

			submit(data);

		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				const errorMessages = {};
				err.inner.forEach((error) => {
					errorMessages[error.path] = strings(error.message);
				});
				formRef.current.setErrors(errorMessages);
			}
			submit(undefined);
		}
	}

// Encaminha os métodos de referencia do form
useImperativeHandle(ref, () => ({
	submitForm() {
		formRef.current.submitForm();
	},
}));

/**
 * Reseta os campos de agencia e digito da agencia para ''
 */
const clearAgencyFiels = () => {
	formRef.current.setFieldValue('agency', '');
};

/**
 * Reseta os campos da conta e digito da conta para ''
 */
const clearAccountFiels = () => {
	formRef.current.setFieldValue('account', '');
};

/**
 * Troca o banco do componente para pegar as novas configuraçoes de validacao
 *
 * @param newBank
 */
const changeBank = (newBank) => {
	setBank(newBank);
	clearAgencyFiels();
	clearAccountFiels();
};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Form
				ref={formRef}
				onSubmit={handleSubmit}
				initialData={initialData}>

				<DropdownPicker
					stylesheet={stylesheet}
					name="typeAccount"
					label={strings('bank_lib.account_type')}
					onChange={() => clearAccountFiels()}
					datasource={TypeAccount}
				/>

				<View style={styles.bankSearch}>
					<BankSearchInput
						name="bank"
						label={strings('bank_lib.bank')}
						banks={banks}
						selectedBank={bank?.id}
						stylesheet={stylesheet}
						onSelectBank={(value) => {
							changeBank(value);
							agencyRef.current?.focus();
						}}
						clearErrors={() =>
							formRef.current.setFieldError('bank', '')
						}
					/>
				</View>

				<View style={{ marginTop: 10 }}>
					<Input
						ref={agencyRef}
						label={strings('bank_lib.agency')}
						stylesheet={stylesheet}
						name="agency"
						onEndEditing={() => accountRef.current?.focus()}
					/>
				</View>

				<Input
					ref={accountRef}
					stylesheet={stylesheet}
					name="account"
					label={strings('bank_lib.account')}
					onEndEditing={() => formRef.current.submitForm()}
				/>
			</Form>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	bankSearch: {
		maxHeight: '40%',
	},
	row: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	column: {
		width: '47%',
	},
});

export default forwardRef(BankFormAngola);
