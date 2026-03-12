function calculate() {
    const carModel = document.getElementById("carModel").value;
    const year = document.getElementById("year").value;
    const mileage = parseFloat(document.getElementById("mileage").value);
    const damageType = document.getElementById("damageType").value;

    const auction = parseFloat(document.getElementById("auctionPrice").value);
    const repair = parseFloat(document.getElementById("repairCost").value);
    const market = parseFloat(document.getElementById("marketPrice").value);
    const fees = parseFloat(document.getElementById("fees").value);

    if (
        !carModel ||
        !year ||
        isNaN(mileage) ||
        !damageType ||
        isNaN(auction) ||
        isNaN(repair) ||
        isNaN(market) ||
        isNaN(fees)
    ) {
        document.getElementById("result").innerHTML =
            "Please fill in all fields before analyzing the deal.";
        return;
    }

    const totalInvestment = auction + repair + fees;
    const profit = market - totalInvestment;
    const roi = (profit / totalInvestment) * 100;

    let dealRating = "";

    if (roi >= 20) {
        dealRating = "Strong deal";
    } else if (roi >= 10) {
        dealRating = "Decent deal";
    } else if (roi >= 0) {
        dealRating = "Low-margin deal";
    } else {
        dealRating = "Bad deal";
    }

    document.getElementById("result").innerHTML = `
        <strong>Vehicle:</strong> ${year} ${carModel}<br>
        <strong>Mileage:</strong> ${mileage.toLocaleString()} miles<br>
        <strong>Damage Type:</strong> ${damageType}<br><br>

        <strong>Total Investment:</strong> $${totalInvestment.toLocaleString()}<br>
        <strong>Potential Profit:</strong> $${profit.toLocaleString()}<br>
        <strong>ROI:</strong> ${roi.toFixed(2)}%<br>
        <strong>Deal Rating:</strong> ${dealRating}
    `;
}