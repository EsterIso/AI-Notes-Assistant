import "../../styles/LoginPage.css"

function PasswordRequirements({ formData }) {

    const passwordRequirements = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /\d/.test(formData.password),
        special: /[!@#$%^&*]/.test(formData.password)
    };
 
  return (

    <div className="requirements-container">
        <span className={`requirement-badge ${passwordRequirements.length ? 'requirement-met' : 'badge-unmet'}`}>
            8+ Chars
        </span>
        <span className={`requirement-badge ${passwordRequirements.uppercase ? 'requirement-met' : 'badge-unmet'}`}>
            Uppercase
        </span>
        <span className={`requirement-badge ${passwordRequirements.lowercase ? 'requirement-met' : 'badge-unmet'}`}>
            Lowercase
        </span>
        <span className={`requirement-badge ${passwordRequirements.number ? 'requirement-met' : 'badge-unmet'}`}>
            Number
        </span>
        <span className={`requirement-badge ${passwordRequirements.special ? 'requirement-met' : 'badge-unmet'}`}>
            Special Char
        </span>
    </div>
  )
}

export default PasswordRequirements;