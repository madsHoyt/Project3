let dataObject;
let currentPage = 1;
const itemsPerPage = 30;
let allFlightCards = [];

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
    .then((data) => {
        dataObject = data;
        const page = document.body.dataset.page;
        console.log(page);
        if (page === "flights") {
            const airlineParam = getQueryParam("airline");
            document.querySelector(".loader").classList.add("hidden");
            document
                .querySelector(".plane-animation")
                .classList.remove("hidden");
            flightData(dataObject["data"], airlineParam);
        } else if (page === "index") {
            playSound();
            airlines(dataObject["data"]);
        }
    });

//Sound
function playSound() {
    const sound = new Audio("sounds/airplaneSound.mp3");
    sound.play();
    sound.volume = 0.5;
}

//Grid
function flightData(dataObject, airlineParam = null) {
    const toggle = document.getElementById("toggle-view");
    const flightGrid = document.getElementById("flight-grid");
    flightGrid.innerHTML = "";
    allFlightCards = [];

    dataObject.airlines.forEach((airline) => {
        const airlineName = airline.name;

        if (airlineParam && airlineName !== airlineParam) {
            return;
        }

        // Loop through each route for this airline
        airline.routes.forEach((route) => {
            const origin = route.origin;
            const destination = route.destination;
            const miles = route.distance_miles;

            const nextFlight = route.next_flight;
            const departure = new Date(nextFlight.departure);
            const arrival = new Date(nextFlight.arrival);
            const duration = nextFlight.duration_minutes;

            //dates
            const optionsDate = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            //time
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
            const formattedArrivalTime = arrival.toLocaleTimeString(
                "en-US",
                optionsTime
            );

            if (airlineParam) {
                const flightTitleDiv = document.querySelector(".flight-title");

                if (flightTitleDiv && !flightTitleDiv.querySelector("h5")) {
                    const airlineNameTitle = document.createElement("h5");
                    airlineNameTitle.innerHTML = `${airlineParam}`;
                    airlineNameTitle.classList.add("flights-subheader");
                    flightTitleDiv.appendChild(airlineNameTitle);
                }
            }

            // create card and store it
            const card = createFlightCard(
                airlineName,
                origin,
                destination,
                miles,
                formattedDepartureDate,
                formattedDepartureTime,
                formattedArrivalTime,
                duration,
                toggle
            );

            allFlightCards.push(card);
        });
    });

    //call pagination items
    showPage(currentPage);
    renderPaginationButtons();
}

