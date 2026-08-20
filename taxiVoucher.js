/* =========================================================
   ARONEE TOURS & TRAVELS
   TAXI CONFIRMATION VOUCHER
   JAVASCRIPT
========================================================= */


/* =========================================================
   LOAD BOOKING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadVoucher();

    }
);


/* =========================================================
   LOAD SELECTED TAXI BOOKING
========================================================= */

function loadVoucher() {

    const savedBooking =
        localStorage.getItem(
            "selectedTaxiBooking"
        );


    if (!savedBooking) {

        alert(
            "No taxi booking was selected."
        );

        return;

    }


    let booking;


    try {

        booking =
            JSON.parse(savedBooking);

    } catch (error) {

        console.error(
            "Unable to read taxi booking:",
            error
        );

        alert(
            "Unable to load the taxi booking."
        );

        return;

    }


    populateVoucher(booking);

}


/* =========================================================
   POPULATE VOUCHER
========================================================= */

function populateVoucher(booking) {


    /* =====================================================
       CUSTOMER DETAILS
    ===================================================== */

    setText(
        "bookingId",
        booking.bookingId
    );


    setText(
        "bookingDate",
        formatDate(booking.bookingDate)
    );


    setText(
        "customerName",
        booking.customerName
    );


    setText(
        "customerId",
        booking.customerId
    );


    setText(
        "mobile",
        booking.mobile
    );


    /* Address */

    if (
        hasValue(booking.address)
    ) {

        setText(
            "address",
            booking.address
        );

        showElement(
            "addressRow"
        );

    } else {

        hideElement(
            "addressRow"
        );

    }


    /* =====================================================
       GUEST DETAILS
    ===================================================== */

    loadGuestDetails(
        booking.guestDetails
    );


    /* =====================================================
       TRIP DETAILS
    ===================================================== */

    setText(
        "pickupDate",
        formatDate(booking.pickupDate)
    );


    setText(
        "pickupTime",
        formatTime(booking.pickupTime)
    );


    setText(
        "dropDate",
        formatDate(booking.dropDate)
    );


    setText(
        "dropTime",
        formatTime(booking.dropTime)
    );


    setText(
        "pickupLocation",
        booking.pickupLocation
    );


    setText(
        "dropLocation",
        booking.dropLocation
    );


    setText(
        "tripType",
        booking.tripType
    );


    /* =====================================================
       PACKAGE
       SHOW ONLY WHEN ENTERED
    ===================================================== */

    if (
        hasValue(booking.package)
    ) {

        setText(
            "package",
            booking.package
        );

        showElement(
            "packageRow"
        );

    } else {

        hideElement(
            "packageRow"
        );

    }


    /* =====================================================
       ITINERARY
       SHOW ONLY WHEN ENTERED
    ===================================================== */

    if (
        hasValue(booking.itinerary)
    ) {

        setText(
            "itinerary",
            booking.itinerary
        );

        showElement(
            "itineraryRow"
        );

    } else {

        hideElement(
            "itineraryRow"
        );

    }


    /* =====================================================
       TOTAL KM / HRS
       SHOW ONLY WHEN ENTERED
    ===================================================== */

    if (
        hasValue(booking.totalKmHrs)
    ) {

        setText(
            "totalKmHrs",
            booking.totalKmHrs
        );

        showElement(
            "totalKmHrsRow"
        );

    } else {

        hideElement(
            "totalKmHrsRow"
        );

    }


    /* =====================================================
       VEHICLE / DRIVER
    ===================================================== */

    loadTransportationDetails(
        booking
    );


    /* =====================================================
       PAYMENT DETAILS
    ===================================================== */

    loadPaymentDetails(
        booking
    );


    /* =====================================================
       BOOKING STATUS
    ===================================================== */

    loadBookingStatus(
        booking.bookingStatus
    );


    /* =====================================================
       BOOKING NOTES
    ===================================================== */

    if (
        hasValue(booking.bookingNotes)
    ) {

        setText(
            "bookingNotes",
            booking.bookingNotes
        );

        showElement(
            "notesSection"
        );

    } else {

        hideElement(
            "notesSection"
        );

    }

}


/* =========================================================
   GUEST DETAILS
========================================================= */

