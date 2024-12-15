const SelectePermisson = document.querySelector("[select-permission]");
if (SelectePermisson){
    let url = new URL(window.location.href);
    SelectePermisson.addEventListener("change", (e) => {
        const role_id = e.target.value;
        if(role_id){
            url.searchParams.set("role_id",role_id);
        }else {
            url.searchParams.delete("role_id");
        }
        window.location.href=url.href;
    })
    
    const role_id = url.searchParams.get("role_id");
    if(role_id){
        const optionSelected = SelectePermisson.querySelector(`[permission='${role_id}']`);
        optionSelected.selected = true;
    }
}