function createFlightCard(
    airlineName,
    origin,
    destination,
    miles,
    formattedDepartureDate,
    formattedDepartureTime,
    formattedArrivalTime,
    duration,
    toggle
) {
    // Main card container
    const gridItem = document.createElement("div");
    gridItem.classList.add("flight-card");

    gridItem.addEventListener("click", () => {
        const modal = document.getElementById("flight-modal");
        const modalBody = document.getElementById("modal-body");
        const modalContent = modal.querySelector(".modal-content");

        modalBody.innerHTML = `
            <h2>${origin} → ${destination}</h2>
            <p><strong>Date:</strong> ${formattedDepartureDate}</p>
            <p><strong>Time:</strong> ${formattedDepartureTime} - ${formattedArrivalTime}</p>
            <p><strong>Distance:</strong> ${miles} miles</p>
            <p><strong>Duration:</strong> ${duration} minutes</p>
            <p><strong>Airline:</strong> ${airlineName}</p>
        `;

        modal.classList.remove("hidden");

        modalContent.classList.remove("fade-out");
        void modalContent.offsetWidth;
        modalContent.classList.add("fade-in");
    });

    if (toggle.checked) {
        // Flight logo or image
        const logoContainer = document.createElement("div");
        logoContainer.classList.add("flight-logo");

        // Convert to Date object using today's date
        const timeParts = formattedDepartureTime.split(":");
        const hours = parseInt(timeParts[0], 10);

        // You can now use conditions based on the hour

        if (hours < 12) {
            logoContainer.innerHTML = `<img src="images/morning.png" alt="Plane in the morning sky">`;
        } else if (hours >= 18) {
            logoContainer.innerHTML = `<img src="assets/images/night.png" alt="Plane in the night sky">`;
        } else {
            logoContainer.innerHTML = `<img src="assets/images/afternoon.png" alt="Plane in the afternoon sky">`;
        }

        logoContainer.classList.add("relative-position");

        const airline = document.createElement("p");
        airline.innerHTML = airlineName.toUpperCase();
        airline.classList.add("airline-name");
        logoContainer.append(airline);
        gridItem.appendChild(logoContainer);
    }
    //Flight content container
    const flightDetails = document.createElement("div");
    flightDetails.classList.add("flight-details");

    //Date row
    const dateRow = document.createElement("div");
    dateRow.classList.add("flight-date");
    dateRow.textContent = formattedDepartureDate;

    //Origin --> Destination row
    const routeRow = document.createElement("div");
    routeRow.classList.add("flight-route");
    routeRow.innerHTML = `<span class="origin">${origin}</span><span class="arrow">→</span><span class="destination">${destination}</span>`;

    //Time row
    const timeRow = document.createElement("div");
    timeRow.classList.add("flight-times");
    timeRow.innerHTML = `${formattedDepartureTime} - ${formattedArrivalTime}`;
    timeRow.classList.add("departure-time");

    //Side info block
    const sideInfo = document.createElement("div");
    sideInfo.classList.add("flight-side-info");
    sideInfo.innerHTML = `
        <div>${miles} mi</div>
        <div>${duration} min</div>
    `;

    flightDetails.appendChild(dateRow);
    flightDetails.appendChild(routeRow);
    flightDetails.appendChild(timeRow);

    gridItem.appendChild(flightDetails);
    gridItem.appendChild(sideInfo);

    // document.getElementById("flight-grid").appendChild(gridItem);
    return gridItem;
}
//Pagination
function showPage(page) {
    const flightGrid = document.getElementById("flight-grid");
    flightGrid.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCards = allFlightCards.slice(start, end);

    pageCards.forEach((card) => flightGrid.appendChild(card));
}
//Pagination
function renderPaginationButtons() {
    const container = document.getElementById("pagination-controls");
    container.innerHTML = "";

    const totalPages = Math.ceil(allFlightCards.length / itemsPerPage);

    // Prev Button
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        currentPage--;
        showPage(currentPage);
        renderPaginationButtons();
    };
    container.appendChild(prevBtn);

    // Page Number Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add("active-page");
        }
        pageBtn.onclick = () => {
            currentPage = i;
            showPage(currentPage);
            renderPaginationButtons();
        };
        container.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        currentPage++;
        showPage(currentPage);
        renderPaginationButtons();
    };
    container.appendChild(nextBtn);
}

//Toggle event listener
document.getElementById("toggle-view").addEventListener("change", function () {
    const airlineParam = getQueryParam("airline");
    if (this.checked) {
        flightData(dataObject["data"], airlineParam);
        console.log("Toggle ON");
    } else {
        flightData(dataObject["data"], airlineParam);
        console.log("Toggle OFF");
    }
});
//Event lister to clear query params
document
    .getElementById("flights-nav")
    .addEventListener("click", function (event) {
        if (
            window.location.pathname.includes("flights.html") &&
            window.location.search
        ) {
            event.preventDefault();

            //remove query parameters from the URL
            window.history.pushState({}, "", "flights.html");

            const flightTitleDiv = document.querySelector(".flights-subheader");
            if (flightTitleDiv) {
                flightTitleDiv.innerHTML = "";
            }
            flightData(dataObject["data"]);
        }
    });

//Airlines
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

//Audio
document.querySelectorAll(".plane-icon").forEach((icon) => {
    icon.addEventListener("click", function (event) {
        const sound = document.getElementById("plane-sound");
        sound.play().catch((err) => {
            console.log("Audio failed to play:", err);
        });
    });
});

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

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Close modal
function closeModal() {
    const modal = document.getElementById("flight-modal");
    const modalContent = modal.querySelector(".modal-content");

    modalContent.classList.remove("fade-in");
    modalContent.classList.add("fade-out");

    modalContent.addEventListener(
        "animationend",
        () => {
            modal.classList.add("hidden");
            modalContent.classList.remove("fade-out");
        },
        { once: true }
    );
}

document.querySelector(".close-btn").addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
    if (e.target.id === "flight-modal") {
        closeModal();
    }
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
