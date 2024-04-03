const ChangeInputs = ({
  presetNames,
  setAlreadyInputs,
  selectedPreset,
  handleSelectChange,
  capturaInputs,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button style={{ width: "100%" }} onClick={() => setAlreadyInputs()}>
        Preecher Inputs
      </button>
      {console.log(selectedPreset)}
      <select value={selectedPreset} onChange={handleSelectChange}>
        <option value="">Selecione uma opção</option>
        {presetNames.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
      </select>

      <button onClick={() => capturaInputs()}>Capturar novos inputs</button>
    </div>
  );
};

export default ChangeInputs;
