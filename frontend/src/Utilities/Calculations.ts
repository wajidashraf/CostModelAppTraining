import type { MeasuredWork } from '../types/models';

export function calculateCost(quantity: number, unitPrice: number): number {
    const q = Number(quantity) || 0;
    const p = Number(unitPrice) || 0;
    const total = q * p;
    // Round to 2 decimal places to avoid floating point precision issues
    return Math.round((total + Number.EPSILON) * 100) / 100;
}

export function sumMeasuredWorks(works : MeasuredWork[]): number {

    return works.reduce((acc, work) => acc + work.totalCost, 0);

}


