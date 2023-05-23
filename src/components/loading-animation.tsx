import { Loader2 } from "lucide-react"
const Loading = () => {
  return (
    <div className="w-full flex justify-center text-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}

export default Loading