import { useState } from 'react'
import StepOne from './StepOne.jsx'
import StepTwo from './StepTwo.jsx'
import StepThree from './StepThree.jsx'

function App() {
  // This is the "lifted state". All the form data lives here,
  // in the parent, so it does not get lost when we switch steps.
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function goNext() {
    setStep(step + 1)
  }

  function goBack() {
    setStep(step - 1)
  }

  function handleSubmit() {
    // The assignment just asks us to log the final data and
    // show a success message. No backend call needed.
    console.log('Final form data:', formData)
    setSubmitted(true)
  }

  return (
    <div className="container">
      <div className="steps">
        <span className={step === 1 ? 'active' : ''}>1. Personal Info</span>
        <span className={step === 2 ? 'active' : ''}>2. Account</span>
        <span className={step === 3 ? 'active' : ''}>3. Review</span>
      </div>

      {step === 1 && (
        <StepOne formData={formData} setFormData={setFormData} goNext={goNext} />
      )}

      {step === 2 && (
        <StepTwo
          formData={formData}
          setFormData={setFormData}
          goNext={goNext}
          goBack={goBack}
        />
      )}

      {step === 3 && (
        <StepThree
          formData={formData}
          goBack={goBack}
          handleSubmit={handleSubmit}
          submitted={submitted}
        />
      )}
    </div>
  )
}

export default App
