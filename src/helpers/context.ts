import { DataContext } from '../models/data-request';

export const cleanContext = (context?: DataContext): DataContext => {
  if (!context) context = 'GENERIC' as DataContext;
  return context.toUpperCase().replace(/_/g, '') as DataContext;
}