let count = 0;
const createTree = (arr,parent_id ="") => {
    let tree=[];
    arr.forEach(item => {
        if (item.parent_id==parent_id) {
            count++;
            const ItemNew = item;
            ItemNew.index=count;
            const childrent = createTree(arr,item.id);
            if (childrent.length > 0) {
                ItemNew.childrent = childrent;
            }
            tree.push(ItemNew);
        }
    });
    return tree;
}

module.exports.tree = (arr,parent_id ="") => {
    count = 0;
    const tree = createTree(arr,parent_id ="");
    return tree;
}