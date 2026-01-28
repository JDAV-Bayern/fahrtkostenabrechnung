import { Directive } from '@angular/core';

@Directive({
  selector: '[jdavBadge]',
  host: {
    class:
      'bg-primary text-primary-foreground [a&]:hover:bg-primary/90 inline-flex items-center justify-center rounded-sm border border-transparent px-2 py-1 text-sm font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-2 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  },
})
export class Badge {}
