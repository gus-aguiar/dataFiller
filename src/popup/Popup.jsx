
import './Popup.css'
import { useState, useEffect } from 'react';
import InputDropdown from './components/InputDropDown';
import { fakeData } from './helpers/fakeData';

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
      }
    });
  }

  const setInputs = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    allInputs.forEach(input => {
      const inputValue = fakeData()[input.selectedFakeData] || 'default value';

      console.log(input.uniqueClass, fakeData()[input.selectedFakeData]);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (uniqueClass, inputValue) => {
          const inputElement = document.querySelector(`input.${uniqueClass}`);
          if (inputElement) {
            inputElement.value = inputValue ? inputValue : 'alou';
            let event = new Event("input", { bubbles: true });
            inputElement.dispatchEvent(event);
          }
        },
        args: [input.uniqueClass, inputValue] // Usa a classe única
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
