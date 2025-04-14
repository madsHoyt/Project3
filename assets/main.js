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
        console.log("Airline:", airlineName);

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
