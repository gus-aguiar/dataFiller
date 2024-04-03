import ChangeInputs from "./ChangeInputs";
import GetInputs from "./GetInputs";
import SetInputs from "./SetInputs";

const Flow = ({ progress, ...props }) => {
  const PROGRESS_COMPONENTS = {
    GetInputs: <GetInputs {...props} />,
    SetInputs: <SetInputs {...props} />,
    ChangeInputs: <ChangeInputs {...props} />,
  };

  return PROGRESS_COMPONENTS[progress] || PROGRESS_COMPONENTS.GetInputs;
};

export default Flow;
