
import './Popup.css'
import { fakerPT_BR as faker } from '@faker-js/faker';
import { generateCNPJ, generateCPF } from '@brazilian-utils/brazilian-utils'
import { useState } from 'react';
import InputDropdown from './components/InputDropDown';



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
export const Popup = () => {

  const [allInputs, setAllInputs] = useState([])
  const capturaInputs = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function getAllInputs() {
        const allInputs = Array.from(document.querySelectorAll('input')).map(input => {
          const hash = 'a' + Math.random().toString(36).substring(2, 15); // Adiciona 'a' antes do hash
          input.classList.add(hash);
          return {
            value: input.value,
            type: input.type,
            id: input.id,
            className: input.className,
            uniqueClass: hash, // Armazena o hash como uma propriedade separada
            innerHTML: input.innerHTML,
            innerText: input.innerText,
            placeholder: input.placeholder,
            label: input.label,
            selectedFakeData: '',
            // Adicione aqui qualquer outra propriedade que você precise
          };
        });
        return allInputs; // Retorna a lista de objetos
      },
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setAllInputs(results[0].result); // Define o estado com o resultado
        console.log(results[0].result);
      }
    });
  }

  const setInputs = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    allInputs.forEach(input => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (uniqueClass, inputValue) => {
          const inputElement = document.querySelector(`input.${uniqueClass}`);
          if (inputElement) {
            inputElement.value = inputValue;
          }
        },
        args: [input.uniqueClass, fakeData[input.selectedFakeData]] // Usa a classe única
      });
    });
  }



  return (
    <main>
      <h3>Fast Filler</h3>
      <div className="calc">
        <button onClick={() => capturaInputs()}>
          Capture os inputs
        </button>

        <button onClick={() => setInputs()}>
          Preencher inputs
        </button>
      </div>
      {allInputs.map((input, index) => (
        <InputDropdown
          key={input.className}
          input={input}
          fakeData={fakeData} // Passa fakeData como uma prop
          onChange={(event) => {
            const newAllInputs = [...allInputs];
            newAllInputs[index].selectedFakeData = event.target.value;
            setAllInputs(newAllInputs);
          }}
        />
      ))}
    </main>
  );
}

export default Popup
