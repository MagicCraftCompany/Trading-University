// import { useState } from "react";
// import { signUp } from "../../../lib/supabase/server";


// export function SignupForm() {
//   const [error, setError] = useState<string | null>(null);

//   async function handleSignup(formData: FormData) {
//     const result = await signUp(formData);

//     if (result?.error) {
//       setError(result.error);
//     } else {
//       alert("Check your email to verify your account.");
//       window.location.href = "/login"; // Redirect to login after signup
//     }
//   }

//   return (
//     <form action={handleSignup}>
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         required
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         required
//       />
//       {error && <p>{error}</p>}
//       <button type="submit">Sign up</button>
//     </form>
//   );
// }
