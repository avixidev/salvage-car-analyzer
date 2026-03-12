function calculate(){

let auction = parseFloat(document.getElementById("auctionPrice").value)
let repair = parseFloat(document.getElementById("repairCost").value)
let market = parseFloat(document.getElementById("marketPrice").value)
let fees = parseFloat(document.getElementById("fees").value)

let total = auction + repair + fees
let profit = market - total
let roi = (profit / total) * 100

document.getElementById("result").innerHTML =
"Total Investment: $" + total +
"<br>Profit: $" + profit +
"<br>ROI: " + roi.toFixed(2) + "%"

}