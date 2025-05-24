
/**
 * GST calculation utilities
 */

export interface GSTBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

/**
 * Calculates GST breakdown (18% total)
 */
export const calculateGST = (amount: number, isInterstate: boolean = false): GSTBreakdown => {
  const gstRate = 0.18;
  const totalGst = amount * gstRate;

  if (isInterstate) {
    return {
      igst: totalGst,
      cgst: 0,
      sgst: 0,
      total: totalGst
    };
  } else {
    return {
      cgst: totalGst / 2,
      sgst: totalGst / 2,
      igst: 0,
      total: totalGst
    };
  }
};
