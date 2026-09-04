/* =========================================================
   TAXI BOOKING MANAGEMENT SYSTEM
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let bookings = [];

let selectedBookingId = null;


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadBookings();

    setDefaultDates();

    generateBookingId();

    generateCustomerId();

    calculateAmounts();

    updateDashboard();

    displayCurrentDate();

    addGuestInputListeners();

    updateGuestCounts();

    document.getElementById("footerYear").textContent =
        new Date().getFullYear();


    /* =====================================================
       AUTOMATIC PAYMENT CALCULATION
    ===================================================== */

    [
        "minimumCharge",
        "extraKm",
        "extraKmRate",
        "totalHours",
        "extraHours",
        "extraHoursRate",
        "toll",
        "advanceReceived"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "input",
                calculateAmounts
            );

        }

    });

});
/* =========================================================
   LOAD BOOKINGS FROM FIRESTORE
========================================================= */

function loadBookings() {

    if (!window.firebaseTaxi) {

        console.error(
            "Firebase is not ready."
        );

        return;
    }


    const collectionRef =
        window.firebaseTaxi.collection;


    /*
       Real-time listener.

       Whenever any staff member adds,
       updates or deletes a booking,
       all computers receive the change.
    */

    window.firebaseTaxi.onSnapshot(
        collectionRef,

        function (snapshot) {

            bookings = [];


            snapshot.forEach(
                function (docSnapshot) {

                    bookings.push({
                        ...docSnapshot.data()
                    });

                }
            );


            console.log(
                "Bookings loaded from Firebase:",
                bookings
            );


            displayBookings();

            updateDashboard();

        },

        function (error) {

            console.error(
                "Firebase loading error:",
                error
            );


            alert(
                "Unable to load bookings from Firebase.\n\n" +
                error.message
            );

        }
    );

}/* =========================================================
   DEFAULT DATES
========================================================= */

function setDefaultDates() {

    const today = new Date();

    const formattedDate =
        today.toISOString().split("T")[0];


    document.getElementById("bookingDate").value =
        formattedDate;


    document.getElementById("pickupDate").value =
        formattedDate;

}


/* =========================================================
   CURRENT DATE
========================================================= */

function displayCurrentDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("currentDate").textContent =
        today.toLocaleDateString(
            "en-IN",
            options
        );

}


/* =========================================================
   GENERATE BOOKING ID
========================================================= */

function generateBookingId() {

    const year =
        new Date().getFullYear().toString().slice(-2);

    let maxNumber = 0;

    bookings.forEach(function (booking) {

        if (!booking.bookingId) {
            return;
        }

        const match =
            booking.bookingId.match(
                /TX\d{2}(\d+)/
            );

        if (match) {

            const number =
                parseInt(match[1], 10);

            if (number > maxNumber) {
                maxNumber = number;
            }

        }

    });


    const nextNumber =
        String(maxNumber + 1).padStart(4, "0");


    document.getElementById("bookingId").value =
        "TX" + year + nextNumber;

}


/* =========================================================
   GENERATE CUSTOMER ID
========================================================= */

function generateCustomerId() {

    let maxNumber = 0;

    bookings.forEach(function (booking) {

        if (!booking.customerId) {
            return;
        }

        const match =
            booking.customerId.match(
                /CUS(\d+)/
            );

        if (match) {

            const number =
                parseInt(match[1], 10);

            if (number > maxNumber) {
                maxNumber = number;
            }

        }

    });


    const nextNumber =
        String(maxNumber + 1).padStart(4, "0");


    document.getElementById("customerId").value =
        "CUS" + nextNumber;

}


/* =========================================================
   CALCULATE TOTAL + BALANCE
========================================================= */

/* =========================================================
   CALCULATE TAXI AMOUNT + TOTAL + BALANCE
========================================================= */

