import { fakeData } from "../helpers/fakeData";

function InputDropdown({ input, onChange }) {
  const label =
    input.label ||
    input.placeholder ||
    input.innerText ||
    input.id ||
    input.className;

  const colorInputs = async (selectedClass) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (selectedClass) => {
        console.log(selectedClass);
        const inputElement = document.querySelector(
          `input[class*="${selectedClass}"]`
        );
        if (inputElement) {
          inputElement.style.border = "2px solid blue"; // Adiciona uma borda azul ao input
        }
      },
      args: [selectedClass], // Usa a classe única
    });
  };

  const removeBorder = async (selectedClass) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (selectedClass) => {
        const inputElement = document.querySelector(
          `input[class*="${selectedClass}"]`
        );
        if (inputElement) {
          inputElement.style.border = ""; // Remove a borda do input
        }
      },
      args: [selectedClass], // Usa a classe única
    });
  };

  return (
    <div key={input.className}>
      <span>{label || "Sem label"}</span>
      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
        <select
          value={input.selectedFakeData || ""}
          onChange={onChange}
          style={{ padding: "10px 10px" }}
        >
          {Object.keys(fakeData()).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <button
          onClick={() => colorInputs(input.className)}
          onMouseLeave={() => removeBorder(input.className)}
        >
          Selecionar
        </button>
      </div>
    </div>
  );
}

export default InputDropdown;
