const SelecteCategory= document.querySelector("[selecte-category-products]");
if (SelecteCategory){
    let url = new URL(window.location.href);
    SelecteCategory.addEventListener("change", (e) => {
        const categoryId = e.target.value;
        if(categoryId){
            url.searchParams.set("categoryId",categoryId);
        }else {
            url.searchParams.delete("categoryId");
        }
        window.location.href=url.href;
    })
    
    const categoryId = url.searchParams.get("categoryId");
    if(categoryId){
        const optionSelected = SelecteCategory.querySelector(`[value='${categoryId}']`);
        optionSelected.selected = true;
    }
}
