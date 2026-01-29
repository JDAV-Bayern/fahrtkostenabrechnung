import { Directive } from '@angular/core';

@Directive({
  selector: '[jdavCard]',
  host: {
    class:
      'bg-card text-card-foreground flex flex-col gap-6 rounded-lg border border-gray-200 py-6 shadow-sm',
  },
})
export class Card {}

@Directive({
  selector: '[jdavCardHeader]',
  host: {
    class:
      'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 grid-cols-[1fr_auto] [.border-b]:pb-6',
  },
})
export class CardHeader {}

@Directive({
  selector: '[jdavCardTitle]',
  host: {
    class: 'leading-none font-semibold',
  },
})
export class CardTitle {}

@Directive({
  selector: '[jdavCardDescription]',
  host: {
    class: 'text-gray-500 text-sm',
  },
})
export class CardDescription {}

@Directive({
  selector: '[jdavCardAction]',
  host: {
    class: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
  },
})
export class CardAction {}

@Directive({
  selector: '[jdavCardContent]',
  host: {
    class: 'px-6',
  },
})
export class CardContent {}

@Directive({
  selector: '[jdavCardFooter]',
  host: {
    class: 'flex items-center px-6 [.border-t]:pt-6',
  },
})
export class CardFooter {}
