// 'use client'

// import { useState, useTransition } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import {
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog"
// import { signIn } from '../../../lib/actions/auth'

import { useRouter } from 'next/router'

interface LoginFormProps {
  onClose: () => void
}

export function LoginForm({ onClose }: LoginFormProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Add your login form content here */}
      <button 
        onClick={onClose}
        className="mt-4 w-full bg-primary text-white p-2 rounded hover:bg-primary/90"
      >
        Cancel
      </button>
    </div>
  )
}

// export function LoginForm({ onClose }: LoginFormProps) {
//   const [error, setError] = useState<string | null>(null)
//   const [isPending, startTransition] = useTransition()

//   async function handleSubmit(formData: FormData) {
//     startTransition(async () => {
//       try {
//         const result = await signIn(formData)
//         if (result?.error) {
//           setError(result.error)
//         } else {
//           onClose()
//         }
//       } catch (e) {
//         setError('An error occurred during sign in')
//       }
//     })
//   }

//   return (
//     <DialogContent className="sm:max-w-[425px]">
//       <DialogHeader>
//         <DialogTitle className="text-2xl font-bold">Login</DialogTitle>
//         <DialogDescription className="text-gray-500">
//           Enter your email below to login to your account
//         </DialogDescription>
//       </DialogHeader>
//       <form action={handleSubmit} className="space-y-4 mt-4">
//         <div className="space-y-2">
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="m@example.com"
//             required
//             className="w-full"
//           />
//         </div>
//         <div className="space-y-2">
//           <Input
//             id="password"
//             name="password"
//             type="password"
//             placeholder="Enter your password"
//             required
//             className="w-full"
//           />
//         </div>
//         {error && (
//           <Alert variant="destructive">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
//         <div className="flex flex-col gap-2">
//           <Button 
//             type="submit" 
//             className="w-full" 
//             disabled={isPending}
//           >
//             {isPending ? 'Signing in...' : 'Sign in'}
//           </Button>
//           <div className="text-center text-sm text-gray-500">
//             Don&apos;t have an account?{' '}
//             <Button 
//               variant="link" 
//               className="p-0 h-auto font-semibold text-primary"
//               onClick={() => {
//                 // Handle signup navigation
//               }}
//             >
//               Sign up
//             </Button>
//           </div>
//         </div>
//       </form>
//     </DialogContent>
//   )
// }

