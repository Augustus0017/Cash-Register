const priSpan = document.getElementById("price");
const input = document.getElementById("cash");
const purBtn = document.getElementById("purchase-btn");
const cashSpan = document.getElementById("cash-span");
const changeDiv = document.getElementById("change-due");
const cashP = document.querySelector("#input p");

// converts a number to 2 decimal place
const to2d = (num) => {
  return Math.round(num*100)/100;
}

// gets the total change in drawer at the start of the program
const sumCid = (arr) => {
  let sum = 0;
  for (let item of arr) {
    sum += item[1];
  }
  return to2d(sum);
}

// changeStr e.g. '" PENNY: $0.04" where the change division is $0.01 per penny and 4 multiples of such division can be gotten from the change due before pennies are added to the change. the penny division is subtracted from change due for every multiple of it that can be gotten
const getChangeStrs = (cdueNum) => {
  const cdivs = [
    ['PENNY', 0.01],
    ['NICKEL', 0.05],
    ['DIME', 0.1],
    ['QUARTER', 0.25],
    ['ONE', 1],
    ['FIVE', 5],
    ['TEN', 10],
    ['TWENTY', 20],
    ['ONE HUNDRED', 100],
  ];

  let totalStr = "";

  // go through the divisions array bottom-up
  for (let i = cdivs.length - 1; i >= 0; i--) {
    let divStr = cdivs[i][0];
    let divNum = cdivs[i][1];

    // find maximum multiples possible
    let maxMult = Math.floor(to2d(cdueNum / divNum));
    let drawerMult = Math.floor(to2d(cid[i][1] / divNum));

    // actual multiples = whichever is smaller
    let mult = Math.min(maxMult, drawerMult);

    if (mult > 0) {
      cid[i][1] -= mult * divNum;   // reduce from drawer
      cdueNum -= mult * divNum;     // reduce change due
      cdueNum = to2d(cdueNum);

      totalStr += ` ${divStr}: $${to2d(mult * divNum)}`;
    }
  }

  if (cdueNum === 0) {
    return totalStr;
  } else {
    return "";
  }
};

let price = 19.5;
let cid = [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];

let changeDue = 0;

priSpan.textContent = price;
cashP.style.display = "none";

const processPayment = () => {
  const cashPayed = to2d(Number(input.value));

  cashSpan.textContent = cashPayed;
  cashP.style.display = "block";

  if (cashPayed < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (cashPayed === price) {
    changeDiv.textContent = "No change due - customer paid with exact cash";
  } else {
    changeDue = to2d(cashPayed - price);
    changeDiv.textContent = getChangeStrs(changeDue);

    if (changeDiv.textContent === "") {
      changeDiv.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (changeDiv.textContent !== "" && sumCid(cid) === 0) {
      changeDiv.textContent = "Status: CLOSED" + changeDiv.textContent;
    } else {
      changeDiv.textContent = "Status: OPEN" + changeDiv.textContent;
    }
  }

  input.value = "";
  input.focus();
}

purBtn.addEventListener("click", processPayment);