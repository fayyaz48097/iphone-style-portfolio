import { linearGradient } from '@/lib/gradient'
import { GRADIENTS } from './brand'

export const buildFlowSection = {
  title: 'How I build an endpoint',
  subtitle: 'Every request takes the same clean path through my Laravel code. Watch one travel through it.',
}

export const buildFlowSteps = [
  { id: 'route', title: 'Route', description: 'A versioned REST endpoint receives the request', background: linearGradient(150, '#5AC8FA', '#0A84FF') },
  { id: 'request', title: 'Form Request', description: 'Input is validated and authorized first', background: GRADIENTS.orange },
  { id: 'action', title: 'Action', description: 'One class, one business task, easy to test', background: GRADIENTS.violet },
  { id: 'service', title: 'Service', description: 'Business rules, like rate and bill calculation', background: GRADIENTS.pink },
  { id: 'repository', title: 'Repository', description: 'Tuned Eloquent queries, no N+1 surprises', background: linearGradient(150, '#3DDC84', '#0A7D32') },
  {
    id: 'resource',
    title: 'API Resource',
    description: 'A consistent JSON contract goes back',
    background: linearGradient(150, '#FFD60A', '#F2A900'),
    color: '#1b1b1b',
  },
]
