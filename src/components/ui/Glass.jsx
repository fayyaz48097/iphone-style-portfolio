import { cn } from '@/lib/cn'
import { glass } from './glass'

/** Polymorphic Liquid Glass surface. */
export function Glass({ as: Component = 'div', float = false, lens = false, className, ...props }) {
  return <Component className={cn(glass({ float, lens }), className)} {...props} />
}
