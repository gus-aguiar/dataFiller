function fillInput({ value, labelText, defaultPlaceholderText, userPlaceholderText = '' }) {
    if (document) {
        return function () {
            const labels = document.querySelectorAll('label');
            labels.forEach((label) => {
                if (label.textContent === labelText) {
                    const input = document.querySelector(`#${label.getAttribute('for')}`);
                    if (input && (input.placeholder === defaultPlaceholderText || input.placeholder === userPlaceholderText)) {
                        input.value = value;
                    }
                }
            });
        }

    } else {
        return function () {
            console.error('Document not found');
        }
    }
}

export function fillCPF({ cpf, userPlaceholderText = '' }) {
    return fillInput({
        value: cpf,
        labelText: 'CPF',
        defaultPlaceholderText: 'Digite seu CPF',
        userPlaceholderText,
    });
}

export function fillNome({ nome, userPlaceholderText = '' }) {
    return fillInput({
        value: nome,
        labelText: 'Nome',
        defaultPlaceholderText: 'Digite seu nome',
        userPlaceholderText,
    });
}

export function fillCEP({ cep, userPlaceholderText = '' }) {
    return fillInput({
        value: cep,
        labelText: 'CEP',
        defaultPlaceholderText: 'Digite seu CEP',
        userPlaceholderText,
    });
}

export function fillPet({ pet, userPlaceholderText = '' }) {
    return fillInput({
        value: pet,
        labelText: 'Pet',
        defaultPlaceholderText: 'Digite o nome do seu pet',
        userPlaceholderText,
    });
}

export function fillPeso({ peso, userPlaceholderText = '' }) {
    return fillInput({
        value: peso,
        labelText: 'Peso',
        defaultPlaceholderText: 'Digite seu peso',
        userPlaceholderText,
    });
}

export function fillCNPJ({ cnpj, userPlaceholderText = '' }) {
    return fillInput({
        value: cnpj,
        labelText: 'CNPJ',
        defaultPlaceholderText: 'Digite seu CNPJ',
        userPlaceholderText,
    });
}

export function fillCelular({ celular, userPlaceholderText = '' }) {
    return fillInput({
        value: celular,
        labelText: 'Celular',
        defaultPlaceholderText: 'Digite seu número de celular',
        userPlaceholderText,
    });
}

export function fillEmail({ email, userPlaceholderText = '' }) {
    return fillInput({
        value: email,
        labelText: 'Email',
        defaultPlaceholderText: 'Digite seu email',
        userPlaceholderText,
    });
}