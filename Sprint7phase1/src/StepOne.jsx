import { useState } from 'react'

function StepOne({ formData, setFormData, goNext }) {
  // "touched" keeps track of which fields the user has clicked into.
  // We only show an error for a field once the user has touched it,
  // so the page doesn't show red errors before you've typed anything.
  const [touched, setTouched] = useState({})

  const firstNameError = formData.firstName.trim() === '' ? 'First name is required' : ''
  const lastNameError = formData.lastName.trim() === '' ? 'Last name is required' : ''
  const dobError = formData.dob === '' ? 'Date of birth is required' : ''

  const canGoNext = !firstNameError && !lastNameError && !dobError

  function handleChange(e) {
    // e.target.name matches the input's "name" attribute below,
    // so this one function can update any field in this step.
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true })
  }

  function handleNextClick(e) {
    e.preventDefault() // stop the page from refreshing
    // If they hit Next without touching every field, mark them all
    // touched so any missing ones show their error right away.
    setTouched({ firstName: true, lastName: true, dob: true })
    if (canGoNext) {
      goNext()
    }
  }

  return (
    <form onSubmit={handleNextClick}>
      <h2>Personal Info</h2>

      <label>First Name</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
        className={firstNameError && touched.firstName ? 'error-input' : ''}
      />
      {firstNameError && touched.firstName && <p className="error-text">{firstNameError}</p>}

      <label>Last Name</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        className={lastNameError && touched.lastName ? 'error-input' : ''}
      />
      {lastNameError && touched.lastName && <p className="error-text">{lastNameError}</p>}

      <label>Date of Birth</label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        onBlur={handleBlur}
        className={dobError && touched.dob ? 'error-input' : ''}
      />
      {dobError && touched.dob && <p className="error-text">{dobError}</p>}

      <div className="buttons">
        <button type="submit" className="next-button" disabled={!canGoNext}>
          Next
        </button>
      </div>
    </form>
  )
}

export default StepOne
