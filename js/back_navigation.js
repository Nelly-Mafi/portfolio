document.querySelector('.back-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    const referrer = document.referrer; // Get the previous page URL

    // Check if the previous page is part of the same portfolio
    if (referrer && referrer.includes(window.location.origin) && referrer !== window.location.href) {
        // If valid referrer, navigate back in history
        window.history.back();
    } else {
        // If no valid referrer, redirect to the home page
        window.location.href = 'index.html'; // Adjust with your home page route
    }
});
