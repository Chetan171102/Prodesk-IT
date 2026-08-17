function StepThree({ formData, goBack, handleSubmit, submitted }) {
  function handleClick(e) {
    e.preventDefault()
    handleSubmit()
  }

  // After the user submits, just show a simple success message.
  if (submitted) {
    return (
      <div className="success-box">
        <h2>You're all set!</h2>
        <p>Your account for {formData.firstName} has been created.</p>
        <p>(Check the browser console to see the data that was submitted.)</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Review &amp; Submit</h2>

      <div className="summary-row">
        <span>First Name</span>
        <span>{formData.firstName}</span>
      </div>
      <div className="summary-row">
        <span>Last Name</span>
        <span>{formData.lastName}</span>
      </div>
      <div className="summary-row">
        <span>Date of Birth</span>
        <span>{formData.dob}</span>
      </div>
      <div className="summary-row">
        <span>Email</span>
        <span>{formData.email}</span>
      </div>
      <div className="summary-row">
        <span>Password</span>
        <span>{'*'.repeat(formData.password.length)}</span>
      </div>

      <div className="buttons">
        <button type="button" className="back-button" onClick={goBack}>
          Back
        </button>
        <button type="button" className="submit-button" onClick={handleClick}>
          Submit
        </button>
      </div>
    </div>
  )
}

export default StepThree
