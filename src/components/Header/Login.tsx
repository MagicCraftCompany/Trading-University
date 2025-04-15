

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

