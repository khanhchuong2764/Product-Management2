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