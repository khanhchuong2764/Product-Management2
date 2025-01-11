// Show Alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const closeAlert = showAlert.querySelector('[alert-close]');
    closeAlert.addEventListener("click",() => {
        showAlert.classList.add('alert-hidden');
    })
    const time = parseInt(showAlert.getAttribute('data-time'));
    setTimeout(() => {
        showAlert.classList.add('alert-hidden');    
    },time)
}


// End Show Alert

// Get Cookies
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value; // Trả về giá trị cookie
        }
    }
    return null; // Cookie không tồn tại
}
// End Get Cookies
