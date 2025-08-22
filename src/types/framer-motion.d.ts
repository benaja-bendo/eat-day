import type { ComponentType } from 'react';

declare module 'framer-motion' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const motion: Record<string, ComponentType<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const AnimatePresence: ComponentType<any>;
}
