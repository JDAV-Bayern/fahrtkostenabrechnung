import { computed, Directive, input } from '@angular/core';

export type ButtonVariant = 'default' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 focus-visible:outline-3 focus-visible:outline-primary/50';
const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline:
    'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
  ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
};
const sizes = {
  default: 'h-9 px-4 py-2',
  icon: 'size-9',
};

@Directive({
  selector: '[jdavButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('default');
  readonly size = input<ButtonSize>('default');
  readonly classes = computed(
    () => `${base} ${variants[this.variant()]} ${sizes[this.size()]}`,
  );
}
