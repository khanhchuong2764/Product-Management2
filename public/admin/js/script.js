// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", ()=> {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status",status);
            }else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}

// const buttonStatus2 = document.querySelector("select[name='status']");
// if (buttonStatus2){
//     let url = new URL(window.location.href);
//     buttonStatus2.addEventListener("change", (e) => {
//         const status = buttonStatus2.value;
//         if(status) {
//             url.searchParams.set("status",status);
//         }else {
//             url.searchParams.delete("status");
//         }
//         window.location.href=url.href;
//     })
// }

// End Button Status


// Search
const formsearch = document.querySelector("#form-search");
if (formsearch) {
    let url = new URL(window.location.href);
    formsearch.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const keyword = e.target.elements.keyword.value;
        console.log(keyword);
        if (keyword) {
            url.searchParams.set("keyword",keyword);
        }else {
            url.searchParams.delete("keyword");
        }
        window.location.href=url.href;
    })
}

// End Search