function calculateAmounts() {

    const minimumCharge =
        Number(document.getElementById("minimumCharge")?.value) || 0;

    const extraKm =
        Number(document.getElementById("extraKm")?.value) || 0;

    const extraKmRate =
        Number(document.getElementById("extraKmRate")?.value) || 0;

    const extraHours =
        Number(document.getElementById("extraHours")?.value) || 0;

    const extraHoursRate =
        Number(document.getElementById("extraHoursRate")?.value) || 0;

    /* Extra KM amount */
    const extraKmAmount =
        extraKm * extraKmRate;

    /* Extra Hours amount */
    const extraHoursAmount =
        extraHours * extraHoursRate;

    /* Taxi Amount */
    const taxiAmount =
        minimumCharge +
        extraKmAmount +
        extraHoursAmount;

    /* Toll */
    const toll =
        Number(document.getElementById("toll")?.value) || 0;

    /* Total Amount */
    const totalAmount =
        taxiAmount + toll;

    /* Advance */
    const advanceReceived =
        Number(document.getElementById("advanceReceived")?.value) || 0;

    /* Balance */
    const balanceAmount =
        Math.max(totalAmount - advanceReceived, 0);

    /* Display */
    document.getElementById("taxiFare").value =
        taxiAmount;

    document.getElementById("totalAmount").value =
        totalAmount;

    document.getElementById("balanceAmount").value =
        balanceAmount;
}
   /* =========================================================
   GUEST DETAILS
========================================================= */

function addGuest() {

    const guestList =
        document.getElementById("guestList");

    const guestRow =
        document.createElement("div");

    guestRow.className = "guest-row";

    guestRow.innerHTML = `
        <input
            type="text"
            class="guest-name"
            placeholder="Guest Name">

        <input
            type="number"
            class="guest-age"
            placeholder="Age"
            min="0"
            max="120">

        <input
            type="text"
            class="guest-id-proof"
            placeholder="ID Proof Name">

        <input
            type="text"
            class="guest-id-number"
            placeholder="ID Number">

        <button
            type="button"
            class="remove-guest-btn"
            onclick="removeGuest(this)">
            ✕
        </button>
    `;

    guestList.appendChild(guestRow);

    addGuestInputListeners();

    updateGuestCounts();
}/* =========================================================
   REMOVE GUEST
========================================================= */

function removeGuest(button) {

    const guestList =
        document.getElementById("guestList");

    const rows =
        guestList.querySelectorAll(".guest-row");

    if (rows.length === 1) {

        rows[0].querySelector(".guest-name").value = "";
        rows[0].querySelector(".guest-age").value = "";

    } else {

        button.parentElement.remove();

    }

    updateGuestCounts();
}


/* =========================================================
   UPDATE GUEST COUNTS
========================================================= */

/* =========================================================
   UPDATE GUEST COUNTS
   CUSTOMER IS ALSO INCLUDED AS 1 ADULT
========================================================= */

function updateGuestCounts() {

    const rows =
        document.querySelectorAll(".guest-row");

    /*
       Customer is automatically counted
       as 1 adult.
    */

    let totalMembers = 1;
    let adults = 1;
    let children = 0;


    rows.forEach(function (row) {

        const name =
            row.querySelector(".guest-name")
                .value
                .trim();

        const ageValue =
            row.querySelector(".guest-age")
                .value;


        /*
           Count only guests where
           both name and age are entered.
        */

        if (
            name !== "" &&
            ageValue !== ""
        ) {

            const age =
                Number(ageValue);


            totalMembers++;


            if (age >= 18) {

                adults++;

            } else {

                children++;

            }

        }

    });


    document.getElementById("totalMembers").value =
        totalMembers;

    document.getElementById("adultCount").value =
        adults;

    document.getElementById("childCount").value =
        children;

}/* =========================================================
   GUEST INPUT LISTENERS
========================================================= */

function addGuestInputListeners() {

    document
        .querySelectorAll(".guest-name, .guest-age")
        .forEach(function (input) {

            input.removeEventListener(
                "input",
                updateGuestCounts
            );

            input.addEventListener(
                "input",
                updateGuestCounts
            );

        });

}
/* =========================================================
   GET FORM DATA
========================================================= */

