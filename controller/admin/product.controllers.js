const Product = require("../../model/product.model");


module.exports.index = async(req, res) => {
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
    if (req.query.status) { 
        const index = FillterStatus.findIndex(item => {
            return item.status == req.query.status;
        })
        FillterStatus[index].class="active";
    }else {
        FillterStatus[0].class="active";
    }

    const find = {
        deleted:false
    };

    let keyword="";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword,"i");
        find.title = regex;
    }

    if (req.query.status) { 
        find.status = req.query.status;
    };
    const product = await Product.find(find);
    res.render("admin/pages/products/index",{
        titlePage:"Danh Sách Sản Phẩm",
        product:product,
        FillterStatus:FillterStatus,
        keyword:keyword
    })  
}