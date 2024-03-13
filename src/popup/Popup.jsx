
import './Popup.css'
import { useState, useEffect } from 'react';
import InputDropdown from './components/InputDropDown';
import { fakeData } from './helpers/fakeData';

export const Popup = () => {

  const [allInputs, setAllInputs] = useState([])
  const [hasCapturedInputs, setHasCapturedInputs] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState({});
  const [catchInputs, setCatchInputs] = useState(false);

  // useEffect(() => {
  //   // Quando a aplicação carrega, verifica se as chaves selecionadas estão no localStorage
  //   const storedKeys = localStorage.getItem('selectedKeys');
  //   if (storedKeys) {
  //     setSelectedKeys(JSON.parse(storedKeys)); // Se existir, seta selectedKeys com essas chaves
  //   }
  // }, []);




  const capturaInputs = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    setCatchInputs(true)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function getAllInputs() {
        const allInputs = Array.from(document.querySelectorAll('input')).map((input, index) => {
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
            index,
            // Adicione aqui qualquer outra propriedade que você precise
          };
        });
        return allInputs; // Retorna a lista de objetos

      },
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setHasCapturedInputs(true);
        setAllInputs(results[0].result); // Define o estado com o resultado
        localStorage.setItem('inputClasses', JSON.stringify(results[0].result)); // Salva os resultados no localStorage
      }
    });
  }

  const setInputs = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    allInputs.forEach(input => {
      const inputValue = fakeData()[input.selectedFakeData] || '';

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (inputIndex, inputValue) => {
          const allPageInputs = Array.from(document.querySelectorAll('input'));
          const inputElement = allPageInputs[inputIndex];
          if (inputElement && inputValue) {
            inputElement.value = inputValue;
            let event = new Event("input", { bubbles: true });
            inputElement.dispatchEvent(event);
          }
          else { return console.log('Não foi possível preencher o input: ' + inputIndex + ' com o valor: ' + inputValue) }
        },
        args: [input.index, inputValue]
      });
    });
  }

  const setAlreadyInputs = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Se não houver inputs, recupera do localStorage
    if (allInputs.length === 0) {
      setAllInputs(JSON.parse(localStorage.getItem('inputClasses')));
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (allInputs, fakeData) => {
        // Captura todos os inputs da página
        const allPageInputs = Array.from(document.querySelectorAll('input'));
        allInputs.forEach(input => {
          const inputValue = fakeData[input.selectedFakeData] || 'xablau';
          console.log('selectedFakeData:', input.selectedFakeData);
          console.log('fakeData:', fakeData());

          // Encontra o input correspondente na página pelo índice
          const inputElement = allPageInputs[input.index];
          console.log(inputElement);

          if (inputElement && inputValue) {
            inputElement.value = inputValue;
            let event = new Event("input", { bubbles: true });
            inputElement.dispatchEvent(event);
          }
          else {
            console.log('Não foi possível preencher o input: ' + input.index + ' com o valor: ' + inputValue);
          }
        });

      },
      args: [allInputs, fakeData()]
    });
  }
  const handleInputChange = (event, index) => {
    const newAllInputs = [...allInputs];
    newAllInputs[index].selectedFakeData = event.target.value;
    setAllInputs(newAllInputs);

    // Atualiza selectedKeys e salva no localStorage
    const newSelectedKeys = { ...selectedKeys, [input.uniqueClass]: event.target.value };
    setSelectedKeys(newSelectedKeys);
    localStorage.setItem('selectedKeys', JSON.stringify(newAllInputs));
  };

  return (
    <main>
      <h3>Fast Filler</h3>
      <div className="calc">
        <button
          onClick={() => capturaInputs()}
          disabled={hasCapturedInputs}
        >
          Capture os inputs
        </button>

        <button onClick={() => setInputs()}>
          Preencher inputs novos
        </button>

        <button onClick={() => setAlreadyInputs()}>
          Preencher inputs já capturados
        </button>
      </div>
      {catchInputs && allInputs.map((input, index) => (
        <InputDropdown
          key={input.className}
          input={input}
          onChange={(event) => handleInputChange(event, index)}
        />
      ))
      }
    </main>
  );
}

export default Popup