function getFormData() {

    /* Make sure all amounts are calculated before saving */
    calculateAmounts();


    /* =====================================================
       GUEST COUNTS
    ===================================================== */

    const adults =
        Number(
            document.getElementById("adultCount").value
        ) || 0;

    const children =
        Number(
            document.getElementById("childCount").value
        ) || 0;

    const totalMembers =
        Number(
            document.getElementById("totalMembers").value
        ) || 0;


    /* =====================================================
       COLLECT GUEST DETAILS
    ===================================================== */

    const guestDetails = [];

    document.querySelectorAll(".guest-row")
        .forEach(function (row) {

            const name =
                row.querySelector(".guest-name")
                    ?.value
                    .trim() || "";

            const age =
                row.querySelector(".guest-age")
                    ?.value || "";

            const idProofName =
                row.querySelector(".guest-id-proof")
                    ?.value
                    .trim() || "";

            const idNumber =
                row.querySelector(".guest-id-number")
                    ?.value
                    .trim() || "";

            if (name !== "" && age !== "") {

                guestDetails.push({

                    name: name,

                    age: Number(age),

                    idProofName: idProofName,

                    idNumber: idNumber

                });

            }

        });


    /* =====================================================
       RETURN COMPLETE BOOKING DATA
    ===================================================== */

    return {

        /* =================================================
           BASIC DETAILS
        ================================================= */

        bookingId:
            document.getElementById("bookingId").value.trim(),

        customerId:
            document.getElementById("customerId").value.trim(),

        bookingDate:
            document.getElementById("bookingDate").value,

        customerName:
            document.getElementById("customerName").value.trim(),

        mobile:
            document.getElementById("mobile").value.trim(),

        address:
            document.getElementById("address").value.trim(),


        /* =================================================
           GUEST DETAILS
        ================================================= */

        totalMembers:
            totalMembers,

        adults:
            adults,

        children:
            children,

        guestDetails:
            guestDetails,


        /* =================================================
           TRIP DETAILS
        ================================================= */

        pickupDate:
            document.getElementById("pickupDate").value,

        pickupTime:
            document.getElementById("pickupTime").value.trim(),

        dropDate:
            document.getElementById("dropDate").value,

        dropTime:
            document.getElementById("dropTime").value.trim(),

        pickupLocation:
            document.getElementById("pickupLocation").value.trim(),

        dropLocation:
            document.getElementById("dropLocation").value.trim(),

        tripType:
            document.getElementById("tripType").value,

        package:
            document.getElementById("package").value.trim(),

        itinerary:
            document.getElementById("itinerary").value.trim(),


        /* =================================================
           TRIP SUMMARY
        ================================================= */

        minimumCharge:
            Number(
                document.getElementById("minimumCharge").value
            ) || 0,

        totalKmHrs:
            document.getElementById("totalKmHrs").value.trim(),

        extraKm:
            Number(
                document.getElementById("extraKm").value
            ) || 0,

        extraKmRate:
            Number(
                document.getElementById("extraKmRate").value
            ) || 0,

        totalHours:
            Number(
                document.getElementById("totalHours").value
            ) || 0,

        extraHours:
            Number(
                document.getElementById("extraHours").value
            ) || 0,

        extraHoursRate:
            Number(
                document.getElementById("extraHoursRate").value
            ) || 0,


        /* =================================================
           PAYMENT DETAILS
        ================================================= */

        taxiFare:
            Number(
                document.getElementById("taxiFare").value
            ) || 0,

        toll:
            Number(
                document.getElementById("toll").value
            ) || 0,

        totalAmount:
            Number(
                document.getElementById("totalAmount").value
            ) || 0,

        advanceReceived:
            Number(
                document.getElementById("advanceReceived").value
            ) || 0,

        paymentMode:
            document.getElementById("paymentMode").value,

        balanceAmount:
            Number(
                document.getElementById("balanceAmount").value
            ) || 0,

        balanceMode:
            document.getElementById("balanceMode").value,


        /* =================================================
           STATUS
        ================================================= */

        bookingStatus:
            document.getElementById("bookingStatus").value,

        bookingNotes:
            document.getElementById("bookingNotes").value.trim(),


        /* =================================================
           CREATED / UPDATED
        ================================================= */

        createdAt:
            new Date().toISOString()

    };

}/* =========================================================
   VALIDATE BOOKING
========================================================= */

