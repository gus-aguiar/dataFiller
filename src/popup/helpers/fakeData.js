import { fakerPT_BR as faker } from '@faker-js/faker';
import { generateCNPJ, generateCPF } from '@brazilian-utils/brazilian-utils'

export const fakeData = () => {
    return {
        nome: faker.person.fullName(),
        cpf: generateCPF(),
        cnpj: generateCNPJ(),
        CEP: faker.location.zipCode(),
        rua: faker.location.street(),
        cidade: faker.location.city(),
        estado: faker.location.state(),
        dataNascimento: faker.date.past({ years: 50, refDate: '1995-12-31' }).toLocaleDateString('pt-BR'),
        pet: faker.animal.dog(),
        dataNascimentoPet: faker.date.past(25).toLocaleDateString('pt-BR'),
        peso: faker.number.bigInt(30),
        celular: faker.phone.number(),
        email: faker.internet.email(),
    }
}

