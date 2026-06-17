/* ===========================================================
   Baked With Love By Reo - script.js
   Student: Reoratile Motloung
   Purpose: Form validation (enquiry + contact), product
   filtering, and a gallery lightbox modal.
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initEnquiryForm();
    initContactForm();
    initProductFilter();
    initGalleryLightbox();
});

/* -----------------------------------------------------------
   Shared validation helpers
   ----------------------------------------------------------- */

function setError(input, errorEl, message) {
    if (message) {
        input.classList.add('invalid');
        errorEl.textContent = message;
        return false;
    }
    input.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
}

function isValidEmail(value) {
    // Simple, readable pattern - good enough for client-side checks.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
    // Accepts digits, spaces, +, ( ) and - ; requires at least 7 digits total.
    var digitsOnly = value.replace(/\D/g, '');
    return /^[0-9+()\s-]+$/.test(value) && digitsOnly.length >= 7;
}

/* -----------------------------------------------------------
   Enquiry form (enquiry.html)
   ----------------------------------------------------------- */

function initEnquiryForm() {
    var form = document.getElementById('enquiryForm');
    if (!form) return;

    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');
    var productInput = document.getElementById('product');
    var messageInput = document.getElementById('message');

    var nameError = document.getElementById('nameError');
    var emailError = document.getElementById('emailError');
    var phoneError = document.getElementById('phoneError');
    var messageError = document.getElementById('messageError');

    var successBox = document.getElementById('enquirySuccess');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var nameOk = setError(nameInput, nameError,
            nameInput.value.trim().length < 2 ? 'Please enter your full name.' : '');

        var emailOk = setError(emailInput, emailError,
            !isValidEmail(emailInput.value.trim()) ? 'Please enter a valid email address.' : '');

        var phoneOk = setError(phoneInput, phoneError,
            !isValidPhone(phoneInput.value.trim()) ? 'Please enter a valid phone number.' : '');

        var messageOk = setError(messageInput, messageError,
            messageInput.value.trim().length < 5 ? 'Please tell us a bit more about your enquiry.' : '');

        if (!(nameOk && emailOk && phoneOk && messageOk)) {
            successBox.hidden = true;
            return;
        }

        var productLabel = productInput.options[productInput.selectedIndex].text;

        successBox.hidden = false;
        successBox.textContent = 'Thanks, ' + nameInput.value.trim() + '! ' +
            'Your enquiry about ' + productLabel + ' has been received. ' +
            'We will contact you at ' + emailInput.value.trim() + ' or ' + phoneInput.value.trim() +
            ' soon.';

        form.reset();
        [nameInput, emailInput, phoneInput, messageInput].forEach(function (el) {
            el.classList.remove('invalid');
        });
    });
}

/* -----------------------------------------------------------
   Contact form (contact.html)
   ----------------------------------------------------------- */

function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nameInput = document.getElementById('contactName');
    var emailInput = document.getElementById('contactEmail');
    var subjectInput = document.getElementById('contactSubject');
    var messageInput = document.getElementById('contactMessage');

    var nameError = document.getElementById('contactNameError');
    var emailError = document.getElementById('contactEmailError');
    var subjectError = document.getElementById('contactSubjectError');
    var messageError = document.getElementById('contactMessageError');

    var successBox = document.getElementById('contactSuccess');

    var RECIPIENT = 'bakedwithlovebyreo@gmail.com';

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var nameOk = setError(nameInput, nameError,
            nameInput.value.trim().length < 2 ? 'Please enter your full name.' : '');

        var emailOk = setError(emailInput, emailError,
            !isValidEmail(emailInput.value.trim()) ? 'Please enter a valid email address.' : '');

        var subjectOk = setError(subjectInput, subjectError,
            subjectInput.value.trim().length < 2 ? 'Please add a short subject.' : '');

        var messageOk = setError(messageInput, messageError,
            messageInput.value.trim().length < 5 ? 'Your message is a little short.' : '');

        if (!(nameOk && emailOk && subjectOk && messageOk)) {
            successBox.hidden = true;
            return;
        }

        // No backend on a static GitHub Pages / Netlify site, so we hand the
        // validated message to the visitor's own email client, addressed to
        // the bakery's inbox, rather than silently doing nothing.
        var subject = encodeURIComponent('Website enquiry: ' + subjectInput.value.trim());
        var body = encodeURIComponent(
            'Name: ' + nameInput.value.trim() + '\n' +
            'Email: ' + emailInput.value.trim() + '\n\n' +
            messageInput.value.trim()
        );
        var mailtoLink = 'mailto:' + RECIPIENT + '?subject=' + subject + '&body=' + body;

        successBox.hidden = false;
        successBox.textContent = 'Thanks, ' + nameInput.value.trim() + '! Your email app should now ' +
            'open with your message ready to send to ' + RECIPIENT + '.';

        window.location.href = mailtoLink;

        form.reset();
        [nameInput, emailInput, subjectInput, messageInput].forEach(function (el) {
            el.classList.remove('invalid');
        });
    });
}

/* -----------------------------------------------------------
   Product filter (products.html)
   ----------------------------------------------------------- */

function initProductFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.product-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            buttons.forEach(function (b) { b.classList.remove('active'); });
            button.classList.add('active');

            var filter = button.getAttribute('data-filter');

            cards.forEach(function (card) {
                var matches = filter === 'all' || card.getAttribute('data-category') === filter;
                card.classList.toggle('is-hidden', !matches);
            });
        });
    });
}

/* -----------------------------------------------------------
   Gallery lightbox (gallery.html)
   ----------------------------------------------------------- */

function initGalleryLightbox() {
    var thumbs = document.querySelectorAll('.gallery-thumb');
    var lightbox = document.getElementById('lightbox');
    if (!thumbs.length || !lightbox) return;

    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var closeButton = document.getElementById('lightboxClose');

    function openLightbox(thumb) {
        lightboxImg.src = thumb.getAttribute('data-img');
        lightboxImg.alt = thumb.getAttribute('data-caption') || '';
        lightboxCaption.textContent = thumb.getAttribute('data-caption') || '';
        lightbox.hidden = false;
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImg.src = '';
    }

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            openLightbox(thumb);
        });
    });

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !lightbox.hidden) {
            closeLightbox();
        }
    });
}
