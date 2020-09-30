import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';

import BankFormBrasil from './src/Containers/BrasilForm';
import BankFormAngola from './src/Containers/AngolaForm';

let defaultForm = {
	bank: undefined,
	typeAccount: 'conta_corrente',
	agency: '',
	account: '',
	accountDigit: '',
	agencyDigit: '',
	document: '',
};

const initialDataSchema = {
	bank: value => parseInt(value) === Number(value),
	typeAccount: value => value ==='conta_corrente'
	|| value === 'conta_corrente_conjunta'
	|| value === 'conta_poupanca'
	|| value === 'conta_poupanca_conjunta',
}

const BankForm = (
	props,
	ref,
) => {
	const [banks, setBanks] = useState([]);
	const { route, initialData, onSubmit, params, stylesheet } = props;

	/**
	 * @returns Array com bancos retornados da API
	 **/
	useEffect(() => {
		axios
			.get(route + '/filter', {
				params,
			})
			.then((response) => {
				const result = response.data;
				setBanks(result);
			})
			.catch((err) => {
				console.error('Erro bank request: ', err);
			});
	}, [params, route]);

	/**
	 * @returns Valida se os dados passados inicialmente para o form sao válidos!
	 **/
	const initialDataValid = () => {
		if(initialData){
			var errors = Object.keys(initialDataSchema)
			.filter(key => !initialDataSchema[key](initialData[key]))
			.map(key => new Error(`${key} is invalid.`));

			if (errors.length > 0) {
				return false;
			} else {
				return true;
			}
		}
		return false;
	}

	return (
		<>
			{params.lang === 'pt-ao' ? (
				<BankFormAngola 
				ref={ref}
				stylesheet={stylesheet}
				initialData={initialDataValid() ? initialData : defaultForm}
				banks={banks}
				submit={(data) => onSubmit(data)}
			/>
			) : (
				<BankFormBrasil
					ref={ref}
					stylesheet={stylesheet}
					initialData={initialDataValid() ? initialData : defaultForm}
					banks={banks}
					submit={(data) => onSubmit(data)}
				/>
			)}
		</>
	);
};

export default forwardRef(BankForm);
