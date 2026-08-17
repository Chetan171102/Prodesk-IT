import { useState } from 'react'

function StepTwo({ formData, setFormData, goNext, goBack }) {
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  // A simple regex pattern to check the email looks like an email.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  let emailError = ''
  if (formData.email.trim() === '') {
    emailError = 'Email is required'
  } else if (!emailPattern.test(formData.email)) {
    emailError = 'Enter a valid email address'
  }

  let passwordError = ''
  if (formData.password === '') {
    passwordError = 'Password is required'
  } else if (formData.password.length < 8) {
    passwordError = 'Password must be at least 8 characters'
  }

  let confirmPasswordError = ''
  if (formData.confirmPassword === '') {
    confirmPasswordError = 'Please confirm your password'
  } else if (formData.confirmPassword !== formData.password) {
    confirmPasswordError = 'Passwords do not match'
  }

  const canGoNext = !emailError && !passwordError && !confirmPasswordError

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true })
  }

  function handleNextClick(e) {
    e.preventDefault()
    setTouched({ email: true, password: true, confirmPassword: true })
    if (canGoNext) {
      goNext()
    }
  }

  return (
    <form onSubmit={handleNextClick}>
      <h2>Account Details</h2>

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={emailError && touched.email ? 'error-input' : ''}
      />
      {emailError && touched.email && <p className="error-text">{emailError}</p>}

      <label>Password</label>
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        className={passwordError && touched.password ? 'error-input' : ''}
      />
      {passwordError && touched.password && <p className="error-text">{passwordError}</p>}

      <label>Confirm Password</label>
      <input
        type={showPassword ? 'text' : 'password'}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        className={confirmPasswordError && touched.confirmPassword ? 'error-input' : ''}
      />
      {confirmPasswordError && touched.confirmPassword && (
        <p className="error-text">{confirmPasswordError}</p>
      )}

      <button
        type="button"
        className="show-password-button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? 'Hide Password' : 'Show Password'}
      </button>

      <div className="buttons">
        <button type="button" className="back-button" onClick={goBack}>
          Back
        </button>
        <button type="submit" className="next-button" disabled={!canGoNext}>
          Next
        </button>
      </div>
    </form>
  )
}

export default StepTwo
