let profitChart;

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

    const desiredProfit = parseFloat(document.getElementById("desiredProfit").value) || 0;
    const maxBid = market - repair - fees - desiredProfit;

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
        <div class="result-row"><strong>Safe Max Bid:</strong> $${maxBid.toLocaleString()}</div>
    `;

    const deal = {
        id: Date.now(),
        carModel: carModel,
        year: year,
        mileage: mileage,
        damageType: damageType,
        auction: auction,
        repair: repair,
        market: market,
        fees: fees,
        car: `${year} ${carModel}`,
        roi: roi,
        profit: profit,
        risk: riskLevel
    };

    saveDeal(deal);
    renderDeals();
}

function getDeals() {
    return JSON.parse(localStorage.getItem("deals")) || [];
}

function saveDeal(deal) {
    const deals = getDeals();
    deals.push(deal);
    localStorage.setItem("deals", JSON.stringify(deals));
}

function renderDeals() {
    const tableBody = document
        .getElementById("historyTable")
        .getElementsByTagName("tbody")[0];

    tableBody.innerHTML = "";

    const deals = getDeals();

    deals.forEach(function (deal) {
        const row = tableBody.insertRow();

        row.insertCell(0).innerText = deal.car;
        row.insertCell(1).innerText = `${deal.roi.toFixed(2)}%`;
        row.insertCell(2).innerText = `$${deal.profit.toLocaleString()}`;
        row.insertCell(3).innerText = deal.risk;

        const actionCell = row.insertCell(4);
        actionCell.innerHTML = `
            <button class="sort-btn" onclick="editDeal(${deal.id})">Edit</button>
            <button class="delete-btn" onclick="deleteDeal(${deal.id})">Delete</button>
        `;
    });

    updateAnalytics();
    renderProfitChart();
}

function deleteDeal(id) {
    let deals = getDeals();
    deals = deals.filter(function (deal) {
        return deal.id !== id;
    });

    localStorage.setItem("deals", JSON.stringify(deals));
    renderDeals();
}

function clearHistory() {
    localStorage.removeItem("deals");
    renderDeals();
}

function sortDealsByROI() {
    const deals = getDeals();

    deals.sort(function (a, b) {
        return b.roi - a.roi;
    });

    localStorage.setItem("deals", JSON.stringify(deals));
    renderDeals();
}

function sortDealsByProfit() {
    const deals = getDeals();

    deals.sort(function (a, b) {
        return b.profit - a.profit;
    });

    localStorage.setItem("deals", JSON.stringify(deals));
    renderDeals();
}

function editDeal(id) {
    let deals = getDeals();

    const dealToEdit = deals.find(function (deal) {
        return deal.id === id;
    });

    if (!dealToEdit) {
        return;
    }

    document.getElementById("carModel").value = dealToEdit.carModel || "";
    document.getElementById("year").value = dealToEdit.year || "";
    document.getElementById("mileage").value = dealToEdit.mileage || "";
    document.getElementById("damageType").value = dealToEdit.damageType || "";
    document.getElementById("auctionPrice").value = dealToEdit.auction || "";
    document.getElementById("repairCost").value = dealToEdit.repair || "";
    document.getElementById("marketPrice").value = dealToEdit.market || "";
    document.getElementById("fees").value = dealToEdit.fees || "";

    deals = deals.filter(function (deal) {
        return deal.id !== id;
    });

    localStorage.setItem("deals", JSON.stringify(deals));
    renderDeals();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function updateAnalytics() {
    const deals = getDeals();

    const totalDeals = deals.length;

    const averageROI =
        totalDeals > 0
            ? deals.reduce(function (sum, deal) {
                  return sum + deal.roi;
              }, 0) / totalDeals
            : 0;

    const bestProfit =
        totalDeals > 0
            ? Math.max(...deals.map(function (deal) {
                  return deal.profit;
              }))
            : 0;

    const worstProfit =
        totalDeals > 0
            ? Math.min(...deals.map(function (deal) {
                  return deal.profit;
              }))
            : 0;

    document.getElementById("totalDeals").innerText = totalDeals;
    document.getElementById("averageROI").innerText = `${averageROI.toFixed(2)}%`;
    document.getElementById("bestProfit").innerText = `$${bestProfit.toLocaleString()}`;
    document.getElementById("worstProfit").innerText = `$${worstProfit.toLocaleString()}`;
}

function renderProfitChart() {
    const deals = getDeals();

    const labels = deals.map(function (deal) {
        return deal.car;
    });

    const profits = deals.map(function (deal) {
        return deal.profit;
    });

    const barColors = profits.map(function (profit) {
        if (profit > 0) {
            return "rgba(46, 204, 113, 0.75)";
        } else if (profit < 0) {
            return "rgba(231, 76, 60, 0.75)";
        } else {
            return "rgba(52, 152, 219, 0.75)";
        }
    });

    const borderColors = profits.map(function (profit) {
        if (profit > 0) {
            return "#2ecc71";
        } else if (profit < 0) {
            return "#e74c3c";
        } else {
            return "#3498db";
        }
    });

    const ctx = document.getElementById("profitChart").getContext("2d");

    if (profitChart) {
        profitChart.destroy();
    }

    profitChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Profit",
                    data: profits,
                    backgroundColor: barColors,
                    borderColor: borderColors,
                    borderWidth: 1.5,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#cbd5e1"
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#cbd5e1"
                    },
                    grid: {
                        color: "rgba(255,255,255,0.08)"
                    }
                },
                y: {
                    ticks: {
                        color: "#cbd5e1"
                    },
                    grid: {
                        color: "rgba(255,255,255,0.08)"
                    }
                }
            }
        }
    });
}

window.onload = function () {
    renderDeals();
};
async function decodeVIN() {
    const vin = document.getElementById("vin").value.trim();

    if (!vin) {
        alert("Введите VIN.");
        return;
    }

    if (vin.length < 11) {
        alert("VIN выглядит слишком коротким.");
        return;
    }

    try {
        const response = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
        );

        const data = await response.json();
        const vehicle = data.Results[0];

        if (!vehicle || !vehicle.Make || !vehicle.Model || !vehicle.ModelYear) {
            alert("Не удалось распознать VIN.");
            return;
        }

        document.getElementById("carModel").value =
            `${vehicle.Make} ${vehicle.Model}`;
        document.getElementById("year").value = vehicle.ModelYear;
    } catch (error) {
        console.error(error);
        alert("Ошибка при декодировании VIN.");
    }
}
function estimateRepair() {
    const damage = document.getElementById("damageType").value;
    const market = parseFloat(document.getElementById("marketPrice").value);

    if (!damage || isNaN(market)) return;

    let percent = 0;

    if (damage === "Front End") percent = 0.15;
    if (damage === "Rear End") percent = 0.10;
    if (damage === "Side Damage") percent = 0.18;
    if (damage === "Hail") percent = 0.08;
    if (damage === "Flood") percent = 0.30;

    const estimate = Math.round(market * percent);

    document.getElementById("repairCost").value = estimate;
}
async function estimateRepairWithAI() {
    const notes = document.getElementById("damageNotes").value.trim();
    const damageType = document.getElementById("damageType").value;
    const marketPrice = parseFloat(document.getElementById("marketPrice").value) || 0;
    const files = document.getElementById("damagePhotos").files;

    if (!notes && files.length === 0) {
        document.getElementById("aiEstimateResult").innerHTML =
            "Please upload at least one photo or add damage notes.";
        return;
    }

    try {
        const formData = new FormData();
        formData.append("damageType", damageType);
        formData.append("marketPrice", marketPrice);
        formData.append("notes", notes);

        for (const file of files) {
            formData.append("damagePhotos", file);
        }

        const response = await fetch("/estimate-ai", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

                document.getElementById("aiEstimateResult").innerHTML = `
            <strong>Approximate Repair Estimate by AI</strong><br><br>

            <strong>Uploaded images:</strong> ${data.uploaded_images}<br><br>

            <strong>Selected damage type:</strong> ${damageType || "Not selected"}<br><br>

            <strong>Approximate damage zone:</strong><br>
            ${data.detected_areas && data.detected_areas.length
                ? data.detected_areas.map(item => `• ${item}`).join("<br>")
                : "• inspection required"}<br><br>

            <strong>Likely damaged components:</strong><br>
            ${data.components && data.components.length
                ? data.components.map(item => `• ${item}`).join("<br>")
                : "• inspection required"}<br><br>

            <strong>Estimated repair range:</strong><br>
            $${data.repair_range_min.toLocaleString()} – $${data.repair_range_max.toLocaleString()}<br><br>

            <strong>Confidence:</strong> ${data.confidence}<br><br>

            <strong>Important note:</strong><br>
            This is an approximate AI-assisted estimate based on uploaded photos, selected damage type, market value, and user input. Hidden structural or internal damage may increase final cost.
        `;
    } catch (error) {
        console.error(error);
        document.getElementById("aiEstimateResult").innerHTML =
            "Error getting AI estimate from backend.";
    }
}