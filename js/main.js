(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Countdown Timer
    function countDownTimer() {
        var endTime = new Date("31 December 2045 10:00:00 GMT+00:00");
        endTime = (Date.parse(endTime) / 1000);

        var now = new Date();
        now = (Date.parse(now) / 1000);

        var timeLeft = endTime - now;

        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
        var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
        var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

        if (days < "10") {
            days = "0" + days;
        }
        if (hours < "10") {
            hours = "0" + hours;
        }
        if (minutes < "10") {
            minutes = "0" + minutes;
        }
        if (seconds < "10") {
            seconds = "0" + seconds;
        }

        $("#cdt-days").html(days + "<span>-Days-</span>");
        $("#cdt-hours").html(hours + "<span>-Hours-</span>");
        $("#cdt-minutes").html(minutes + "<span>-Mins-</span>");
        $("#cdt-seconds").html(seconds + "<span>-Secs-</span>");

    }

    setInterval(function () {
        countDownTimer();
    }, 1000);


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    // Cart Logic
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let count = cart.reduce((total, item) => total + item.quantity, 0);
        $('.cart-badge').text(count);
    }
    updateCartCount();

    $('a.btn').on('click', function (e) {
        if ($(this).text().trim().toLowerCase() === 'add to cart' || $(this).text().trim().toLowerCase() === 'shop now') {
            e.preventDefault();
            let title = "", price = 0, img = "";
            let productItem = $(this).closest('.product-item');

            if (productItem.length) {
                title = productItem.find('.h6').text().trim();
                let priceText = productItem.find('h5.text-primary').text().trim();
                price = parseFloat(priceText.replace('$', ''));
                img = productItem.find('img').attr('src');
            } else {
                let dealItem = $(this).closest('.deal');
                if (dealItem.length) {
                    title = dealItem.find('h5').text().trim();
                    if (!title) {
                        title = dealItem.find('h2').text().trim();
                    }
                    let priceText = dealItem.find('h1.text-primary').text().trim();
                    price = parseFloat(priceText.replace('$', ''));
                    img = dealItem.find('img').attr('src');
                } else {
                    let aboutItem = $(this).closest('.row'); // fallback for about/hero
                    if (aboutItem.length) {
                        title = "Natural Hair Shampoo";
                        price = 99.99;
                        img = "img/shampoo.png";
                    }
                }
            }

            if (title) {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                let existingItem = cart.find(item => item.title === title);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ title, price, img, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                alert(title + ' added to cart!');
            }
        }
    });

    // Render Cart Page
    function renderCart() {
        if ($('#cart-items').length === 0) return; // Only run on cart page

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let html = '';
        let total = 0;

        if (cart.length === 0) {
            $('#cart-items').html('<tr><td colspan="6" class="text-center py-4">Your cart is empty.</td></tr>');
            $('#cart-subtotal').text('$0.00');
            $('#cart-total').text('$0.00');
            return;
        }

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <tr>
                    <td><img src="${item.img}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: contain;"></td>
                    <td>${item.title}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="d-flex align-items-center justify-content-center">
                            <button class="btn btn-sm btn-outline-primary btn-minus" data-index="${index}"><i class="fa fa-minus"></i></button>
                            <span class="mx-3">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-primary btn-plus" data-index="${index}"><i class="fa fa-plus"></i></button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger btn-remove" data-index="${index}"><i class="fa fa-times"></i></button>
                    </td>
                </tr>
            `;
        });

        $('#cart-items').html(html);
        $('#cart-subtotal').text('$' + total.toFixed(2));
        $('#cart-total').text('$' + total.toFixed(2));
    }

    // Cart Interactions
    $(document).on('click', '.btn-plus', function () {
        let index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    });

    $(document).on('click', '.btn-minus', function () {
        let index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    });

    $(document).on('click', '.btn-remove', function () {
        let index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    });

    $('#checkout-form').on('submit', function (e) {
        e.preventDefault();
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
        this.reset();
    });

    // Initialize cart render and auth state on page load
    $(document).ready(function () {
        renderCart();
        if (typeof window.updateNavbar === 'function') {
            window.updateNavbar();
        }
    });

    // --- Authentication Logic ---

    // Get all users from localStorage
    window.getUsers = function () {
        return JSON.parse(localStorage.getItem('users')) || [];
    };

    // Get current logged-in user
    window.getCurrentUser = function () {
        return JSON.parse(localStorage.getItem('currentUser'));
    };

    // Update Navbar based on auth state
    window.updateNavbar = function () {
        const currentUser = window.getCurrentUser();
        if (currentUser) {
            // User logged in
            $('#nav-auth-buttons').addClass('d-none').removeClass('d-flex');
            $('#nav-user-info').addClass('d-flex').removeClass('d-none');
            $('#user-greeting').text('Welcome, ' + currentUser.firstName);
        } else {
            // Not logged in
            $('#nav-auth-buttons').addClass('d-flex').removeClass('d-none');
            $('#nav-user-info').addClass('d-none').removeClass('d-flex');
        }
    };

    // Logout User
    window.logoutUser = function (event) {
        if (event) event.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.reload();
    };

    // Register User
    window.registerUser = function (event) {
        event.preventDefault();

        const form = event.target;

        // Reset custom validities
        $('#reg-confirm-password').get(0).setCustomValidity('');
        $('#reg-email').get(0).setCustomValidity('');

        const password = $('#reg-password').val();
        const confirmPassword = $('#reg-confirm-password').val();

        if (password !== confirmPassword) {
            $('#reg-confirm-password').get(0).setCustomValidity('Passwords must match');
            $('#reg-confirm-password-error').text('Passwords must match.');
        }

        const email = $('#reg-email').val().trim();
        const users = window.getUsers();
        if (users.some(user => user.email === email)) {
            $('#reg-email').get(0).setCustomValidity('Email already exists');
            $('#reg-email-error').text('Email is already registered.');
        }

        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // Save user
        const newUser = {
            firstName: $('#reg-firstname').val().trim(),
            lastName: $('#reg-lastname').val().trim(),
            email: email,
            phone: $('#reg-phone').val().trim(),
            password: password,
            address: $('#reg-address').val().trim(),
            city: $('#reg-city').val().trim(),
            state: $('#reg-state').val().trim(),
            zip: $('#reg-zip').val().trim()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    };

    // Login User
    window.loginUser = function (event) {
        event.preventDefault();

        const form = event.target;
        $('#login-password').get(0).setCustomValidity('');

        const email = $('#login-email').val().trim();
        const password = $('#login-password').val();

        const users = window.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            $('#login-password').get(0).setCustomValidity('Invalid credentials');
            $('#login-password-error').text('Invalid email or password.');
        }

        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        if (user) {
            const currentUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'index.html';
        }
    };

    // Clear custom validation on input change
    $(document).on('input', '#reg-confirm-password, #reg-email, #login-password', function () {
        if (this.setCustomValidity) {
            this.setCustomValidity('');
        }
    });

})(jQuery);
