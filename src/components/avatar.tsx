import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/util";

interface AvatarProps {
  image: string;
  classes?: string
}

export function UserAvatar({ image, classes }: AvatarProps) {
  return (
    <Avatar className={cn("relative flex shrink-0 overflow-hidden", classes)}>
      <AvatarImage src={image} alt="user image" className="object-cover" />
      <AvatarFallback>YY</AvatarFallback>
    </Avatar>
  )
}