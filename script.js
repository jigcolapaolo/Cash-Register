let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

const currency = [
  ["ONE HUNDRED", 100],
  ["TWENTY", 20],
  ["TEN", 10],
  ["FIVE", 5],
  ["ONE", 1],
  ["QUARTER", 0.25],
  ["DIME", 0.1],
  ["NICKEL", 0.05],
  ["PENNY", 0.01]
];

const cashInput = document.getElementById("cash");
const changeDueDiv = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const drawerDiv = document.getElementById("drawer");
const cashDisplay = document.getElementById("cash-display");

document.addEventListener("DOMContentLoaded", () => {
  updateDrawer(cid);
  cashDisplay.textContent = `Total $${price}`;
});

purchaseBtn.addEventListener("click", () => {
  const cash = twoDecimals(Number(cashInput.value));

  if(validateNumber(cash))
    purchase(cash);
  else
    alert("Please input a valid number.");
});

const validateNumber = (cash) => {
  const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
  return cash.toString().match(numberRegex);
};

const purchase = (cash) => {
  showCashDue("");

  if(cash > price)
    calculateChange(twoDecimals(cash - price)); 
  else if(cash === price)
    showCashDue("No change due - customer paid with exact cash");
  else
    alert("Customer does not have enough money to purchase the item");
};

const showCashDue = (str) => {
  changeDueDiv.textContent = str;
};

const setStatus = (cid, change) => {
  
  const totalCid = cid.reduce((acc, value, index) => {
    if(change >= currency[index][1])
      return acc + value[1]
    
    return acc;
  }, 0);
  console.log(totalCid);

  if(totalCid > change)
    return { statusMessage: "Status: OPEN", isOpen: true }
  else if(totalCid === change)
    return { statusMessage: "Status: CLOSED", isOpen: true }
  else
    return { statusMessage: "Status: INSUFFICIENT_FUNDS", isOpen: false }
};

const calculateChange = (change) => {
  const cidr = [...cid].reverse();
  let currentChange = {};
  const status = setStatus(cidr, change);
  let statusMsg = status.statusMessage;

  if(!status.isOpen){
    showCashDue(status.statusMessage);
    return;
  }

  currency.forEach((curr, index) => {

    while(change >= curr[1] && cidr[index][1] >= curr[1]){
      cidr[index][1] = twoDecimals(cidr[index][1] - curr[1]);
      change = twoDecimals(change - curr[1]);

      if(currentChange.hasOwnProperty(curr[0]))
        currentChange[curr[0]] += curr[1];
      else
        currentChange[curr[0]] = curr[1];
    }
  });

  cid = cidr.reverse();
  updateDrawer(cid);
  for(let i in currentChange){
    statusMsg += ` ${i}: $${currentChange[i]}`
  }
  showCashDue(statusMsg);
}

const updateDrawer = (cid) => {
  drawerDiv.innerHTML = "";

  cid.map((change) => {
    drawerDiv.innerHTML += `
      <p>${change[0]}: ${change[1]}</p>
    `;
  })
};


const twoDecimals = num => parseFloat(num.toFixed(2));