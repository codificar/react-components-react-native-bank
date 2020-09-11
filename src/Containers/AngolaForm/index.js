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
import InputMask from '../../Components/InputMask';
import DropdownPicker from '../../Components/DropdownPicker';
import DatePicker from '../../Components/DatePicker';
import BankSearchInput from '../../Components/BankSearchInput';
import AgencyInput from '../../Components/AgencyInput';
import AccountInput from '../../Components/AccountInput';
import AgencyDigitInput from '../../Components/AgencyDigitInput';
import AccountDigitInput from '../../Components/AccountDigitInput';

const TypeTitular = {
	individual: strings('bank_account.individual'),
	company: strings('bank_account.corporative'),
};

const TypeAccount = {
	conta_corrente: strings('bank_account.current_account'),
	conta_corrente_conjunta: strings('bank_account.joint_current_account'),
	conta_poupanca: strings('bank_account.saving_account'),
	conta_poupanca_conjunta: strings('bank_account.joint_saving_account'),
};

const BankFormAngola = ( props , ref) => {

	const { banks, minAge, initialData, stylesheet , submit } = props;
	const [typeTitular, setTypeTitular] = useState(initialData?.typeTitular);
	const [bank, setBank] = useState(undefined);

	const formRef = useRef(null);

	// Em caso de ediçao dos dados, seta o banco do component para o indicado no initialData
	useEffect(() => {
		formRef.current.setFieldValue('accountTitular', initialData.accountTitular);

		if (initialData?.bank && banks) {
			const b = banks.find((value) => value.id === initialData.bank);
			if (b) {
				setBank(b);
			}
		}
	}, [banks, initialData.bank, initialData.accountTitular, initialData.birthDate]);

	/**
	 * Realiza as validaçoes dos campos para enviar o form
	 * @param {} data
	 * @param {} reset
	 */
	async function handleSubmit(data, { reset }) {
		console.log(data);
		try {
			const schema = Yup.object().shape({

				typeTitular: Yup.string().required('register.empty_document'),

				typeAccount: Yup.string().required('register.empty_account_type'),

				bank: Yup.string().required('register.empty_bank'),

				document: Yup.string().required('register.empty_cpf'),

				agency: Yup.string()
					.required('register.empty_agency')
					.min(3, 'register.agency_min'),

				agencyDigit: Yup.string().nullable(),

				account: Yup.string()
					.required('register.empty_account')
					.min(3, 'register.account_min'),

				accountTitular: Yup.string().required(
					'register.empty_account_titular',
				),
			});

			await schema.validate(data, { abortEarly: false });

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
	formRef.current.setFieldValue('agencyDigit', '');
};

/**
 * Reseta os campos da conta e digito da conta para ''
 */
const clearAccountFiels = () => {
	formRef.current.setFieldValue('account', '');
};

/**
 * Troca o tipo de titular da conta do banco. (cpf, cnpj)
 * @param {string} 'individual' || 'company'
 */
const changeTypeTitular = (value) => {
	setTypeTitular(value);
	formRef.current.setFieldValue('document', '');
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
					name="typeTitular"
					label={strings('register.account_type_titular')}
					onChange={(value) => changeTypeTitular(value)}
					datasource={TypeTitular}
				/>

				<DropdownPicker
					stylesheet={stylesheet}
					name="typeAccount"
					label={strings('register.account_type')}
					onChange={() => clearAccountFiels()}
					datasource={TypeAccount}
				/>

				<View style={styles.bankSearch}>
					<BankSearchInput
						name="bank"
						label={strings('register.bank')}
						banks={banks}
						selectedBank={bank?.id}
						stylesheet={stylesheet}
						onSelectBank={(value) => changeBank(value)}
						clearErrors={() =>
							formRef.current.setFieldError('bank', '')
						}
					/>
				</View>

				<View style={styles.row}>
					<View style={styles.column}>
						<AgencyInput
							label={strings('register.agency')}
							stylesheet={stylesheet}
							name="agency"
						/>
					</View>
					<View style={styles.column}>
						<AgencyDigitInput
							label={strings('register.agency_digit')}
							stylesheet={stylesheet}
							name="agencyDigit"
						/>
					</View>
				</View>

				<Input
					stylesheet={stylesheet}
					name="account"
					label={strings('register.account')}
				/>

				<Input
					name="accountTitular"
					label={strings('register.account_titular')}
					stylesheet={stylesheet}
				/>

				<Input
					stylesheet={stylesheet}
					name="document"
					label={strings('register.document')}
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
		width: '45%',
	},
});

export default forwardRef(BankFormAngola);