function loadGuestDetails(
    guestDetails
) {

    const section =
        document.getElementById(
            "guestSection"
        );


    const container =
        document.getElementById(
            "guestDetailsContainer"
        );


    container.innerHTML = "";


    /*
       No guests entered
    */

    if (
        !Array.isArray(guestDetails) ||
        guestDetails.length === 0
    ) {

        section.style.display =
            "none";

        return;

    }


    /*
       Check whether at least one guest
       has ID proof
    */

    const hasAnyIdProof =
        guestDetails.some(
            function (guest) {

                return (
                    hasValue(
                        guest.idProofName
                    ) ||
                    hasValue(
                        guest.idNumber
                    )
                );

            }
        );


    /* =====================================================
       HEADER
    ===================================================== */

    let html = `

        <div class="guest-row-voucher guest-header-row">

            <div class="guest-cell">
                #
            </div>

            <div class="guest-cell">
                Guest Name
            </div>

            <div class="guest-cell">
                Age
            </div>
    `;


    if (hasAnyIdProof) {

        html += `

            <div class="guest-cell id-proof-cell">
                ID Proof
            </div>

            <div class="guest-cell id-proof-cell">
                ID Number
            </div>

        `;

    }


    html += `

        </div>

    `;


    /* =====================================================
       GUEST ROWS
    ===================================================== */

    guestDetails.forEach(
        function (guest, index) {


            html += `

                <div class="guest-row-voucher">

                    <div class="guest-cell">
                        ${index + 1}
                    </div>

                    <div class="guest-cell">
                        ${escapeHTML(
                            guest.name || ""
                        )}
                    </div>

                    <div class="guest-cell">
                        ${
                            guest.age !== undefined &&
                            guest.age !== null &&
                            guest.age !== ""
                                ? escapeHTML(
                                    String(guest.age)
                                  ) + " Years"
                                : ""
                        }
                    </div>
            `;


            if (hasAnyIdProof) {


                let idProof = "";


                if (
                    hasValue(
                        guest.idProofName
                    )
                ) {

                    idProof =
                        guest.idProofName;

                }


                html += `

                    <div class="guest-cell id-proof-cell">

                        ${
                            hasValue(idProof)
                                ? escapeHTML(idProof)
                                : ""
                        }

                    </div>

                `;


                html += `

                    <div class="guest-cell id-proof-cell">

                        ${
                            hasValue(
                                guest.idNumber
                            )
                                ? escapeHTML(
                                    guest.idNumber
                                  )
                                : ""
                        }

                    </div>

                `;

            }


            html += `

                </div>

            `;

        }
    );


    container.innerHTML =
        html;


    section.style.display =
        "block";

}


/* =========================================================
   VEHICLE / DRIVER DETAILS
========================================================= */

function loadTransportationDetails(
    booking
) {

    const vehicle =
        booking.vehicle;

    const driver =
        booking.driver;

    const noOfDays =
        booking.noOfDays;


    let hasTransportation =
        false;


    if (
        hasValue(vehicle)
    ) {

        setText(
            "vehicle",
            vehicle
        );

        showElement(
            "vehicleRow"
        );

        hasTransportation = true;

    } else {

        hideElement(
            "vehicleRow"
        );

    }


    if (
        hasValue(driver)
    ) {

        setText(
            "driver",
            driver
        );

        showElement(
            "driverRow"
        );

        hasTransportation = true;

    } else {

        hideElement(
            "driverRow"
        );

    }


    if (
        hasValue(noOfDays)
    ) {

        setText(
            "noOfDays",
            noOfDays
        );

        showElement(
            "noOfDaysRow"
        );

        hasTransportation = true;

    } else {

        hideElement(
            "noOfDaysRow"
        );

    }


    const section =
        document.getElementById(
            "vehicleSection"
        );


    if (hasTransportation) {

        section.style.display =
            "block";

    } else {

        section.style.display =
            "none";

    }

}


/* =========================================================
   PAYMENT DETAILS
========================================================= */

