module.exports = (ObjectPagination,CountProduct,query) => {
    if (query.page) {
        ObjectPagination.currentPage = parseInt(query.page);
    }
    ObjectPagination.skip = (ObjectPagination.currentPage - 1) * ObjectPagination.limitItem;
    ObjectPagination.totalPage = Math.ceil(CountProduct/ObjectPagination.limitItem);
    return ObjectPagination;
}