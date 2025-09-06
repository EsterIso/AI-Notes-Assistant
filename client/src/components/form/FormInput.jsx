
function FormInput({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    required = false

}) {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={name} className="form-label">
                {label}
                </label>
            )}
            <input 
            type={type} 
            id={name}  
            name={name} 
            className={`form-input ${error ? 'input-error' : ''}`}
            value={value}
            onChange={onChange}
            required={required}
            />
            {error && <small className="error-message">{error}</small>}
        </div>
    );
}

export default FormInput;