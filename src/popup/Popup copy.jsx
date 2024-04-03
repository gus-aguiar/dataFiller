import "./Popup.css";
import { useState, useEffect } from "react";
import InputDropdown from "./components/InputDropDown";
import { fakeData } from "./helpers/fakeData";

export const Popup = () => {
  const [allInputs, setAllInputs] = useState([]);
  const [hasCapturedInputs, setHasCapturedInputs] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState({});
  const [catchInputs, setCatchInputs] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetNames, setPresetNames] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState("");

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("DTF_")
    );
    console.log(keys, "key");
    setPresetNames(keys);
  }, []);

  const capturaInputs = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    setCatchInputs(true);
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: function getAllInputs() {
          const allInputs = Array.from(document.querySelectorAll("input")).map(
            (input, index) => {
              return {
                type: input.type,
                id: input.id,
                className: input.className,
                innerHTML: input.innerHTML,
                innerText: input.innerText,
                placeholder: input.placeholder,
                label: input.label,
                selectedFakeData: "",
                index: index,
                // Adicione aqui qualquer outra propriedade que você precise
              };
            }
          );
          return allInputs; // Retorna a lista de objetos
        },
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          setHasCapturedInputs(true);
          setAllInputs(results[0].result); // Define o estado com o resultado
        }
      }
    );
  };
  const setInputs = async () => {
    // const [tab] = await chrome.tabs.query({
    //   active: true,
    //   currentWindow: true,
    // });
    const inputClasses = allInputs.map((input, index) => ({
      index,
      class: input.className,
      selectedFakeData: input.selectedFakeData,
    }));
    localStorage.setItem(`DTF_${presetName}`, JSON.stringify(inputClasses));
    setPresetNames([...presetNames, presetName]);

    // allInputs.forEach((input) => {
    //   const inputValue = fakeData()[input.selectedFakeData] || "";

    //   // Armazena os dados do input no localStorage

    //   chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     function: (inputIndex, inputValue) => {
    //       const allPageInputs = Array.from(document.querySelectorAll("input"));
    //       const inputElement = allPageInputs[inputIndex];
    //       if (inputElement && inputValue) {
    //         inputElement.value = inputValue;
    //         let event = new Event("input", { bubbles: true });
    //         inputElement.dispatchEvent(event);
    //       } else {
    //         return console.log(
    //           "Não foi possível preencher o input: " +
    //             inputIndex +
    //             " com o valor: " +
    //             inputValue
    //         );
    //       }
    //     },
    //     args: [input.index, inputValue],
    //   });
    // });
  };

  const setAlreadyInputs = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log("entrou", allInputs);
    // Se não houver inputs, recupera do localStorage
    if (!allInputs) {
      console.log("storedInputs");
      const storedInputs = JSON.parse(
        localStorage.getItem(`DTF_${selectedPreset}`)
      );
      await setAllInputs(storedInputs);
      return;
    }
    allInputs.forEach((input) => {
      const inputValue = fakeData()[input.selectedFakeData] || "xablau";

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (inputIndex, inputValue) => {
          // Captura todos os inputs da página
          const allPageInputs = Array.from(document.querySelectorAll("input"));
          // Encontra o input correspondente na página pelo índice
          const inputElement = allPageInputs[inputIndex];

          if (inputElement && inputValue) {
            inputElement.value = inputValue;
            let event = new Event("input", { bubbles: true });
            inputElement.dispatchEvent(event);
          } else {
            console.log(
              "Não foi possível preencher o input: " +
                inputIndex +
                " com o valor: " +
                inputValue
            );
          }
        },
        args: [input.index, inputValue],
      });
    });
  };
  const handleInputChange = (event, index) => {
    const newAllInputs = [...allInputs];
    newAllInputs[index].selectedFakeData = event.target.value;
    console.log(newAllInputs);
    setAllInputs(newAllInputs);

    // Atualiza selectedKeys e salva no localStorage
    const newSelectedKeys = {
      ...selectedKeys,
      [input.uniqueClass]: event.target.value,
    };
    setSelectedKeys(newSelectedKeys);
    localStorage.setItem("DTF_selectedKeys", JSON.stringify(newAllInputs));
  };

  const handlePresetChange = (event) => {
    setPresetName(event.target.value);
  };

  // const handleButtonClick = () => {
  //   setPresetNames([...presetNames, presetName]);
  // };

  const handleSelectChange = (event) => {
    setSelectedPreset(event.target.value);

    const storedInputs = JSON.parse(localStorage.getItem(event.target.value));
    console.log(storedInputs);

    if (storedInputs) {
      setAllInputs(storedInputs);
      setAlreadyInputs();
    }
  };

  return (
    <main
      style={{ padding: "0.6rem 1.6rem 1rem 1.6rem", borderRadius: "20px" }}
    >
      <h3>Fast Filler</h3>
      <div className="calc">
        {
          // ira ser visualizado quando estiver dados no local
        }
        {presetNames.length > 0 && (
          <button style={{ width: "100%" }} onClick={() => setAlreadyInputs()}>
            Preecher Inputs
          </button>
        )}

        <div>
          {catchInputs && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderBottom: "1px solid #d2d2d2",
                paddingBottom: "1rem",
                marginBottom: "1rem",
              }}
            >
              <label>Nome do Conjunto de Inputs:</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <input
                  type="text"
                  value={presetName}
                  onChange={handlePresetChange}
                  style={{ height: "38px" }}
                />
                <button onClick={() => setInputs()}>Salvar</button>
              </div>
            </div>
          )}
          {console.log(selectedPreset)}
          {/* <button onClick={handleButtonClick}>Salvar Nome</button> */}
          {!catchInputs && presetNames.length > 0 && (
            <select value={selectedPreset || 1} onChange={handleSelectChange}>
              {presetNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {catchInputs &&
        allInputs.map((input, index) => (
          <>
            {console.log("input", input)}
            <InputDropdown
              key={input.className}
              input={input}
              onChange={(event) => handleInputChange(event, index)}
            />
          </>
        ))}
      {
        // ira ser visualizado quando estiver capturando os inputs
      }
      {!catchInputs && (
        <button onClick={() => capturaInputs()} disabled={hasCapturedInputs}>
          Capturar inputs / Capturar novos inputs
        </button>
      )}
    </main>
  );
};

export default Popup;
