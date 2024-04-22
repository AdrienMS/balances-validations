import { EReason } from '../enums';
import { Reason } from '../models';

export const calculError: Reason[] = [
  {
    detail: 'Got 70 instead of 100 for checkpoint dated May 1, 2024',
    reason: EReason.MOVEMENT_MISSING,
  },
  {
    detail: 'Got 120 instead of 100 for checkpoint dated June 1, 2024',
    reason: EReason.MOVEMENT_EXCESS,
  },
];

export const badRequestError = {
  message: "I'm a teapot",
  reasons: [
    {
      reason: 'Incorrect parameter',
      detail: 'movements must be an array',
    },
    {
      reason: 'Incorrect parameter',
      detail: 'balances must contain at least 2 elements',
    },
    {
      reason: 'Incorrect parameter',
      detail: 'balances must be an array',
    },
  ],
};

export const badRequestMessages = [
  'movements must be an array',
  'balances must contain at least 2 elements',
  'balances must be an array',
];

export const unknowError = {
  message: "I'm a teapot",
  reasons: [{ reason: 'Unknow error' }],
};
