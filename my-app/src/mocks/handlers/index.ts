import { managerHandlers } from './manager.handlers';
import { hotelsHandlers } from './hotels.handlers';
import { kitchenHandlers } from './kitchen.handlers';

export const handlers = [
  ...managerHandlers,
  ...hotelsHandlers,
  ...kitchenHandlers,
];
