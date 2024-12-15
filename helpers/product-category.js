const ProductCategory = require("../model/product-category.model");

module.exports.getSub = async (parent_id) => {
    const getSubMenu = async (parent_id) => {
        const SubMenu = await ProductCategory.find({parent_id : parent_id,deleted :false,status :"active"});
        let allsub = [...SubMenu];
        for (const item  of SubMenu) {
            const child = await getSubMenu(item.id);
            allsub = allsub.concat(child);
        }
        return allsub;
    }
    const result = await getSubMenu(parent_id);

    return result;
}