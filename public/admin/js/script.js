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

// Pagination
const buttonPagi = document.querySelectorAll("[button-pagi]");
if (buttonPagi.length > 0) {
    let url = new URL(window.location.href);
    buttonPagi.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagi");
            url.searchParams.set("page",page);
            window.location.href=url.href;
        })
    })
}
// End Pagination

// ChangeStatus
const buttonChangeStatus = document.querySelectorAll("[change-status]");
if (buttonChangeStatus.length > 0) {
    const formchangeStatus = document.querySelector("#form-change-status");
    let path = formchangeStatus.getAttribute("data-path");
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            const StatusChange = status=="active" ? "inactive" : "active";
            const action = path + `/${StatusChange}/${id}?_method=PATCH`;
            formchangeStatus.action=action;
            formchangeStatus.submit();  
        })
    })
}

// End ChangeStatus

// CheckBox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputcheckall = checkboxMulti.querySelector("input[name='checkall']");
    const inputcheckbox = checkboxMulti.querySelectorAll("input[name='id']");
    inputcheckall.addEventListener("click", () => {
        if (inputcheckall.checked) {
            inputcheckbox.forEach(input => {
                input.checked=true;
            })
        }else {
            inputcheckbox.forEach(input => {
                input.checked=false;
            })
        }
    })
    
    inputcheckbox.forEach(input => {
        input.addEventListener("click", () => {
            const countchecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countchecked==inputcheckbox.length) {
                inputcheckall.checked=true;
            }else {
                inputcheckall.checked=false;
            }
        })
    })
}

// End CheckBox Multi

// Change Multi
const formChangeMulti= document.querySelector("#form-change-multi");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputchecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        const type = e.target.elements.type.value;
        if (type == "delete-all") {
            const check = confirm("Bạn có chắc muốn xóa sản bản ghi này");
            if(!check) {
                return;
            }
        }
        if (inputchecked.length > 0) {
            const inputform = document.querySelector("input[name='ids']");
            let arr = [];
            inputchecked.forEach(input => {
                const id = input.value;
                if (type =="posittion-change") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    arr.push(`${id}-${position}`);
                }else {
                    arr.push(id);
                }
            })
            inputform.value=arr.join(", ");
            formChangeMulti.submit();
        }else {
            alert("Vui lòng chọn ít nhất 1 bản ghi");
        }
    })
}

// End Change Multi

// Delete Item
const buttonDeleteItem = document.querySelectorAll("[btn-delete-item]");
if (buttonDeleteItem.length > 0) {
    const formdeleteItem = document.querySelector("#form-delete-item");
    const path = formdeleteItem.getAttribute("data-path");
    buttonDeleteItem.forEach(button => {
        button.addEventListener("click", () => {
            const check = confirm('Bạn có chắc muốn xóa bản ghi này');
            if (!check) {
                return;
            }
            const id = button.getAttribute("data-id");
            const action = `${path}/${id}?_method=DELETE`;
            formdeleteItem.action=action;
            formdeleteItem.submit();
        })
    })
}

// End Delete Item

// Delete Item
const buttonRestore = document.querySelectorAll("[btn-restore-item]");
if (buttonRestore.length > 0) {
    const formRestoreItem = document.querySelector("#form-restore-item");
    const path = formRestoreItem.getAttribute("data-path");
    buttonRestore.forEach(button => {
        button.addEventListener("click", () => {
            const check = confirm('Bạn có chắc muốn khôi phục bản ghi này');
            if (!check) {
                return;
            }
            const id = button.getAttribute("data-id");
            const action = `${path}/${id}?_method=PATCH`;
            formRestoreItem.action=action;
            formRestoreItem.submit();
        })
    })
}

// End Delete Item
    
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