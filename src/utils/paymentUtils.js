export const PRICES = {
    annualFee: 50,
    uniformShirt: 25,
    uniformSkort: 25,
    scarf: 10,
};

export const calculateTotal = (paymentInfo, isAdult) => {
    let total = PRICES.annualFee;
    if (paymentInfo.uniformShirt) {
        total += PRICES.uniformShirt;
    }
    if (paymentInfo.uniformSkort) {
        total += PRICES.uniformSkort;
    }
    if (!isAdult && paymentInfo.scarf) {
        total += PRICES.scarf;
    }
    return total;
};