function validateBooking(booking) {

    if (!booking.customerName) {

        alert("Please enter customer name.");

        document.getElementById(
            "customerName"
        ).focus();

        return false;
    }


    if (!booking.mobile) {

        alert("Please enter mobile / WhatsApp number.");

        document.getElementById(
            "mobile"
        ).focus();

        return false;
    }


    if (!booking.pickupDate) {

        alert("Please select pickup date.");

        return false;
    }


    if (!booking.pickupTime) {

        alert("Please select pickup time.");

        return false;
    }
if (!booking.dropDate) {

    alert("Please enter drop date.");

    document.getElementById(
        "dropDate"
    ).focus();

    return false;
}


if (!booking.dropTime) {

    alert("Please enter drop time.");

    document.getElementById(
        "dropTime"
    ).focus();

    return false;
}

    if (!booking.pickupLocation) {

        alert("Please enter pickup location.");

        return false;
    }


    if (!booking.dropLocation) {

        alert("Please enter drop location.");

        return false;
    }


    return true;

}


/* =========================================================
   SAVE BOOKING
========================================================= */

function saveBooking() {

    const booking = getFormData();


    if (!validateBooking(booking)) {
        return;
    }


    const duplicate =
        bookings.find(function (item) {

            return item.bookingId ===
                booking.bookingId;

        });


    if (duplicate) {

        alert(
            "This Booking ID already exists."
        );

        generateBookingId();

        return;
    }


    bookings.push(booking);

    saveToStorage();

    alert(
        "Booking saved successfully!\n\n" +
        "Booking ID: " +
        booking.bookingId
    );


    displayBookings();

    updateDashboard();

    clearForm();

}


/* =========================================================
   UPDATE BOOKING
========================================================= */

function updateBooking() {

    if (!selectedBookingId) {

        alert(
            "Please select a booking from the list first."
        );

        return;
    }


    const updatedBooking =
        getFormData();


    if (!validateBooking(updatedBooking)) {
        return;
    }


    const index =
        bookings.findIndex(function (booking) {

            return booking.bookingId ===
                selectedBookingId;

        });


    if (index === -1) {

        alert("Booking not found.");

        return;
    }


    updatedBooking.updatedAt =
        new Date().toISOString();


    bookings[index] =
        updatedBooking;


    saveToStorage();

    alert(
        "Booking updated successfully."
    );


    displayBookings();

    updateDashboard();

    selectedBookingId = null;

}


/* =========================================================
   DELETE BOOKING
========================================================= */

function deleteBooking() {

    if (!selectedBookingId) {

        alert(
            "Please select a booking from the list first."
        );

        return;
    }


    const booking =
        bookings.find(function (item) {

            return item.bookingId ===
                selectedBookingId;

        });


    if (!booking) {

        alert("Booking not found.");

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to delete booking " +
            booking.bookingId +
            "?"
        );


    if (!confirmation) {
        return;
    }


    bookings =
        bookings.filter(function (item) {

            return item.bookingId !==
                selectedBookingId;

        });


    saveToStorage();

    alert(
        "Booking deleted successfully."
    );


    selectedBookingId = null;

    displayBookings();

    updateDashboard();

    clearForm();

}


/* =========================================================
   CLEAR FORM
========================================================= */

