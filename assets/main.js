fetch("assets/json/flights.json")
    .then((response) => response.json())
    .then((dataObject) => {
        flightData(dataObject["data"]);
    });

function flightData(dataObject) {
    console.log(dataObject);

    // Loop through each airline
    dataObject.airlines.forEach((airline) => {
        const airlineName = airline.name;

        // Loop through each route for this airline
        airline.routes.forEach((route) => {
            const origin = route.origin;
            const destination = route.destination;
            const miles = route.distance_miles;

            // Next flight info
            const nextFlight = route.next_flight;
            const departure = new Date(nextFlight.departure);
            const arrival = new Date(nextFlight.arrival);
            const duration = nextFlight.duration_minutes;

            // Format date and time
            const optionsDate = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            const optionsTime = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };

            const formattedDepartureDate = departure.toLocaleDateString("en-US", optionsDate);
            const formattedDepartureTime = departure.toLocaleTimeString("en-US", optionsTime);
            const formattedArrivalTime = arrival.toLocaleTimeString("en-US", optionsTime);

            // Print all info in one console.log
            console.log(`Airline: ${airlineName}
Origin: ${origin}
Destination: ${destination}
Distance: ${miles} miles
Departure Date: ${formattedDepartureDate}
Departure Time: ${formattedDepartureTime}
Arrival Time: ${formattedArrivalTime}
Duration: ${duration} minutes
------------------------`);

            createFlightCard(airlineName, origin, destination, miles, formattedDepartureDate, formattedDepartureTime, formattedArrivalTime, duration);
        });
    });
}

function createFlightCard(airlineName, origin, destination, miles, formattedDepartureDate, formattedDepartureTime, formattedArrivalTime, duration) {
    // Main card container
    const gridItem = document.createElement("div");
    gridItem.classList.add("flight-card");

    // Flight logo or image
    const logoContainer = document.createElement("div");
    logoContainer.classList.add("flight-logo");
    logoContainer.innerHTML = `<img src="./assets/images/plane.avif" alt="plane_image">`;

    // Flight content container
    const flightDetails = document.createElement("div");
    flightDetails.classList.add("flight-details");

    // Date row
    const dateRow = document.createElement("div");
    dateRow.classList.add("flight-date");
    dateRow.textContent = formattedDepartureDate;

    // Origin → Destination row
    const routeRow = document.createElement("div");
    routeRow.classList.add("flight-route");
    routeRow.innerHTML = `<span class="origin">${origin}</span><span class="arrow">→</span><span class="destination">${destination}</span>`;

    // Time row
    const timeRow = document.createElement("div");
    timeRow.classList.add("flight-times");
    timeRow.innerHTML = `
        <span class="departure-time">${formattedDepartureTime}</span>
        <span class="arrival-time">${formattedArrivalTime}</span>
    `;

    // Side info block
    const sideInfo = document.createElement("div");
    sideInfo.classList.add("flight-side-info");
    sideInfo.innerHTML = `
        <div>${miles} mi</div>
        <div>${duration} min</div>
        <div>${airlineName.toUpperCase()}</div>
    `;

    flightDetails.appendChild(dateRow);
    flightDetails.appendChild(routeRow);
    flightDetails.appendChild(timeRow);

    gridItem.appendChild(logoContainer);
    gridItem.appendChild(flightDetails);
    gridItem.appendChild(sideInfo);

    document.getElementById("flight-grid").appendChild(gridItem);
}





    // airlines -> name
    //  origin
    //  destination
    //  distance_miles
    //  departure
    //  arrival
    //  duration_minutes
    //  status ???
    //  terminal ->
        //  departure
        // arrival
    //  on_time_percentage

/* 
    "origin": "ATL",  --
     "destination": "LAX", --
     "route_id": "DL-ATL-LAX",
     "distance_miles": 1946, --
     "most_recent_flight": {
     "flight_number": "DL1234",
     "departure": "2025-03-31T08:30:00-04:00", --
     "arrival": "2025-03-31T10:45:00-07:00", --
     "duration_minutes": 315, --
     "aircraft": "Boeing 767-300",
     "status": "Scheduled", --?
     "terminals": {
        "departure": "S", --
        "arrival": "2" --
     },
     "on_time_percentage": 87 --
    */


//Media queries
//phones 1 col
//tablet 2 or 3 col
//website 4 col
