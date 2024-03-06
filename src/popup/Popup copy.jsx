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
        const inputs = document.querySelectorAll('input');
        const inputClasses = JSON.parse(localStorage.getItem('inputClasses')) || {};
        let selectedInput = null;

        // Adiciona uma classe a cada input
        inputs.forEach((input, index) => {
          const hash = `input-${index}`;
          input.classList.add(hash);
          if (!inputClasses[hash]) {
            inputClasses[hash] = null;
          }
          input.addEventListener('click', () => {
            selectedInput = hash;
            input.style.outline = '2px solid red';
          });
        });

        // Cria um seletor para cada input
        inputs.forEach((input, index) => {
          const select = document.createElement('select');
          select.id = `select-${index}`;

          // Cria uma opção para cada chave em fakeData
          Object.keys(fakeData).forEach((key) => {
            const option = document.createElement('option');
            option.value = key;
            option.text = key;
            select.appendChild(option);
          });

          // Adiciona o seletor ao DOM
          input.parentNode.insertBefore(select, input.nextSibling);

          // Adiciona um ouvinte de evento para cada seletor
          select.addEventListener('change', function handleSelectionChange(event) {
            const selectedKey = event.target.value;
            inputClasses[selectedInput] = selectedKey;
            localStorage.setItem('inputClasses', JSON.stringify(inputClasses));
          });
        });

        // Botão para aplicar os valores
        const button = document.createElement('button');
        button.textContent = 'Aplicar valores';
        document.body.appendChild(button);
        button.addEventListener('click', () => {
          Object.entries(inputClasses).forEach(([hash, key]) => {
            const input = document.querySelector(`.${hash}`);
            if (input && key) {
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