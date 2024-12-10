module.exports.createPost = (req, res, next) => {
    if(!req.body.title) {
        req.flash("error","Vui lòng nhập tiêu đề");
        res.redirect("back");
        return;
    }
    if( req.body.title.length < 2) {
        req.flash("error","Vui lòng nhập tiêu đề ít nhất 2 ký tự");
        res.redirect("back");
        return;
    }
    next();
}