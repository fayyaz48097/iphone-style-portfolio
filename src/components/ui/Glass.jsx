import { cn } from '@/lib/cn'
import { glass } from './glass'

/** Polymorphic Liquid Glass surface. */
export function Glass({ as: Component = 'div', lens = false, className, ...props }) {
  return <Component className={cn(glass({ lens }), className)} {...props} />
}
