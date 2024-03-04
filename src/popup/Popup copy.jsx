import './Popup.css'
import { fillCPF, fillNome, fillCEP, fillCNPJ, fillPet, fillPeso, fillCelular, fillEmail } from './helpers/fillInputs';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { generateCNPJ, generateCPF } from '@brazilian-utils/brazilian-utils'

export const fakeData = {
  cpf: generateCPF(),
  cnpj: generateCNPJ(),
  nome: faker.person.fullName(),
  CEP: faker.location.zipCode(),
  rua: faker.location.street(),
  cidade: faker.location.city(),
  estado: faker.location.state(),
  dataNascimento: faker.date.past(50, '1995-12-31').toLocaleDateString('pt-BR'),
  pet: faker.animal.dog(),
  dataNascimentoPet: faker.date.past(25).toLocaleDateString('pt-BR'),
  peso: faker.number.bigInt(30),
  celular: faker.phone.number(),
  email: faker.internet.email(),
}

export const Popup = () => {
  const executeScript = async (func, args) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: func,
      args: [args],
    });
  }


  const agoraVai = async () => {
    console.log('Agora vai', fakeData.cpf)
    await executeScript(fillCPF, { cpf: fakeData.cpf });
    // await executeScript(fillNome, { nome: fakeData.nome });
    // await executeScript(fillCEP, { CEP: fakeData.CEP });
    // await executeScript(fillCNPJ, { cnpj: fakeData.cnpj });
    // await executeScript(fillPet, { pet: fakeData.pet });
    // await executeScript(fillPeso, { peso: fakeData.peso });
    // await executeScript(fillCelular, { celular: fakeData.celular });
    // await executeScript(fillEmail, { email: fakeData.email });
    // Add similar lines for other inputs...
  }

  return (
    <main>
      <h3>Popup Page</h3>
      <div className="calc">
        <button onClick={() => agoraVai()}>
          Vai
        </button>
      </div>
    </main>
  )
}

export default Popup