document.addEventListener("DOMContentLoaded", function () {
    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true
    });

    // Email link functionality
    const emailLink = document.getElementById('email-link');
    const originalEmailText = emailLink.textContent;
    let originalCopyText = "COPY EMAIL";
    let originalEmailCopiedText = "EMAIL COPIED";

    const updateTextForScreenSize = () => {
        if (window.innerWidth <= 768) {
            emailLink.querySelector('.original-text').textContent = 'CONTACT';
            originalCopyText = 'COPY';
        } else {
            emailLink.querySelector('.original-text').textContent = originalEmailText;
            originalCopyText = 'COPY EMAIL';
        }
        emailLink.querySelector('.copy-text').textContent = originalCopyText;
        emailLink.querySelector('.email-copied-text').textContent = originalEmailCopiedText;
    };

    emailLink.innerHTML = `
        <span class="original-text">${originalEmailText}</span>
        <span class="copy-text">COPY EMAIL</span>
        <span class="email-copied-text">EMAIL COPIED</span>
    `;

    emailLink.addEventListener('mouseover', function () {
        emailLink.querySelector('.original-text').style.opacity = '0';
        emailLink.querySelector('.copy-text').style.opacity = '1';
    });

    emailLink.addEventListener('mouseout', function () {
        if (!emailLink.classList.contains('clicked')) {
            emailLink.querySelector('.original-text').style.opacity = '1';
            emailLink.querySelector('.copy-text').style.opacity = '0';
        }
    });

    emailLink.addEventListener('click', function (event) {
        event.preventDefault();
        const email = 'nellymafi@yahoo.com';
        navigator.clipboard.writeText(email).then(function () {
            emailLink.classList.add('clicked');
            emailLink.querySelector('.email-copied-text').style.opacity = '1';
            emailLink.querySelector('.copy-text').style.opacity = '0';
            emailLink.style.backgroundColor = 'var(--button_clicked_bkgr_color)';
            emailLink.style.color = 'var(--button_clicked_text_color)';
            setTimeout(function () {
                emailLink.classList.remove('clicked');
                emailLink.querySelector('.email-copied-text').style.opacity = '0';
                emailLink.querySelector('.copy-text').style.opacity = '0';
                emailLink.querySelector('.original-text').style.opacity = '1';
                emailLink.style.backgroundColor = 'var(--button_bkgr_color)';
                emailLink.style.color = 'var(--button_text_color)';
            }, 2000);
        });
    });

    updateTextForScreenSize();
    window.addEventListener('resize', updateTextForScreenSize);
});
