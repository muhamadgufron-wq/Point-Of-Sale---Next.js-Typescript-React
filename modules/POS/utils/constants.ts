export const CASH_NOMINALS = [10000, 20000, 50000, 100000];

export function getQuickCashPresets(totalPrice: number) {
  const nominalButtons = CASH_NOMINALS.filter((val) => val >= totalPrice).map((val) => ({
    label: val.toLocaleString("id-ID"),
    value: val,
  }));

  return [{ label: "Uang Pas", value: totalPrice }, ...nominalButtons];
}