function clearForm() {

    document.getElementById(
        "customerName"
    ).value = "";


    document.getElementById(
        "mobile"
    ).value = "";

    document.getElementById("address").value = "";

document.getElementById("totalMembers").value = "1";
document.getElementById("adultCount").value = "1";
document.getElementById("childCount").value = "0";

    document.getElementById(
        "pickupLocation"
    ).value = "";


    document.getElementById(
        "dropLocation"
    ).value = "";


    document.getElementById(
        "pickupTime"
    ).value = "";
   document.getElementById(
    "dropDate"
).value = "";

document.getElementById(
    "dropTime"
).value = "";

    document.getElementById(
        "tripType"
    ).value = "";


    document.getElementById(
        "package"
    ).value = "";


    document.getElementById(
        "itinerary"
    ).value = "";


    document.getElementById(
        "totalKmHrs"
    ).value = "";


    /* Taxi Fare blank */

    document.getElementById(
        "taxiFare"
    ).value = "";


    /* Toll blank */

    document.getElementById(
        "toll"
    ).value = "";


    document.getElementById(
        "advanceReceived"
    ).value = "0";


    document.getElementById(
        "paymentMode"
    ).value = "";


    document.getElementById(
        "bookingStatus"
    ).value = "Pending";


    document.getElementById(
        "bookingNotes"
    ).value = "";


    setDefaultDates();
   /* Clear guest details */

const guestList =
    document.getElementById("guestList");

guestList.innerHTML = `
    <div class="guest-row">

        <input
            type="text"
            class="guest-name"
            placeholder="Guest Name">

        <input
            type="number"
            class="guest-age"
            placeholder="Age"
            min="0"
            max="120">

        <input
            type="text"
            class="guest-id-proof"
            placeholder="ID Proof Name">

        <input
            type="text"
            class="guest-id-number"
            placeholder="ID Number">

        <button
            type="button"
            class="remove-guest-btn"
            onclick="removeGuest(this)">
            ✕
        </button>

    </div>
`;

addGuestInputListeners();
updateGuestCounts();

    generateBookingId();

    generateCustomerId();

    calculateAmounts();

    selectedBookingId = null;

}/* =========================================================
   DISPLAY BOOKINGS
========================================================= */

function displayBookings(
    list = bookings
) {

    const tbody =
        document.getElementById(
            "bookingTableBody"
        );


    tbody.innerHTML = "";


    /* Sort by pickup date */

    const sortedBookings =
        [...list].sort(function (a, b) {

            const dateA =
                new Date(
                    (a.pickupDate || "") +
                    "T" +
                    (a.pickupTime || "00:00")
                );

            const dateB =
                new Date(
                    (b.pickupDate || "") +
                    "T" +
                    (b.pickupTime || "00:00")
                );

            return dateA - dateB;

        });


    if (sortedBookings.length === 0) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td colspan="15"
                style="
                    text-align:center;
                    padding:30px;
                    color:#6b7280;
                ">
                No taxi bookings found.
            </td>
        `;


        tbody.appendChild(row);

        return;
    }


    sortedBookings.forEach(function (booking) {

        const row =
            document.createElement("tr");


        if (
            booking.bookingId ===
            selectedBookingId
        ) {

            row.classList.add("selected");

        }


        const totalPax =
            Number(booking.adults || 0) +
            Number(booking.children || 0);


        const statusClass =
            getStatusClass(
                booking.bookingStatus
            );


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(booking.bookingId)}
                </strong>
            </td>

            <td>
                ${formatDate(booking.bookingDate)}
            </td>

            <td>
                ${escapeHTML(booking.customerName)}
            </td>

            <td>
                ${escapeHTML(booking.mobile)}
            </td>

            <td>
    ${formatDate(booking.pickupDate)}
</td>

<td>
    ${formatTime(booking.pickupTime)}
</td>

<td>
    ${formatDate(booking.dropDate)}
</td>

<td>
    ${formatTime(booking.dropTime)}
</td>

<td>
    ${escapeHTML(booking.pickupLocation)}
</td>
            <td>
                ${escapeHTML(booking.dropLocation)}
            </td>

           <td>
    ${totalPax}
</td>
            <td>
                ₹${formatNumber(booking.totalAmount)}
            </td>

            <td>
                ₹${formatNumber(booking.advanceReceived)}
            </td>

            <td>
                ₹${formatNumber(booking.balanceAmount)}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${escapeHTML(booking.bookingStatus)}
                </span>
            </td>

        `;


        row.addEventListener(
            "click",
            function () {

                selectBooking(
                    booking.bookingId
                );

            }
        );


        tbody.appendChild(row);

    });

}


