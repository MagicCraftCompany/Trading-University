import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { paymentMethodId, priceId } = req.body

      // Create a customer
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: req.body.email,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })

      // Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        expand: ["latest_invoice.payment_intent"],
      })

      res.status(200).json(subscription)
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } })
    }
  } else {
    res.setHeader("Allow", "POST")
    res.status(405).end("Method Not Allowed")
  }
}

