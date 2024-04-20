import { EReason } from '../enums';
import { Movement } from './movement.type';

export type Reason = {
  reason: EReason;
  detail?: string;
  duplicate?: Movement[];
  outRange?: Movement;
};
