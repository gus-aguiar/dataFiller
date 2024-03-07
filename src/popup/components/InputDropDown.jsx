import { fakeData } from '../helpers/fakeData';

function InputDropdown({ input, onChange }) {
  const label = input.label || input.placeholder || input.innerText || input.id || input.className;


  const colorInputs = async (selectedClass) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (selectedClass) => {
        const inputElement = document.querySelector(`input.${selectedClass}`);
        if (inputElement) {
          inputElement.style.border = '2px solid blue'; // Adiciona uma borda azul ao input
        }
      },
      args: [selectedClass] // Usa a classe única
    });
  }

  const removeBorder = async (selectedClass) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (selectedClass) => {
        const inputElement = document.querySelector(`input.${selectedClass}`);
        if (inputElement) {
          inputElement.style.border = ''; // Remove a borda do input
        }
      },
      args: [selectedClass] // Usa a classe única
    });
  }

  return (
    <div key={input.className}>
      <p>{label}</p>
      <select
        value={input.selectedFakeData || 'alou'}
        onChange={onChange}
      >
        {Object.keys(fakeData()).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      <button
        onClick={() => colorInputs(input.className)}
        onMouseLeave={() => removeBorder(input.className)}
      >
        Selecionar
      </button>
    </div>
  );
}

export default InputDropdown;