function loadPaymentDetails(
    booking
) {

    const taxiFare =
        Number(
            booking.taxiFare
        ) || 0;


    const toll =
        Number(
            booking.toll
        ) || 0;


    const totalAmount =
        Number(
            booking.totalAmount
        ) || 0;


    const advanceReceived =
        Number(
            booking.advanceReceived
        ) || 0;


    const balanceAmount =
        Number(
            booking.balanceAmount
        ) || 0;


    /* =====================================================
       TAXI FARE
    ===================================================== */

    if (taxiFare > 0) {

        setText(
            "taxiFare",
            formatCurrency(taxiFare)
        );

        showElement(
            "taxiFareRow"
        );

    } else {

        hideElement(
            "taxiFareRow"
        );

    }


    /* =====================================================
       TOLL
       Only show when entered / greater than zero
    ===================================================== */

    if (toll > 0) {

        setText(
            "toll",
            formatCurrency(toll)
        );

        showElement(
            "tollRow"
        );

    } else {

        hideElement(
            "tollRow"
        );

    }


    /* =====================================================
       TOTAL
    ===================================================== */

    setText(
        "totalAmount",
        formatCurrency(totalAmount)
    );


    /* =====================================================
       ADVANCE
    ===================================================== */

    if (advanceReceived > 0) {

        setText(
            "advanceReceived",
            formatCurrency(
                advanceReceived
            )
        );

        showElement(
            "advanceRow"
        );

    } else {

        hideElement(
            "advanceRow"
        );

    }


    /* =====================================================
       PAYMENT MODE
    ===================================================== */

    if (
        hasValue(
            booking.paymentMode
        )
    ) {

        setText(
            "paymentMode",
            booking.paymentMode
        );

        showElement(
            "paymentModeRow"
        );

    } else {

        hideElement(
            "paymentModeRow"
        );

    }


    /* =====================================================
       BALANCE
    ===================================================== */

    setText(
        "balanceAmount",
        formatCurrency(
            balanceAmount
        )
    );

}


/* =========================================================
   BOOKING STATUS
========================================================= */

function loadBookingStatus(
    status
) {

    const statusElement =
        document.getElementById(
            "bookingStatus"
        );


    const value =
        hasValue(status)
            ? status
            : "Pending";


    statusElement.textContent =
        value;


    statusElement.className =
        "booking-status";


    switch (value) {

        case "Confirmed":

            statusElement.classList.add(
                "status-confirmed"
            );

            break;


        case "Cancelled":

            statusElement.classList.add(
                "status-cancelled"
            );

            break;


        case "Postponed":

            statusElement.classList.add(
                "status-postponed"
            );

            break;


        case "Completed":

            statusElement.classList.add(
                "status-completed"
            );

            break;


        default:

            statusElement.classList.add(
                "status-pending"
            );

            break;

    }

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        element.textContent =
            "";

        return;

    }


    element.textContent =
        value;

}


/* =========================================================
   SHOW ELEMENT
========================================================= */

function showElement(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.style.display =
            "";

    }

}


/* =========================================================
   HIDE ELEMENT
========================================================= */

function hideElement(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.style.display =
            "none";

    }

}


/* =========================================================
   CHECK VALUE
========================================================= */

function hasValue(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return false;

    }


    return String(value)
        .trim()
        .length > 0;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    dateString
) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
    timeString
) {

    if (!timeString) {

        return "-";

    }


    const value =
        String(
            timeString
        ).trim();


    /*
       Already entered as:
       10:30 AM
    */

    if (
        /[AP]M$/i.test(value)
    ) {

        return value.toUpperCase();

    }


    /*
       Convert old 24-hour values
       such as 14:30
    */

    const parts =
        value.split(":");


    if (
        parts.length < 2
    ) {

        return value;

    }


    let hours =
        parseInt(
            parts[0],
            10
        );


    const minutes =
        parts[1];


    if (
        isNaN(hours)
    ) {

        return value;

    }


    const ampm =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    return (
        String(hours)
            .padStart(2, "0") +
        ":" +
        minutes +
        " " +
        ampm
    );

}


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(
    amount
) {

    return (
        "₹" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-IN"
        )
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   PRINT VOUCHER
========================================================= */

function downloadVoucher() {

    const voucher =
        document.querySelector(".voucher-container");

    if (!voucher) {
        alert("Voucher not found.");
        return;
    }

    const bookingId =
        document.getElementById("bookingId")
            ?.textContent
            .trim() || "Taxi_Booking";

    const options = {

        margin: 0,

        filename:
            "Taxi_Confirmation_Voucher_" +
            bookingId +
            ".pdf",

        image: {
            type: "jpeg",
            quality: 0.98
        },

        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }

    };

    html2pdf()
        .set(options)
        .from(voucher)
        .save();

}

}
