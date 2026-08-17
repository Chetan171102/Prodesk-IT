import { useState } from 'react'

// A simple eye icon. When the password is hidden, we show an open eye.
// When the password is visible, we show an eye with a line through it.
function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

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
      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={passwordError && touched.password ? 'error-input' : ''}
        />
        <button
          type="button"
          className="eye-button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
      {passwordError && touched.password && <p className="error-text">{passwordError}</p>}

      <label>Confirm Password</label>
      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={confirmPasswordError && touched.confirmPassword ? 'error-input' : ''}
        />
        <button
          type="button"
          className="eye-button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
      {confirmPasswordError && touched.confirmPassword && (
        <p className="error-text">{confirmPasswordError}</p>
      )}

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
