/* ________________Dates */
document.getElementById("datetimepicker").value = new Date().toISOString().slice(0, 16);
function updateDate() {
    const selectedDate = document.getElementById("datetimepicker").value;
    document.querySelector(".datetimepicker").innerHTML = selectedDate;
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
        // Set readonly attribute
        amountInput.setAttribute('readonly', true);
    } else {
        costDiv.textContent = 'Please select pickup point and destination.';
        // Remove readonly attribute if previously set
        const amountInput = document.querySelector('input[name="amount"]'); // Modify selector if needed
        amountInput.removeAttribute('readonly');
    }
}

passengerDropdownContent.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        selectedPassengerCount = event.target.getAttribute('data-value');
        passengerDropbtn.textContent = `Select Number of passengers (${selectedPassengerCount})`;
        updateCost();
        const vehicleImage = document.getElementById('vehicle-image');
        console.log(`Selected Passenger Count: ${selectedPassengerCount}`); // Add this line
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
function myFunction() {
    let data = ""; let name = document.getElementById("fullame").value
    let email = document.getElementById("email").value
    let comment = document.getElementById("title").value

    data = "User name : " + name + "<br/>User email : " + email + "<br/>User comment : " + comment

    document.getElementById("data").innerHTML = data  // display data to paragraph
}

/* mpesa */
var button = document.getElementById("mpesaButton");

if (button !== null) {
    document.head.insertAdjacentHTML('beforeend', '<link rel=stylesheet href="https://cdn.jsdelivr.net/gh/muaad/mpesa_button@master/styles/style.css">');
    img = '<img style="width: 35px; display: inline; margin: -8px;" src= "https://cdn.jsdelivr.net/gh/muaad/mpesa_button@master/images/mpesa.png">'
    btnMarkup = '<a href="" id="mpesaBtn" class="mpesaButton">' + img + '<span style="margin-right: 15px;">Pay with Mpesa</span></a>'
    phoneInstruction = '<strong><em>We will send an Mpesa payment request to this phone number</em></strong>'
    form = '<form>\
    <label for="amount" class="mpesaLabel">Amount</label><input class="mpesaInput" type="text" placeholder="2000" name="amount" id="mpesaAmount"></input><br>\
    <label for="phone" class="mpesaLabel">Phone Number</label><input class="mpesaInput" type="text" placeholder="254722123456" name="phone" id="mpesaPhoneNumber"></input><br>' + phoneInstruction + '<br><br><button href="" id="mpesaSend" class="mpesaButton" style="width: 100%;">' + img + '<span style="margin-right: 15px;">Pay</span></button></form>'
    formMarkup = '<div id="mpesaForm"><h3 class="mpesaHeader">Pay With Mpesa</h3><button id="closeMpesaForm" class="mpesaFormClose">&#x2716;</button>' + form + '</div>'
    button.innerHTML = btnMarkup

    success = '<div style="text-align: center;" class="animate-bottom">\
    <h2>√ Success</h2>\
    <p>An Mpesa payment request will be sent to your phone shortly</p>\
  </div>'

    button.addEventListener('click', function (e) {
        e.preventDefault();
        var formDiv = document.getElementById('mpesaForm');
        // Check if the form exists before creating a new one
        if (!formDiv) {
            formDiv = document.createElement('div');
            button.parentNode.insertBefore(formDiv, button.nextSibling);
            formDiv.innerHTML = formMarkup;
        }
        formDiv.style.display = formDiv.style.display === 'block' ? 'none' : 'block';

        // Close button functionality
        var closeButton = document.getElementById("closeMpesaForm");
        closeButton.addEventListener('click', function () {
            formDiv.style.display = 'none';
            // Toggle the visibility of the initial button
            button.style.display = button.style.display === 'none' ? 'block' : 'none';
        });

        amountInput = document.getElementById("mpesaAmount")
        phoneInput = document.getElementById("mpesaPhoneNumber")
        phone = button.getAttribute('data-phone')
        amount = button.getAttribute('data-amount')
        url = button.getAttribute('data-url')
        amountInput.value = amount
        phoneInput.value = phone

        payButton = document.getElementById("mpesaSend")
        loaderDiv = document.createElement('div')
        loaderDiv.setAttribute("id", "loader");
        payButton.parentNode.insertBefore(loaderDiv, payButton.nextSibling);
        loader = document.getElementById("loader")
        loader.style.display = "none";
        loader.style.margin = '-75px 0 0 -110px';

        payButton.addEventListener('click', function (evt) {
            evt.preventDefault();
            payButton.disabled = true;
            document.getElementById('mpesaPhoneNumber').disabled = true;
            formDiv = document.getElementById('mpesaForm')
            if (url !== undefined) {
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", url, true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send('phone=' + phoneInput.value + '&amount=' + amountInput.value);
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        formDiv.innerHTML = success
                    } else {
                        formDiv.innerHTML = 'Something went wrong. Contact website developer. Error: "We could not POST to the URL specified!"'
                    }
                };
            } else {
                setTimeout(function () {
                    formDiv.innerHTML = 'Something went wrong. Contact website developer. Error: "No URL specified!"'
                }, 3000);
            }
            loader.style.display = "";
        })
    })
}

/** mpesa close button */
button.addEventListener('click', function (e) {
    // ... (existing code)
    formDiv.style.display = formDiv.style.display === 'block' ? 'none' : 'block';

    // Close button functionality
    var closeButton = document.getElementById("closeMpesaForm");
    closeButton.addEventListener('click', function () {
        formDiv.style.display = 'none';
    });
});
