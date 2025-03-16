// import { NextApiRequest, NextApiResponse } from 'next'
// import { createClient } from '../../../lib/supabase/server'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const supabase = await createClient()

//     const { data: { session }, error: sessionError } = await supabase.auth.getSession()

//     if (sessionError || !session) {
//       return res.status(401).json({ error: 'Not authenticated' })
//     }

//     const { data: user, error: userError } = await supabase
//       .from('users')
//       .select('*')
//       .eq('id', session.user.id)
//       .single()

//     if (userError) {
//       return res.status(500).json({ error: 'Error fetching user data' })
//     }

//     const { data: subscription, error: subscriptionError } = await supabase
//       .from('subscriptions')
//       .select('status')
//       .eq('user_id', session.user.id)
//       .single()

//     if (subscriptionError && subscriptionError.code !== 'PGRST116') {
//       return res.status(500).json({ error: 'Error fetching subscription data' })
//     }

//     res.status(200).json({
//       user,
//       subscriptionStatus: subscription?.status || null
//     })
//   } catch (error) {
//     console.error('Error in user handler:', error)
//     res.status(500).json({ error: 'An error occurred while processing the request' })
//   }
// }

