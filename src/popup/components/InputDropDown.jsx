function InputDropdown({ input, onChange, fakeData }) {
    const label = input.label || input.placeholder || input.innerText || input.id || input.className;

    return (
        <div key={input.className}>
            <p>{label}</p>
            <select
                value={input.selectedFakeData}
                onChange={onChange}
            >
                {Object.keys(fakeData).map(key => (
                    <option key={key} value={key}>{key}</option>
                ))}
            </select>
        </div>
    );
}

export default InputDropdown;