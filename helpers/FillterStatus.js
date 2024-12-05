module.exports = (query) => {
    const FillterStatus = [
        {
            name:"Tất Cả",
            status :"",
            class :""
        },
        {
            name:"Hoạt Động",
            status :"active",
            class :""
        },
        {
            name:"Dừng Hoạt Động",
            status :"inactive",
            class :""
        }
    ]
    if (query.status) { 
        const index = FillterStatus.findIndex(item => {
            return item.status == query.status;
        })
        FillterStatus[index].class="active";
    }else {
        FillterStatus[0].class="active";
    }
    return FillterStatus;
}