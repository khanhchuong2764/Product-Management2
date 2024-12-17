const inputquantity = document.querySelectorAll("input[name='quantity']");
if (inputquantity.length > 0) {
    inputquantity.forEach(input => {
        input.addEventListener("change", () =>{
            const quantity = input.value;
            const product_id = input.getAttribute("data-id");
            window.location.href = `/cart/update/${product_id}/${quantity}`;
        })
    })
}


// CheckBox Multi
const checkboxMulti = document.querySelector("[checkboxmulti]");
if(checkboxMulti) {
    const inputcheckall = checkboxMulti.querySelector("input[name='checkall']");
    const inputcheckbox = checkboxMulti.querySelectorAll("input[name='id']");
    inputcheckall.addEventListener("click",() => {
        if(inputcheckall.checked){
            inputcheckbox.forEach(input => {
                input.checked = true;
            })
        }else {
            inputcheckbox.forEach(input => {
                input.checked = false;
            })
        }
    })
    inputcheckbox.forEach(input => {
        input.addEventListener("click",() => {
            const checkboxMulti = document.querySelector("[checkboxmulti]");
            const inputchecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if(inputchecked == inputcheckbox.length) {
                inputcheckall.checked =true;
            }else {
                inputcheckall.checked =false;
            }
        })
    })
}

// End CheckBox Multi

// Cart
const formCart = document.querySelector("#form-order");
if(formCart) {
    formCart.addEventListener("submit",(e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkboxmulti]");
        const inputchecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        if(inputchecked.length > 0) {
            const inputform = e.target.elements.ids;
            let arr = [];
            inputchecked.forEach(input => {
                const id = input.value;
                let quantity = input.closest("tr").querySelector("input[name='quantity']").value;
                quantity=parseInt(quantity);
                const objectProduct = {
                    product_id: id,
                    quantity : quantity
                }
                arr.push(objectProduct);
            })
            inputform.value=JSON.stringify(arr);
            formCart.submit();
        }else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm");
        }
    })
}

// End Cart