function selectBooking(bookingId) {

    const booking =
        bookings.find(function (item) {
            return item.bookingId === bookingId;
        });

    if (!booking) {
        return;
    }

    selectedBookingId = booking.bookingId;


    /* =====================================================
       BASIC DETAILS
    ===================================================== */

    document.getElementById("bookingId").value =
        booking.bookingId || "";

    document.getElementById("customerId").value =
        booking.customerId || "";

    document.getElementById("bookingDate").value =
        booking.bookingDate || "";

    document.getElementById("customerName").value =
        booking.customerName || "";

    document.getElementById("mobile").value =
        booking.mobile || "";

    document.getElementById("address").value =
        booking.address || "";


    /* =====================================================
       GUEST COUNTS
    ===================================================== */

    document.getElementById("totalMembers").value =
        booking.totalMembers ?? 1;

    document.getElementById("adultCount").value =
        booking.adults ?? 1;

    document.getElementById("childCount").value =
        booking.children ?? 0;


    /* =====================================================
       GUEST DETAILS
    ===================================================== */

    const guestList =
        document.getElementById("guestList");

    guestList.innerHTML = "";


    if (
        booking.guestDetails &&
        booking.guestDetails.length > 0
    ) {

        booking.guestDetails.forEach(function (guest) {

            const guestRow =
                document.createElement("div");

            guestRow.className = "guest-row";

            guestRow.innerHTML = `

                <input
                    type="text"
                    class="guest-name"
                    placeholder="Guest Name"
                    value="${escapeHTML(guest.name || "")}">

                <input
                    type="number"
                    class="guest-age"
                    placeholder="Age"
                    min="0"
                    max="120"
                    value="${guest.age ?? ""}">

                <input
                    type="text"
                    class="guest-id-proof"
                    placeholder="ID Proof Name"
                    value="${escapeHTML(guest.idProofName || "")}">

                <input
                    type="text"
                    class="guest-id-number"
                    placeholder="ID Number"
                    value="${escapeHTML(guest.idNumber || "")}">

                <button
                    type="button"
                    class="remove-guest-btn"
                    onclick="removeGuest(this)">
                    ✕
                </button>

            `;

            guestList.appendChild(guestRow);

        });

    } else {

        /* Show one empty guest row */

        guestList.innerHTML = `

            <div class="guest-row">

                <input
                    type="text"
                    class="guest-name"
                    placeholder="Guest Name">

                <input
                    type="number"
                    class="guest-age"
                    placeholder="Age"
                    min="0"
                    max="120">

                <input
                    type="text"
                    class="guest-id-proof"
                    placeholder="ID Proof Name">

                <input
                    type="text"
                    class="guest-id-number"
                    placeholder="ID Number">

                <button
                    type="button"
                    class="remove-guest-btn"
                    onclick="removeGuest(this)">
                    ✕
                </button>

            </div>
        `;
    }

    addGuestInputListeners();


    /* =====================================================
       TRIP DETAILS
    ===================================================== */

    document.getElementById("pickupDate").value =
        booking.pickupDate || "";

    document.getElementById("pickupTime").value =
        booking.pickupTime || "";

    document.getElementById("dropDate").value =
        booking.dropDate || "";

    document.getElementById("dropTime").value =
        booking.dropTime || "";

    document.getElementById("pickupLocation").value =
        booking.pickupLocation || "";

    document.getElementById("dropLocation").value =
        booking.dropLocation || "";

    document.getElementById("tripType").value =
        booking.tripType || "";

    document.getElementById("package").value =
        booking.package || "";

    document.getElementById("itinerary").value =
        booking.itinerary || "";

    /* =====================================================
   TRIP SUMMARY
===================================================== */

document.getElementById("totalKmHrs").value =
    booking.totalKmHrs || "";

document.getElementById("minimumCharge").value =
    booking.minimumCharge ?? "";

document.getElementById("extraKm").value =
    booking.extraKm ?? "";

document.getElementById("extraKmRate").value =
    booking.extraKmRate ?? "";

document.getElementById("totalHours").value =
    booking.totalHours ?? "";

document.getElementById("extraHours").value =
    booking.extraHours ?? "";

document.getElementById("extraHoursRate").value =
    booking.extraHoursRate ?? "";


/* =====================================================
   PAYMENT DETAILS
===================================================== */

document.getElementById("taxiFare").value =
    booking.taxiFare ?? 0;

document.getElementById("toll").value =
    booking.toll ?? 0;

document.getElementById("totalAmount").value =
    booking.totalAmount ?? 0;

document.getElementById("advanceReceived").value =
    booking.advanceReceived ?? 0;

document.getElementById("paymentMode").value =
    booking.paymentMode || "";

document.getElementById("balanceAmount").value =
    booking.balanceAmount ?? 0;

document.getElementById("balanceMode").value =
    booking.balanceMode || "";
    /* =====================================================
       BOOKING STATUS
    ===================================================== */

    document.getElementById("bookingStatus").value =
        booking.bookingStatus || "Pending";

    document.getElementById("bookingNotes").value =
        booking.bookingNotes || "";


    /* =====================================================
       UPDATE DISPLAY
    ===================================================== */

    updateGuestCounts();

    calculateAmounts();

    displayBookings();

}/* =========================================================
   SEARCH BOOKINGS
========================================================= */

