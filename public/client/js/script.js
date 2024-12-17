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
