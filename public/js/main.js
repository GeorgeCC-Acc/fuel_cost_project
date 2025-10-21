document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calc-form");
  const output = document.querySelector(".price");
  const costMessage = document.querySelector(".costMessage");
  const manualBtn = document.getElementById("manual");
  const autoBtn = document.getElementById("auto");
  let decision = false;

  manualBtn.addEventListener("click", function () {
    const starts = document.getElementsByClassName("start");
    for (let el of starts) {
      el.style.display = "none";
    }

    const ends = document.getElementsByClassName("end");
    for (let el of ends) {
      el.style.display = "none";
    }

    const distance = document.getElementById("distance");
    distance.readOnly = false;
    distance.value = "";
    distance.style.color = "#000";

    decision = false;
  });

  autoBtn.addEventListener("click", function () {
    const starts = document.getElementsByClassName("start");
    for (let el of starts) {
      el.style.display = "inline";
    }

    const ends = document.getElementsByClassName("end");
    for (let el of ends) {
      el.style.display = "inline";
    }
    const distance = document.getElementById("distance");
    distance.readOnly = true;
    distance.value = "Calculating...";
    distance.style.color = "#d3d3d3ff";

    decision = true;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const start = document.getElementById("start-location").value;
    const end = document.getElementById("end-location").value;
    const distance = parseFloat(document.getElementById("distance").value);
    const cons = parseFloat(document.getElementById("consumption").value);
    const fuel = parseFloat(document.getElementById("fuel-cost").value);
    const distanceEl = document.getElementById("distance");
    let distanceMiles = 0;

    if (!decision) {
      if (isNaN(distance) || isNaN(cons) || isNaN(fuel)) {
        costMessage.textContent = "Please fill in all fields correctly!";
        costMessage.style.color = "red";
        output.textContent = "";
        scrollToResults();
        return;
      } else {
        calculateCost(distance, cons, fuel);
      }
    } else {
      if (!start || !end || isNaN(cons) || isNaN(fuel)) {
        costMessage.textContent = "Please fill in all fields correctly!";
        costMessage.style.color = "red";
        output.textContent = "";
        scrollToResults();
        return;
      }

      costMessage.style.color = "black";
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [start],
          destinations: [end],
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status !== "OK") {
            costMessage.textContent = "Error fetching distance.";
            console.error(status);
            return;
          }

          const element = response.rows[0].elements[0];
          if (element.status !== "OK") {
            costMessage.textContent = "Could not find a route.";
            return;
          }

          const distanceMeters = element.distance.value;
          distanceMiles = distanceMeters / 1609.34;
          const roundedMiles = distanceMiles.toFixed();
          distanceEl.value = `${roundedMiles}`;
          distanceEl.style.color = "#a5a5a5ff";

          calculateCost(distanceMiles, cons, fuel);
        }
      );
    }
  });

  function calculateCost(distance, consumption, fuel) {
    const gallonsUsed = distance / consumption;
    const litersUsed = gallonsUsed * 4.546092;
    const costPence = litersUsed * fuel;
    const costPounds = (costPence / 100).toFixed(2);

    costMessage.textContent = "This Journey costs:";
    output.textContent = `£${costPounds}`;
    scrollToResults();
  }
  function scrollToResults() {
    const output = document.querySelector(".costMessage");
    output.scrollIntoView({ behavior: "smooth" });
  }
});
