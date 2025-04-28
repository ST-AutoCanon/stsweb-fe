export const numberToWords = (num) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero Rupees Only";

  const convertBelowThousand = (n) => {
    if (n < 20) return ones[n];
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
      );
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 !== 0 ? " and " + convertBelowThousand(n % 100) : "")
    );
  };

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundredAndBelow = num;

  let result = "";

  if (crore) result += convertBelowThousand(crore) + " Crore ";
  if (lakh) result += convertBelowThousand(lakh) + " Lakh ";
  if (thousand) result += convertBelowThousand(thousand) + " Thousand ";
  if (hundredAndBelow) result += convertBelowThousand(hundredAndBelow);

  return result.trim() + " Rupees Only";
};