function searchBookings() {

    const search =
        document.getElementById(
            "searchInput"
        ).value
        .trim()
        .toLowerCase();


    if (!search) {

        displayBookings();

        return;
    }


    const filtered =
        bookings.filter(function (booking) {

            const searchableText = [

                booking.bookingId,

                booking.customerId,

                booking.customerName,

                booking.mobile,

                booking.email,

                booking.pickupLocation,

                booking.dropLocation,

                booking.vehicle,

                booking.driver,

                booking.tripType,

                booking.bookingStatus

            ]
            .join(" ")
            .toLowerCase();


            return searchableText.includes(search);

        });


    displayBookings(filtered);

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);


    const todayBookings = bookings.filter(function (booking) {

        if (!booking.pickupDate) {
            return false;
        }

        const pickupDate =
            new Date(booking.pickupDate + "T00:00:00");

        pickupDate.setHours(0, 0, 0, 0);

        return pickupDate.getTime() === today.getTime();

    }).length;


    const tomorrowBookings = bookings.filter(function (booking) {

        if (!booking.pickupDate) {
            return false;
        }

        const pickupDate =
            new Date(booking.pickupDate + "T00:00:00");

        pickupDate.setHours(0, 0, 0, 0);

        return pickupDate.getTime() === tomorrow.getTime();

    }).length;


    const totalBookings =
        bookings.length;


    const postponedBookings =
        bookings.filter(function (booking) {

            return booking.bookingStatus === "Postponed";

        }).length;


    const confirmedBookings =
        bookings.filter(function (booking) {

            return booking.bookingStatus === "Confirmed";

        }).length;


    const cancelledBookings =
        bookings.filter(function (booking) {

            return booking.bookingStatus === "Cancelled";

        }).length;


    document.getElementById("todayBookings").textContent =
        todayBookings;


    document.getElementById("tomorrowBookings").textContent =
        tomorrowBookings;


    document.getElementById("totalBookings").textContent =
        totalBookings;


    document.getElementById("postponedBookings").textContent =
        postponedBookings;


    document.getElementById("confirmedBookings").textContent =
        confirmedBookings;


    document.getElementById("cancelledBookings").textContent =
        cancelledBookings;

}

