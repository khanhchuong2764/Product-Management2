// Chức Năng Gửi Yêu Cầu Kết Bạn
const listbtnaddFriend = document.querySelectorAll("[btn-add-friend]");
if (listbtnaddFriend.length > 0) {
    listbtnaddFriend.forEach( button => {
        button.addEventListener("click",() => {
            const userId = button.getAttribute("btn-add-friend");
            socket.emit("CLIENT_ADD_FRIEND",userId);
            button.closest(".box-user").classList.add("add");
        })
    })
}

// End Chức Năng Gửi Yêu Cầu Kết Bạn

// Chức Năng Hủy Gửi Yêu Cầu Kết Bạn
const listbtncancleFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listbtncancleFriend.length > 0) {
    listbtncancleFriend.forEach( button => {
        button.addEventListener("click",() => {
            const userId = button.getAttribute("btn-cancel-friend");
            socket.emit("CLIENT_CANCLE_FRIEND",userId);
            button.closest(".box-user").classList.remove("add");
        })
    })
}
// End Chức Năng Hủy Gửi Yêu Cầu Kết Bạn


// Chức Năng Từ Chối Kết Bạn
const listbtnrefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listbtnrefuseFriend.length > 0) {
    listbtnrefuseFriend.forEach( button => {
        button.addEventListener("click",() => {
            const userId = button.getAttribute("btn-refuse-friend");
            socket.emit("CLIENT_REFUSE_FRIEND",userId);
            button.closest(".box-user").classList.add("refuse");
        })
    })
}
// End Chức Năng Từ Chối Kết Bạn


// Chức Năng Chấp Nhận Kết Bạn
const listbtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listbtnAcceptFriend.length > 0) {
    listbtnAcceptFriend.forEach( button => {
        button.addEventListener("click",() => {
            const userId = button.getAttribute("btn-accept-friend");
            socket.emit("CLIENT_ACCEPT_FRIEND",userId);
            button.closest(".box-user").classList.add("accepted");
        })
    })
}
// End Chức Năng Chấp Nhận Kết Bạn