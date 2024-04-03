const GetInputs = ({ capturaInputs, hasCapturedInputs }) => {
  return (
    <button
      style={{ width: "100%" }}
      onClick={() => capturaInputs()}
      disabled={hasCapturedInputs}
    >
      Capturar inputs
    </button>
  );
};

export default GetInputs;