/* =========================================================
   EXPORT CSV / EXCEL
========================================================= */

function exportBookings() {

    if (bookings.length === 0) {

        alert(
            "There are no bookings to export."
        );

        return;
    }


    const headers = [

        "Booking ID",
        "Customer ID",
        "Booking Date",
        "Customer Name",
        "Mobile",
        "Adults",
        "Children",
        "Pickup Date",
"Pickup Time",
"Drop Date",
"Drop Time",
"Pickup Location",
"Drop Location",
"Trip Type",
"Package",
       "Itinerary",
"Total KM / Hrs",
"Taxi Fare",
"Toll",
        "Total Amount",
        "Advance Received",
        "Payment Mode",
        "Balance Amount",
        "Status",
        "Special Instructions",
        "Booking Notes"

    ];


    const rows =
        bookings.map(function (booking) {

            return [

                booking.bookingId,
                booking.customerId,
                booking.bookingDate,
                booking.customerName,
                booking.mobile,
                booking.adults,
                booking.children,
                booking.pickupDate,
booking.pickupTime,
booking.dropDate,
booking.dropTime,
booking.pickupLocation,
booking.dropLocation,
booking.tripType,
booking.package,
booking.itinerary,
booking.totalKmHrs,
booking.taxiFare,
booking.toll,
booking.totalAmount,
booking.advanceReceived,
booking.paymentMode,
booking.balanceAmount,
booking.bookingStatus,
booking.bookingNotes

            ];

        });


    const csv =
        [
            headers,
            ...rows
        ]
        .map(function (row) {

            return row
                .map(csvEscape)
                .join(",");

        })
        .join("\n");


    const blob =
        new Blob(
            ["\ufeff" + csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "Taxi_Bookings_" +
        new Date()
            .toISOString()
            .split("T")[0] +
        ".csv";


    link.click();


    URL.revokeObjectURL(url);

}


/* =========================================================
   CSV ESCAPE
========================================================= */

function csvEscape(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    const text =
        String(value);


    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n")
    ) {

        return '"' +
            text.replace(
                /"/g,
                '""'
            ) +
            '"';

    }


    return text;

}


/* =========================================================
   OPEN VOUCHER
========================================================= */

function openVoucher() {

    if (!selectedBookingId) {

        alert(
            "Please select a booking first."
        );

        return;
    }


    const booking =
        bookings.find(function (item) {

            return item.bookingId ===
                selectedBookingId;

        });


    if (!booking) {

        alert("Booking not found.");

        return;
    }


    localStorage.setItem(
        "selectedTaxiBooking",
        JSON.stringify(booking)
    );
localStorage.setItem(
    "selectedTaxiBookingId",
    booking.bookingId
);

    /*
       taxiVoucher.html will be created
       in the next stage.
    */

    window.open(
        "taxiVoucher.html",
        "_blank"
    );

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status) {

    switch (status) {

        case "Confirmed":
            return "status-confirmed";

        case "Pending":
            return "status-pending";

        case "Completed":
            return "status-completed";

        case "Cancelled":
            return "status-cancelled";

        case "Postponed":
            return "status-postponed";

        default:
            return "status-pending";

    }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (isNaN(date.getTime())) {
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
function formatTime(timeString) {

    if (!timeString) {
        return "-";
    }

    const value = String(timeString).trim();

    // If already entered as 12-hour format
    if (/[AP]M$/i.test(value)) {
        return value.toUpperCase();
    }

    // Support old saved 24-hour values such as 14:30
    const parts = value.split(":");

    if (parts.length < 2) {
        return value;
    }

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) {
        return value;
    }

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        minutes +
        " " +
        ampm
    );
}/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(number) {

    return Number(
        number || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
