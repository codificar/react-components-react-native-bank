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

// Unform Rocketseat
import { Form } from '@unform/mobile';

// Biblioteca e funcoes de validaçao
import * as Yup from 'yup';
import { validaCPF, validaCNPJ } from './validation';

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

//Lib de traduçoes
import { strings } from '../../Locales/i18n';

const TypeTitular = {
	individual: strings('bank_lib.individual'),
	company: strings('bank_lib.corporative'),
};

const TypeAccount = {
	conta_corrente: strings('bank_lib.current_account'),
	conta_corrente_conjunta: strings('bank_lib.joint_current_account'),
	conta_poupanca: strings('bank_lib.saving_account'),
	conta_poupanca_conjunta: strings('bank_lib.joint_saving_account'),
};

const BankFormBrasil = (props, ref) => {
	const { banks, minAge, initialData, stylesheet , submit } = props;
	const [typeTitular, setTypeTitular] = useState(initialData?.typeTitular);
	const [bank, setBank] = useState(undefined);

	const formRef = useRef(null);

	// Configura o Valor máximo permitido para a data
	let maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() - minAge);

	// Em caso de ediçao dos dados, seta o banco do component para o indicado no initialData
	useEffect(() => {
		formRef.current.setFieldValue('accountTitular', initialData.accountTitular);
		formRef.current.setFieldValue('birthDate', initialData.birthDate);

		if (initialData?.bank && banks) {
			const b = banks.find((value) => value.id === initialData.bank);
			if (b) {
				setBank(b);
			}
		}
	}, [banks, initialData.bank, initialData.accountTitular, initialData.birthDate]);

	/**
	 * Realiza as validaçoes dos campos para enviar o form
	 * @param {Object} data
	 * @param {string} data.account
	 * @param {string} accountTitular
	 * @param {string} agency
	 * @param {number} bank
	 * @param {Date} date
	 * @param {string} document
	 * @param {string} typeAccount
	 * @param {string} typeTitular
	 * @param {Object} reset
	 */
	const handleSubmit = async (data, { reset }) => {
		try {
			const schema = Yup.object().shape({
				typeTitular: Yup.string().required('bank_lib.empty_document'),

				typeAccount: Yup.string().required('bank_lib.empty_account_type'),

				bank: Yup.string().required('bank_lib.empty_bank'),

				document: Yup.string()
					.when('typeTitular', {
						is: 'company',
						then: Yup.string()
							.test(
								'validCNPJ',
								'bank_lib.invalid_cnpj',
								(cnpj) => validaCNPJ(cnpj),
							)
							.required('bank_lib.empty_cnpj'),
					})
					.when('typeTitular', {
						is: 'individual',
						then: Yup.string()
							.test('validCPF', 'bank_lib.invalid_cpf', (cpf) =>
								validaCPF(cpf),
							)
							.required('bank_lib.empty_cpf'),
					}),

				agency: Yup.string()
					.required('bank_lib.empty_agency')
					.max(bank?.agency_max_length, 'bank_lib.agency_max'),

				agencyDigit: Yup.string()
					.test(
						'validAgencyDigit',
						'bank_lib.agency_digit_required',
						(value) =>
							bank?.agency_digit_required
								? value.length > 0
								: true,
					)
					.test(
						'validAgencyDigitLength',
						'bank_lib.agency_digit_length',
						(value) =>
							bank?.agency_digit_required
								? value.length <= bank?.agency_digit_max_length
								: true,
					).nullable(),

				account: Yup.string()
					.required('bank_lib.empty_account')
					.min(2, 'bank_lib.account_min')
					.max(bank?.account_max_length, 'bank_lib.account_max'),

				accountDigit: Yup.string()
					.test(
						'validAccountDigit',
						'bank_lib.account_digit_required',
						(value) =>
							bank?.account_digit_required
								? value.length > 0
								: true,
					)
					.test(
						'validAccountDigitLength',
						'bank_lib.account_digit_length',
						(value) =>
							bank?.account_digit_required
								? value.length <= bank?.account_digit_max_length
								: true,
					).nullable(),

				accountTitular: Yup.string().required(
					'bank_lib.empty_account_titular',
				),
			});
			await schema.validate(data, { abortEarly: false });

			submit(data);
			//reset();
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
	};

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
		formRef.current.setFieldValue('accountDigit', '');
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
				initialData={initialData}
				>
				<DropdownPicker
					stylesheet={stylesheet}
					name="typeTitular"
					label={strings('bank_lib.account_type_titular')}
					onChange={(value) => changeTypeTitular(value)}
					datasource={TypeTitular}
				/>

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
						onSelectBank={(value) => changeBank(value)}
						clearErrors={() =>
							formRef.current.setFieldError('bank', '')
						}
					/>
				</View>
				
				<View style={styles.row}>
					<View style={styles.column}>
						<AgencyInput
							label={strings('bank_lib.agency')}
							stylesheet={stylesheet}
							name="agency"
							keyboardType="numeric"
							agencyMaxLength={bank?.agency_max_length}
						/>
					</View>
					<View style={styles.column}>
						<AgencyDigitInput
							stylesheet={stylesheet}
							name="agencyDigit"
							label={strings('bank_lib.agency_digit')}
							keyboardType="numeric"
							agencyDigitRequired={Boolean(
								Number(bank?.agency_digit_required),
							)}
							agencyDigitMaxLength={ bank?.agency_digit_max_length }
						/>
					</View>
				</View>

				<View style={styles.row}>
					<View style={styles.column}>
						<AccountInput
							stylesheet={stylesheet}
							name="account"
							label={strings('bank_lib.account')}
							keyboardType="numeric"
							accountMaxLength={bank?.account_max_length}
						/>
					</View>
					<View style={styles.column}>
						<AccountDigitInput
							stylesheet={stylesheet}
							name="accountDigit"
							label={strings('bank_lib.account_digit')}
							keyboardType="numeric"
							accountDigitRequired={Boolean(
								Number(bank?.account_digit_required),
							)}
							accountDigitMaxLength={ bank?.account_digit_max_length }
						/>
					</View>
				</View>

				<Input
					name="accountTitular"
					label={strings('bank_lib.account_titular')}
					stylesheet={stylesheet}
				/>

				{typeTitular === 'individual' ? (
					<InputMask
						type={'cpf'}
						stylesheet={stylesheet}
						name="document"
						label="CPF"
					/>
				) : typeTitular === 'company' ? (
					<InputMask
						type={'cnpj'}
						stylesheet={stylesheet}
						name="document"
						label="CNPJ"
					/>
				) : undefined}

				<DatePicker
					dateFormat={strings('bank_lib.formatdate')}
					stylesheet={stylesheet}
					name="birthDate"
					label={strings('bank_lib.titular_birth_day')}
					maxDate={maxDate}
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

export default forwardRef(BankFormBrasil);
