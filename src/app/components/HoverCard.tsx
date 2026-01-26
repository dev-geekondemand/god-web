
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardComponent(
    { linkText,
     avatarImg,
     title, 
     line1, 
     line2, 
     mutedLine }: { linkText: string, avatarImg: string, title: string, line1: string, line2: string, mutedLine: string }
) {

    

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button className="mx-0 px-0 text-teal-500 hover:text-teal-600 cursor-pointer" variant="link">{linkText} (View details)</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-2">
          <Avatar>
            <AvatarImage 
            key={avatarImg}
            src={avatarImg}
            alt="User Avatar"
            width={40}
            height={40}
            />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm">
              {line1}
            </p>
            <p className="text-sm">
              {line2}
            </p>
            <div className="text-muted-foreground text-xs">
              {mutedLine}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
