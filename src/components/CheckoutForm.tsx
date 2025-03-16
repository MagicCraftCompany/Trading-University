import type React from "react"
import { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { PaymentButtonStyles } from "@/styles/HeroStyles/HeroSearch"
import { ErrorStyles } from "@/styles/ContactpageStyles/Contact"

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    })

    if (error) {
      setError(error.message || "An error occurred")
    } else {
      // Send paymentMethod.id to your server
      console.log("PaymentMethod:", paymentMethod)
      setError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <PaymentButtonStyles type="submit" disabled={!stripe}>
        Pay
      </PaymentButtonStyles>
      {error && <ErrorStyles>{error}</ErrorStyles>}
    </form>
  )
}

export default CheckoutForm

