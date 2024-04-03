import InputDropdown from "../InputDropDown";
import "../../Popup.css";
const SetInputs = ({
  presetName,
  handlePresetChange,
  allInputs,
  handleInputChange,
  setInputs,
}) => {
  return (
    <div>
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <input
            type="text"
            value={presetName}
            onChange={handlePresetChange}
            style={{ height: "38px" }}
          />
          <button onClick={() => setInputs()}>Salvar</button>
        </div>
      </div>

      {allInputs.map((input, index) => (
        <>
          <InputDropdown
            key={input.className}
            input={input}
            onChange={(event) => handleInputChange(event, index)}
          />
        </>
      ))}
    </div>
  );
};

export default SetInputs;
