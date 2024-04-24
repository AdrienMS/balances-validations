import { Injectable } from '@nestjs/common';
import { Balance, Movement, Reason } from '../models';
import { EReason } from '../enums';

@Injectable()
export class MovementService {
  /**
   * Validates movements against balances and returns a list of reasons for any errors.
   *
   * @param {Movement[]} movements - The list of movements to validate.
   * @param {Balance[]} balances - The list of balances to use for validation.
   *
   * @returns {Reason[]} An array of `Reason` indicating any validation errors.
   */
  public validation(movements: Movement[], balances: Balance[]): Reason[] {
    const errors: Reason[] = [];
    balances = this._sortBalances(balances);
    const dateRange = this._dateRange(balances);
    const differences = this._differences(balances);
    errors.push(...this._checkMultiple(movements));
    errors.push(...this._movementsRange(movements, dateRange));
    const rMovements = this._getMovementsInRange(movements, dateRange);
    errors.push(...this._calculBalances(rMovements, differences, dateRange));
    return errors;
  }

  /**
   * Sorts the given list of balances by date.
   *
   * @param {Balance[]} balances - The list of balances to sort.
   *
   * @returns {Balance[]} The sorted list of balances.
   * @private
   */
  private _sortBalances(balances: Balance[]) {
    return balances.sort((b1, b2) => b1.date.getTime() - b2.date.getTime());
  }

  /**
   * Calculates the date range between consecutive balances.
   *
   * This method calculates the date range between consecutive balances
   * in the provided list. It returns an array of tuples, each containing
   * the start and end dates of a date range.
   *
   * @param {Balance[]} balances - The list of balances to calculate the date range from.
   *
   * @returns {Array<[Date, Date]>} An array of tuples representing the start and end dates of each date range.
   *
   * @private
   */
  private _dateRange(balances: Balance[]): Array<[Date, Date]> {
    const dateRange: Array<[Date, Date]> = [];
    for (let i = 0; i < balances.length; i += 1) {
      if (i + 1 < balances.length) {
        dateRange.push([balances[i].date, balances[i + 1].date]);
      }
    }
    return dateRange;
  }

  /**
   * Calculates the differences between consecutive balances.
   *
   * This method calculates the differences between consecutive balances
   * in the provided list. It returns an array of differences, where each
   * element represents the difference between two consecutive balances.
   *
   * @param {Balance[]} balances - The list of balances to calculate the differences from.
   *
   * @returns {Array<number>} An array of numbers representing the differences between consecutive balances.
   *
   * @private
   */
  private _differences(balances: Balance[]): Array<number> {
    const differences: Array<number> = [];
    for (let i = 0; i < balances.length; i += 1) {
      if (i + 1 < balances.length)
        differences.push(balances[i + 1].balance - balances[i].balance);
    }
    return differences;
  }

  /**
   * Checks for multiple occurrences of movements with the same ID.
   *
   * This method checks for multiple occurrences of movements with the same ID
   * in the provided list.
   * It identifies duplicates based on the movement ID, and if these duplicate movements
   * are the exact same object, generates a `MOVEMENT_EXACT` error, else (only the same ID),
   * generates a `MOVEMENT_MULTIPLE`, and adds them to the errors array.
   *
   * @param {Movement[]} movements - The list of movements to check for duplicates.
   *
   * @returns {Reason[]} An array of `Reason` representing the errors found during duplicate checking.
   *
   * @private
   */
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

  /**
   * Checks if movements fall within the specified date range.
   *
   * This method checks if the date of each movement falls within the specified
   * date range. If a movement falls outside the range, it generates an error
   * reason and adds it to the errors array.
   *
   * @param {Movement[]} movements - The list of movements to check against the date range.
   * @param {Array<[Date, Date]>} dateRange - The array containing the start and end dates of the range.
   *
   * @returns {Reason[]} An array of `Reason` representing the movements that fall outside the date range.
   *
   * @private
   */
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

  /**
   * Retrieves movements that fall within each specified date range.
   *
   * This method iterates over each date range provided and filters the movements
   * that have dates falling within that range. It creates an array of arrays of movements
   * falling within a specific date range.
   *
   * @param {Movement[]} movements - The list of `Movement` to filter based on date ranges.
   * @param {Array<[Date, Date]>} dateRange - The array containing the start and end dates of each range.
   *
   * @returns {Array<Movement[]>} An array of arrays containing movements grouped by date range.
   *
   * @private
   */
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

  /**
   * Calculates balances and compares them with expected differences for each date range.
   *
   * This method calculates the total amount of movements within each date range and compares
   * it with the expected difference calculated from the balances. If the calculated total
   * amount does not match the expected difference, an error reason is generated indicating
   * whether there is an excess or missing amount.
   *
   * @param {Array<Movement[]>} rMovements - An array of arrays containing movements grouped by date range.
   * @param {number[]} differences - An array containing the expected differences in balances for each date range.
   * @param {Array<[Date, Date]>} dateRange - The array containing the start and end dates of each date range.
   *
   * @returns {Reason[]} An array of `Reason` for each date range where the calculated balance
   * does not match the expected difference.
   *
   * @private
   */
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

  /**
   * Formats the given date into a string representation.
   *
   * @param {Date} date - The date to format.
   *
   * @returns {string} The formatted date string.
   * @private
   */
  private _formatDate(date: Date): string {
    return date.toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
