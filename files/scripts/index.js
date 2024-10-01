/* ________________Dates */
document.getElementById("datetimepicker").value = new Date().toISOString().slice(0, 16);
function updateDate() {
    const selectedDate = document.getElementById("datetimepicker").value;
    document.querySelector(".datetimepicker").textContent = selectedDate;
}

// Add event listener to the input element
document.getElementById("datetimepicker").addEventListener("change", updateDate);

// Call the function once to set the initial value
updateDate();

/* _______________Destinations */
document.querySelectorAll('.dest-dropdown-content a').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('selected-destination').textContent = 'Selected Destination: ';
        document.getElementById('selected-destination').textContent = this.textContent;
    });
});

/* ________________Pickup */
document.querySelectorAll('.pickup-dropdown-content a').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('selected-pickup').textContent = 'Selected Pick-up Point: ';
        document.getElementById('selected-pickup').textContent = this.textContent;
    });
});

/* ________________Passengers */
document.querySelectorAll('.pass-dropdown-content a').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('selected-pass').textContent = 'Selected Number of Passengers: ';
        document.getElementById('selected-pass').textContent = this.textContent;
    });
});

/* _________________Cost */
const destinationDropdown = document.querySelector('.dest-dropdown');
const destinationDropbtn = destinationDropdown.querySelector('.dest-dropbtn');
const destinationDropdownContent = destinationDropdown.querySelector('.dest-dropdown-content');

const passengerDropdown = document.querySelector('.pass-dropdown');
const passengerDropbtn = passengerDropdown.querySelector('.pass-dropbtn');
const passengerDropdownContent = passengerDropdown.querySelector('.pass-dropdown-content');

const costDiv = document.createElement('div');
costDiv.id = 'cost';
destinationDropdown.appendChild(costDiv);

let selectedDestination = null;
let selectedPassengerCount = null;

destinationDropdownContent.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        selectedDestination = event.target.textContent;
        destinationDropbtn.textContent = selectedDestination;
        updateCost();
    }
});

function updateCost() {
    if (selectedDestination && selectedPassengerCount) {
        let cost = parseInt(selectedPassengerCount);
        switch (selectedDestination) {
            case 'Mombasa County':
                cost *= 1;
                break;
            case 'Diani':
            case 'Kilifi':
                cost *= 3;
                break;
            case 'Watamu':
                cost *= 4;
                break;
            case 'Malindi':
                cost *= 5;
                break;
            case 'Lamu':
                cost *= 6;
                break;
            default:
                cost = 0;
        }
        const amountInput = document.querySelector('input[name="amount"]'); // Modify selector if needed
        amountInput.value = cost;
        costDiv.textContent = `Trip Cost: kshs${cost}`;
    } else {
        costDiv.textContent = 'Please select pickup point and destination.';
    }
}

/* Vehicle image */
passengerDropdownContent.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        selectedPassengerCount = event.target.getAttribute('data-value');
        passengerDropbtn.textContent = `Select Number of passengers (${selectedPassengerCount})`;
        updateCost();
        const vehicleImage = document.getElementById('vehicle-image');
        switch (selectedPassengerCount) {
            case '2000':
                vehicleImage.src = '../images/saloon.jpg';
                break;
            case '3000':
                vehicleImage.src = '../images/noah.jpg';
                break;
            case '4000':
                vehicleImage.src = '../images/van.jpg';
                break;
            case '5000':
                vehicleImage.src = '../images/minibus.jpg';
                break;
            case '7000':
                vehicleImage.src = '../images/bus.jpg';
                break;
            default:
                vehicleImage.src = '../images/logo.png'; // Clear the image if no match
        }
    }
});

/* Selected passenger output */
const vehicleTypes = {
    "2000": "Saloon",
    "3000": "Van",
    "4000": "Minivan",
    "5000": "Minibus",
    "7000": "Bus",
};

let isDropdownOpen = false;

passengerDropdown.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        isDropdownOpen = !isDropdownOpen;
        passengerDropdownContent.style.display = isDropdownOpen ? 'block' : 'none';
    } else if (event.target.tagName === 'A') {
        event.preventDefault();
        const selectedDataValue = event.target.getAttribute('data-value');
        selectedPassengerCount = selectedDataValue;
        passengerDropbtn.textContent = 'Select Number of passengers'; // Reset button text
        const selectedVehicleType = vehicleTypes[selectedDataValue];
        document.getElementById('selected-pass').textContent = `Vehicle type: ${selectedVehicleType}`;
        updateCost();
    }
});

/* Paypal integration */
function initPayPalButton() {
    paypal
        .Buttons({
            style: {
                shape: "rect",
                color: "gold",
                layout: "vertical",
                label: "paypal",
            },

            createOrder: function (data, actions) {
                const userInput = document.getElementById("cost").value;
                const paypalAmount = parseFloat(userInput) / 100;
                return actions.order.create({
                    purchase_units: [
                        { amount: { currency_code: "USD", value: paypalAmount } },
                    ],
                });
            },

            onApprove: function (data, actions) {
                return actions.order.capture().then(function (orderData) {
                    // Full available details
                    console.log(
                        "Capture result",
                        orderData,
                        JSON.stringify(orderData, null, 2)
                    );

                    // Show a success message within this page, for example:
                    const element = document.getElementById("paypal-button-container");
                    element.innerHTML = "";
                    element.innerHTML = "<h3>Thank you for your payment!</h3>";

                    // Or go to another URL:  actions.redirect('thank_you.html');
                });
            },

            onError: function (err) {
                console.log(err);
            },
        })
        .render("#paypal-button-container");
}
initPayPalButton();

/* Comments */
document.addEventListener('DOMContentLoaded', (event) => {
    loadComments();
});

function addComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (commentText) {
        const comments = getComments();
        comments.push(commentText);
        localStorage.setItem('comments', JSON.stringify(comments));
        commentInput.value = '';
        displayComments(comments);
    }
}

function getComments() {
    const comments = localStorage.getItem('comments');
    return comments ? JSON.parse(comments) : [];
}

function loadComments() {
    const comments = getComments();
    displayComments(comments);
}

function displayComments(comments) {
    const commentsSection = document.getElementById('commentsSection');
    commentsSection.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = comment;
        commentsSection.appendChild(commentElement);
    });
}

/** */
function myFunction() {
    let data = ""; let name = document.getElementById("fullame").value
    let email = document.getElementById("email").value
    let comment = document.getElementById("title").value

    data = "User name : " + name + "<br/>User email : " + email + "<br/>User comment : " + comment

    document.getElementById("data").innerHTML = data  // display data to paragraph
}
