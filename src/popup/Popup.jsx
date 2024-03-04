
import './Popup.css'
import { fakerPT_BR as faker } from '@faker-js/faker';
import { generateCNPJ, generateCPF } from '@brazilian-utils/brazilian-utils'



export const Popup = () => {
  const agoraVai = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const fakeData = {
      CEP: faker.location.zipCode(),
      cidade: faker.location.city(),
      CPF: generateCPF(),
      cnpj: generateCNPJ(),
      Data: faker.date.past({ years: 50 }).toLocaleDateString('pt-BR'),
      dataNascimentoPet: faker.date.past({ years: 25 }).toLocaleDateString('pt-BR'),
      email: faker.internet.email(),
      estado: faker.location.state(),
      nome: faker.person.fullName(),
      pet: faker.person.firstName(),
      raca: faker.animal.dog(),
      peso: faker.number.float({ min: 10, max: 100, fractionDigits: 3 }),
      rua: faker.location.street(),
      Telefone: faker.phone.number(),
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function fillAllInputs(fakeData) {
        const labels = document.querySelectorAll('label');
        const inputs = document.querySelectorAll('input');
        Object.keys(fakeData).forEach(key => {
          labels.forEach((label) => {
            if (label.textContent.toLowerCase().includes(key.toLowerCase())) {
              const input = document.querySelector(`#${label.getAttribute('for')}`);
              if (input) {
                input.value = fakeData[key];
              }
            }
          });
          inputs.forEach((input) => {
            if (input.placeholder.toLowerCase().includes(key.toLowerCase()) || input.name.toLowerCase().includes(key.toLowerCase()) || input.id.toLowerCase().includes(key.toLowerCase())) {
              input.value = fakeData[key];
            }
          });
        });
      },
      args: [fakeData],
    });
  }



  return (
    <main>
      <h3>Fast Filler</h3>
      <div className="calc">
        <button onClick={() => agoraVai()}>
          Vai
        </button>
      </div>

    </main>
  )
}

export default Popup
