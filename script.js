/* =========================================
   EMAILJS CONFIGURATION
========================================= */


const PUBLIC_KEY = "-sC-hpJdVfTXZ5lWj";

const SERVICE_ID = "service_pk8m05i";

const TEMPLATE_ID = "template_vyjhik9";


emailjs.init({
    publicKey: PUBLIC_KEY
});


/* =========================================
   CART
========================================= */

let cart = [];


/* =========================================
   ADD TO CART
========================================= */

function addToCart(name, price) {

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    alert(`${name} added to cart 🛒`);
}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const cartCount =
        document.getElementById("cart-count");

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");


    const totalQuantity = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    cartCount.textContent = totalQuantity;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "Rs. 0";

        return;
    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        cartItems.innerHTML += `

            <div class="cart-item">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <br>

                    <small>
                        Rs. ${item.price.toLocaleString()}
                        × ${item.quantity}
                    </small>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        `;

    });


    cartTotal.textContent =
        `Rs. ${total.toLocaleString()}`;
}


/* =========================================
   REMOVE FROM CART
========================================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    document
        .getElementById("cart-overlay")
        .classList.add("active");

}


/* =========================================
   CLOSE CART
========================================= */

function closeCart() {

    document
        .getElementById("cart-overlay")
        .classList.remove("active");

}


/* =========================================
   OPEN CHECKOUT
========================================= */

function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty! 🛒");

        return;
    }


    closeCart();

    displayCheckoutItems();


    document
        .getElementById("checkout-overlay")
        .classList.add("active");
}


/* =========================================
   CLOSE CHECKOUT
========================================= */

function closeCheckout() {

    document
        .getElementById("checkout-overlay")
        .classList.remove("active");

}


/* =========================================
   DISPLAY CHECKOUT ITEMS
========================================= */

function displayCheckoutItems() {

    const container =
        document.getElementById("checkout-items");

    const totalElement =
        document.getElementById("checkout-total");


    container.innerHTML = "";


    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        container.innerHTML += `

            <div class="summary-item">

                <span>
                    ${item.name}
                    × ${item.quantity}
                </span>

                <strong>
                    Rs. ${itemTotal.toLocaleString()}
                </strong>

            </div>

        `;

    });


    totalElement.textContent =
        `Rs. ${total.toLocaleString()}`;
}


/* =========================================
   GENERATE ORDER ID
========================================= */

function generateOrderId() {

    const randomNumber =
        Math.floor(
            100000 + Math.random() * 900000
        );

    return `SOLE-${randomNumber}`;
}


/* =========================================
   PLACE ORDER
========================================= */

function placeOrder() {

    /* -----------------------------
       CUSTOMER INFORMATION
    ----------------------------- */

    const name =
        document
            .getElementById("customer-name")
            .value
            .trim();

    const email =
        document
            .getElementById("customer-email")
            .value
            .trim();

    const phone =
        document
            .getElementById("customer-phone")
            .value
            .trim();


    /* -----------------------------
       ADDRESS
    ----------------------------- */

    const address =
        document
            .getElementById("address")
            .value
            .trim();

    const city =
        document
            .getElementById("city")
            .value
            .trim();

    const postalCode =
        document
            .getElementById("postal-code")
            .value
            .trim();


    /* -----------------------------
       DEMO CARD
    ----------------------------- */

    const cardName =
        document
            .getElementById("card-name")
            .value
            .trim();

    const cardNumber =
        document
            .getElementById("card-number")
            .value
            .trim();

    const expiry =
        document
            .getElementById("expiry")
            .value
            .trim();

    const cvv =
        document
            .getElementById("cvv")
            .value
            .trim();


    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !postalCode ||
        !cardName ||
        !cardNumber ||
        !expiry ||
        !cvv
    ) {

        alert(
            "Please complete all checkout fields."
        );

        return;
    }


    /* -----------------------------
       EMAIL VALIDATION
    ----------------------------- */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        alert(
            "Please enter a valid email address."
        );

        return;
    }


    /* -----------------------------
       ORDER DETAILS
    ----------------------------- */

    const orderId =
        generateOrderId();


    let total = 0;


    const orderItems =
        cart.map(item => {

            const itemTotal =
                item.price * item.quantity;

            total += itemTotal;


            return `
                ${item.name}
                × ${item.quantity}
                = Rs. ${itemTotal.toLocaleString()}
            `;

        }).join("\n");


    /* -----------------------------
       EMAILJS DATA
    ----------------------------- */

    const templateParams = {

        customer_name: name,

        customer_email: email,

        phone: phone,

        address: address,

        city: city,

        postal_code: postalCode,

        order_id: orderId,

        order_items: orderItems,

        total_amount:
            `Rs. ${total.toLocaleString()}`

    };


    /* -----------------------------
       SEND EMAIL
    ----------------------------- */

    emailjs
        .send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams
        )

        .then(() => {

            console.log(
                "Confirmation email sent!"
            );


            showSuccess(orderId);

        })

        .catch(error => {

            console.error(
                "EmailJS Error:",
                error
            );


            alert(
                "Order created, but confirmation email could not be sent."
            );

        });

}


/* =========================================
   SUCCESS MESSAGE
========================================= */

function showSuccess(orderId) {

    closeCheckout();


    document.getElementById(
        "order-number"
    ).textContent =
        `Order ID: ${orderId}`;


    document
        .getElementById("success-overlay")
        .classList.add("active");


    cart = [];

    updateCart();
}