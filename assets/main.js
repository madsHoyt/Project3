fetch("https://flights.is120.ckearl.com/")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Fetch failed");
        }
        return response.json();
    })
    .catch(() => {
        //Do this instead
        return fetch("assets/json/flights.json").then((response) =>
            response.json()
        );
    })
    .then((dataObject) => {
        flightData(dataObject["data"]);
        airlines(dataObject["data"]);
    });

function flightData(dataObject) {
    console.log(dataObject);

    // Loop through each airline
    dataObject.airlines.forEach((airline) => {
        const airlineName = airline.name;
        //console.log("Airline:", airlineName);

        // Loop through each route for this airline
        airline.routes.forEach((route) => {
            const origin = route.origin;
            const destination = route.destination;
            const distance = route.distance_miles;

            // Next flight info
            const departure = new Date(route.next_flight.departure);
            const arrival = new Date(route.next_flight.arrival);
            const duration = route.next_flight.duration_minutes;

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
            const formattedDepartureDate = departure.toLocaleDateString(
                "en-US",
                optionsDate
            );
            const formattedDepartureTime = departure.toLocaleTimeString(
                "en-US",
                optionsTime
            );

            const formattedArrivalDate = arrival.toLocaleDateString(
                "en-US",
                optionsDate
            );
            const formattedArrivalTime = arrival.toLocaleTimeString(
                "en-US",
                optionsTime
            );

            // //Test
            // console.log(`Route: ${origin} ➡️ ${destination}`);
            // console.log(`Distance: ${distance} miles`);
            // console.log(
            //     `Departure: ${formattedDepartureDate} at ${formattedDepartureTime}`
            // );
            // console.log(
            //     `Arrival: ${formattedArrivalDate} at ${formattedArrivalTime}`
            // );
            // console.log(`Duration: ${duration} minutes`);
            // console.log("---------------------------");
        });
    });
}

function airlines(dataObject) {
    const cardGrid = document.getElementById("c-grid");

    dataObject.airlines.forEach((airline) => {
        const airlineName = airline.name;
        const logo = airline.logo;

        //create an anchor
        const card = document.createElement("a");
        card.classList.add("card");
        card.href = `flights.html?airline=${encodeURIComponent(airlineName)}`;

        //create and append the logo image
        const logoImg = document.createElement("img");
        logoImg.src = logo;
        logoImg.alt = `${airlineName} logo`;
        logoImg.classList.add("airline-logo");

        //append the logo and name to the anchor tag
        card.appendChild(logoImg);

        //add the card to the card grid
        cardGrid.appendChild(card);
    });
}

//Getting Email for Newsletter
document
    .getElementById("newsletter-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;

        console.log("Email submitted:", email);

        // Change the inner HTML of the confirmation message
        const confirmationMessage = document.getElementById(
            "confirmation-message"
        );
        confirmationMessage.innerHTML = `<p>Thank you for subscribing, ${email}!</p>`;

        document.getElementById("email").value = "";
    });

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

/* Chat Help:
    Q: I have this format: 2025-03-31T08:30:00-04:00 how can I extract the time and date.
    A: {
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
        const formattedDepartureDate = departure.toLocaleDateString(
            "en-US",
            optionsDate
        );
        const formattedDepartureTime = departure.toLocaleTimeString(
            "en-US",
            optionsTime
        );

        const formattedArrivalDate = arrival.toLocaleDateString(
            "en-US",
            optionsDate
        );
        const formattedArrivalTime = arrival.toLocaleTimeString(
            "en-US",
            optionsTime
        );
    }
*/
