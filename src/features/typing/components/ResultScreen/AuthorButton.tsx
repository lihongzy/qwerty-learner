import laity from '@/assets/laity.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const AuthorButton = () => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <Avatar className="h-8 w-8 shadow-lg" onClick={() => window.open('https://github.com/lihongzy', '_blank')}>
            <AvatarImage src={laity} alt="Laity Homepage" />
            <AvatarFallback>Laity</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent className="cursor-pointer" onClick={() => window.open('https://github.com/lihongzy', '_blank')}>
          <p>Open the author's profile and more projects.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
