# react-native-bank
A bank CRUD component to react native.

## Install
add in package.json:
```bash
"react-native-bank": "git+https://libs:ofImhksJ@git.codificar.com.br/react-components/react-native-bank.git",
```

## Usage

```javascript

import BankForm from 'react-native-bank';

    constructor(props) {
        super(props);

        this.ref = createRef(null);

        this.state = {
            value: {
                accountTitular: '',
                typeTitular: '',
                bank: 1,
                agency: '',
                account: '',
                accountDigit: '',
                agencyDigit: '',
                typeAccount: '',
                document: '',
                birthDate: new Date(),
            },
        };
    }

    onSubmit(value) {
        if (value) {
            this.setState({value});
            this.update();
        }
    }

    onPress() {
        this.ref.current?.submitForm();
    }

    <BankForm
        ref={this.ref}
        stylesheet={stylesheet}
        minAge={13}
        initialData={this.state.value}
        params={{id: '', token: '', lang: 'pt-ao', country_iso: 'AO'}}
        route={constants.BASE_URL + '/api/banks'}
        onSubmit={(value) => this.onSubmit(value)}
    />

    <TouchableOpacity
        onPress={() => this.onPress()}>
        <Text>Salvar</Text>
    </TouchableOpacity>

```

## Properties

| Prop  | Default  | Type | isRequired | Description |
| :------------ |:---------------:| :---------------:|:---------------:|--
| ref | '' | React Ref | ✔️ | reference to the BankForm element|
| stylesheet | - | stylesheet | ✔️ | formStructConfig (whitelabel.js) |
| minAge | 18 | `number` |  | minimum age to create account |
| initialData | - | `object` | ✔️ | parameters to make the request in the API. |
| params | - | `object` | ✔️ | parameters to make the request in the API. |
| route | '' | `string` | ✔️ | route for API request. |
| onSubmit | - | `function` | ✔️ | function that captures the form data submitted by the user|
