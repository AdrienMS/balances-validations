import { Injectable } from '@nestjs/common';
import { Balance, Movement, Reason } from '../models';
import { EReason } from '../enums';

@Injectable()
export class MovementService {
  public validation(movements: Movement[], balances: Balance[]): Reason[] {
    const errors: Reason[] = [];
    balances = this._sortBalances(balances);
    const dateRange = this._dateRange(balances);
    const differences = this._differences(balances);
    errors.push(...this._checkMultiple(movements));
    if (errors.length) return errors;
    errors.push(...this._movementsRange(movements, dateRange));
    const rMovements = this._getMovementsInRange(movements, dateRange);
    errors.push(...this._calculBalances(rMovements, differences, dateRange));
    return errors;
  }

  private _sortBalances(balances: Balance[]) {
    return balances.sort((b1, b2) => b1.date.getTime() - b2.date.getTime());
  }

  private _dateRange(balances: Balance[]): Array<[Date, Date]> {
    const dateRange: Array<[Date, Date]> = [];
    for (let i = 0; i < balances.length; i += 1) {
      if (i + 1 < balances.length) {
        dateRange.push([balances[i].date, balances[i + 1].date]);
      }
    }
    return dateRange;
  }

  private _differences(balances: Balance[]): Array<number> {
    const differences: Array<number> = [];
    for (let i = 0; i < balances.length; i += 1) {
      if (i + 1 < balances.length)
        differences.push(balances[i + 1].balance - balances[i].balance);
    }
    return differences;
  }

  private _checkMultiple(movements: Movement[]): Reason[] {
    const errors: Reason[] = [];
    movements.filter((movement, i) => {
      const f = movements.findIndex((m) => m.id === movement.id);
      if (f !== i) {
        const reason =
          JSON.stringify(movement) === JSON.stringify(movements[f])
            ? EReason.MOVEMENT_EXACT
            : EReason.MOVEMENT_MULTIPLE;
        errors.push({ reason, duplicate: [movement, movements[f]] });
      }
      return f === i;
    });
    return errors;
  }

  private _movementsRange(
    movements: Movement[],
    dateRange: Array<[Date, Date]>,
  ): Reason[] {
    const errors: Reason[] = [];
    const minDate = dateRange[0][0].getTime();
    const maxDate = dateRange[dateRange.length - 1][1].getTime();
    movements.forEach((movement) => {
      const mDate = movement.date.getTime();
      if (mDate < minDate || mDate > maxDate) {
        errors.push({ reason: EReason.MOVEMENT_RANGE, outRange: movement });
      }
    });
    return errors;
  }

  private _getMovementsInRange(
    movements: Movement[],
    dateRange: Array<[Date, Date]>,
  ): Array<Movement[]> {
    const rMovements: Array<Movement[]> = [];
    dateRange.forEach((dates) => {
      const rMovement: Movement[] = [];
      movements.forEach((movement) => {
        const min = dates[0].getTime();
        const max = dates[1].getTime();
        const mDate = movement.date.getTime();
        if (min < mDate && mDate < max) rMovement.push(movement);
      });
      rMovements.push(rMovement);
    });
    return rMovements;
  }

  private _calculBalances(
    rMovements: Array<Movement[]>,
    differences: number[],
    dateRange: Array<[Date, Date]>,
  ): Reason[] {
    const errors: Reason[] = [];
    rMovements.forEach((movements, i) => {
      let calcul = 0;
      movements.forEach((m) => (calcul += m.amount));
      if (calcul !== differences[i]) {
        const reason =
          calcul > differences[i]
            ? EReason.MOVEMENT_EXCESS
            : EReason.MOVEMENT_MISSING;
        errors.push({
          reason,
          detail: `Got ${calcul} instead of ${differences[i]} for checkpoint dated ${this._formatDate(dateRange[i][1])}`,
        });
      }
    });
    return errors;
  }

  private _formatDate(date: Date): string {
    return date.toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
