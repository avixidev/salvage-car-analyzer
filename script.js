function calculate() {
    const carModel = document.getElementById("carModel").value.trim();
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
    let dealBadgeClass = "";

    if (roi >= 20) {
        dealRating = "Strong deal";
        dealBadgeClass = "badge-green";
    } else if (roi >= 10) {
        dealRating = "Decent deal";
        dealBadgeClass = "badge-yellow";
    } else if (roi >= 0) {
        dealRating = "Low-margin deal";
        dealBadgeClass = "badge-blue";
    } else {
        dealRating = "Bad deal";
        dealBadgeClass = "badge-red";
    }

    let riskLevel = "";
    let riskBadgeClass = "";

    if (damageType === "Flood" || damageType === "Biohazard") {
        riskLevel = "High";
        riskBadgeClass = "badge-red";
    } else if (damageType === "Mechanical" || damageType === "Side Damage") {
        riskLevel = "Medium";
        riskBadgeClass = "badge-yellow";
    } else {
        riskLevel = "Low";
        riskBadgeClass = "badge-green";
    }

    document.getElementById("result").innerHTML = `
        <div class="result-row"><strong>Vehicle:</strong> ${year} ${carModel}</div>
        <div class="result-row"><strong>Mileage:</strong> ${mileage.toLocaleString()} miles</div>
        <div class="result-row"><strong>Damage Type:</strong> ${damageType}</div>
        <div class="result-row">
            <strong>Risk Level:</strong>
            <span class="badge ${riskBadgeClass}">${riskLevel}</span>
        </div>
        <br>
        <div class="result-row"><strong>Total Investment:</strong> $${totalInvestment.toLocaleString()}</div>
        <div class="result-row"><strong>Potential Profit:</strong> $${profit.toLocaleString()}</div>
        <div class="result-row"><strong>ROI:</strong> ${roi.toFixed(2)}%</div>
        <div class="result-row">
            <strong>Deal Rating:</strong>
            <span class="badge ${dealBadgeClass}">${dealRating}</span>
        </div>
    `;

    const tableBody = document
        .getElementById("historyTable")
        .getElementsByTagName("tbody")[0];

    const row = tableBody.insertRow();

    row.insertCell(0).innerText = `${year} ${carModel}`;
    row.insertCell(1).innerText = `${roi.toFixed(2)}%`;
    row.insertCell(2).innerText = `$${profit.toLocaleString()}`;
    row.insertCell(3).innerText = riskLevel;
}