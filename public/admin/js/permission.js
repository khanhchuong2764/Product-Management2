// Permission
const tablePermission = document.querySelector("[table-permission]");
if(tablePermission) {
    const buttonSubmitUpdate = document.querySelector("[btn-submit]");
    buttonSubmitUpdate.addEventListener("click",() => {
        let permission = [];
        const rows = tablePermission.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name=="id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permission.push({
                        id: id,
                        permission: []
                    })
                })
            }else {
                inputs.forEach((input,index) => {
                    const checked = input.checked;
                    if (checked) {
                        permission[index].permission.push(name);
                    }
                })
            }
        })
        if (permission.length > 0) {
            const formChangePermission = document.querySelector("#form-change-permission");
            const inputPermisson = formChangePermission.querySelector("input[name='permission']"); 
            inputPermisson.value = JSON.stringify(permission);
            formChangePermission.submit();
        }
    })
}
// End Permission


// Permission Data Default
const dataRecord = document.querySelector("[data-record]");
if (dataRecord) {
    const records = JSON.parse(dataRecord.getAttribute("data-record"));
    const tablePermission = document.querySelector("[table-permission]");
    records.forEach((item,index) => {
        const permission = item.permission;
        permission.forEach(dataName => {
            const row = tablePermission.querySelector(`[data-name=${dataName}]`);
            const input = row.querySelectorAll("input")[index];
            input.checked=true;
        })
    })
}

// End Permission Data Default

// Checkbox Multi
const checkboxall = document.querySelectorAll("[select-all]");
if(checkboxall.length > 0) {
    checkboxall.forEach((input,index) => {
        input.addEventListener("click", () => {
            const tablePermission = document.querySelector("[table-permission]");
            const rows = tablePermission.querySelectorAll("[data-name]");
            rows.forEach(row => {
                const dataName = row.getAttribute("data-name");
                if(dataName != "id") {
                    const inputcheck = row.querySelectorAll("input")[index];
                    if(input.checked){
                        inputcheck.checked=true;
                    }else {
                        inputcheck.checked=false;
                    }
                }
            })
        })
    })
}

// End CheckBox Multi