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
const ReFuseFriend = (button) => {
    button.addEventListener("click",() => {
        const userId = button.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_REFUSE_FRIEND",userId);
        button.closest(".box-user").classList.add("refuse");
    })
}
const listbtnrefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listbtnrefuseFriend.length > 0) {
    listbtnrefuseFriend.forEach( button => {
        ReFuseFriend(button);
    })
}
// End Chức Năng Từ Chối Kết Bạn


// Chức Năng Chấp Nhận Kết Bạn
const AcceptFriend = (button) => {
    button.addEventListener("click",() => {
        const userId = button.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND",userId);
        button.closest(".box-user").classList.add("accepted");
    })
}
const listbtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listbtnAcceptFriend.length > 0) {
    listbtnAcceptFriend.forEach( button => {
        AcceptFriend(button);
    })
}
// End Chức Năng Chấp Nhận Kết Bạn


// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-user-accept]");
if (badgeUserAccept) {
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",(data) => {
        const MyId = badgeUserAccept.getAttribute("badge-user-accept");
        if (MyId == data.userId) {
            badgeUserAccept.innerHTML = data.LengthAcceptFriend;
        }
    })
}
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_USER_REQUEST_FRIEND

socket.on("SERVER_RETURN_USER_REQUEST_FRIEND",(data) => {
    const ListAcceptFriend = document.querySelector("[page-accept-friend]");
    if(ListAcceptFriend) {
        const MyId = ListAcceptFriend.getAttribute("page-accept-friend");
        if(MyId == data.userId){
            const div = document.createElement("div");
            div.classList.add("col-3");
            div.setAttribute("user_id",data.IdUserRequest);
            div.innerHTML= `
                    <div class="box-user">
                        <div class="inner-avatar">
                            <img src=${data.AvatarRequest ? data.AvatarRequest : "/client/images/avatar.jpg"} alt="">
                        </div>
                        <div class="inner-info">
                            <div class="inner-name">${data.fullNameRequest}</div>
                            <div class="inner-buttons">
                                <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.IdUserRequest}>Chấp nhận</button>
                                <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.IdUserRequest}>Xóa</button>
                                <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">Đã xóa</button>
                                <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="">Đã chấp nhận</button>
                            </div>
                        </div>
                    </div>
            `
            ListAcceptFriend.appendChild(div);
            // Bắt Sự Kiện Từ Chối Lời Mời Kết Bạn
            const ButtonReFuse = ListAcceptFriend.querySelector("[btn-refuse-friend]");
            ReFuseFriend(ButtonReFuse);
            // Bắt Sự Kiện Chấp Nhận Lời Mời Kết Bạn
            const ButtonAcceptFriend = ListAcceptFriend.querySelector("[btn-accept-friend]");
            AcceptFriend(ButtonAcceptFriend);
            // End Bắt Sự Kiện Từ Chối Lời Mời Kết Bạn
            
        }
    }
    const ListUserNotFriend = document.querySelector("[listUser-not-friend]");
    if(ListUserNotFriend) {
        const BoxUserReQuest = ListUserNotFriend.querySelector(`[user_id='${data.IdUserRequest}']`);
        if(BoxUserReQuest) {
            ListUserNotFriend.removeChild(BoxUserReQuest);
        }
    }
    })
// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND",(data) => {
    const ListAcceptFriend = document.querySelector("[page-accept-friend]");
    if(ListAcceptFriend) {
        const MyId = ListAcceptFriend.getAttribute("page-accept-friend");
        if(MyId == data.userId){
            const BoxUserCancleFriend = document.querySelector(`[user_id='${data.IdUserCancel}']`);
            if (BoxUserCancleFriend) {
                ListAcceptFriend.removeChild(BoxUserCancleFriend);
            }
        }
    }
    const ListFriend = document.querySelector("[list-friends]");
    if(ListFriend) {
        const MyId = ListFriend.getAttribute("list-friends");
        if(MyId == data.userId) {
            const BoxUser = document.querySelector(`[user_id='${data.IdUserCancel}']`);
            if (BoxUser) {
                ListFriend.removeChild(BoxUser);
            }
        }
    }
})
// SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVE_RETURN_DELETE_ACCEPT_FRIEND
socket.on("SERVE_RETURN_DELETE_ACCEPT_FRIEND",(data) => {
    const ListRequestFriend = document.querySelector("[list-user-request-friend]");
    if(ListRequestFriend) {
        const MyId = ListRequestFriend.getAttribute("list-user-request-friend");
        if(MyId == data.IdRequestFriend){
            const BoxUser = document.querySelector(`[user_id='${data.userId}']`);
            if (BoxUser) {
                ListRequestFriend.removeChild(BoxUser);
            }
        }
    }
    const ListUserNotFriend = document.querySelector("[listUser-not-friend]");
    if(ListUserNotFriend) {
        const MyId = ListUserNotFriend.getAttribute("listUser-not-friend");
        if(MyId == data.IdRequestFriend) {
            const BoxUser = document.querySelector(`[user_id='${data.userId}']`);
            if (BoxUser) {
                ListUserNotFriend.removeChild(BoxUser); 
            }
        }
    }
    
})
// SERVE_RETURN_DELETE_ACCEPT_FRIEND


// SERVER_RETURN_USER_STATUS_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE",(data) => {
    const ListFriend = document.querySelector("[list-friends]");
    if (ListFriend) {
        const BoxUser = ListFriend.querySelector(`[user_id='${data.userId}']`);
        if(BoxUser) {
            const status=BoxUser.querySelector("[status]");
            status.setAttribute("status",data.statusOnline);
        }
    }
})
// END SERVER_RETURN_USER_STATUS_ONLINE

// Hủy Kết Bạn
const ListBtnDeleteFriend = document.querySelectorAll("[button-delete-friend]");
if(ListBtnDeleteFriend) {
    ListBtnDeleteFriend.forEach(button => {
        button.addEventListener("click",() => {
            const isconfirm = confirm("Bạn Chắn Chắn Muốn Xóa Kết Bạn");
            if(!isconfirm) {
                return;
            }
            button.closest(".box-user").classList.add("delete");
            const userId = button.getAttribute("button-delete-friend");
            socket.emit("CLIENT_DELETE_FRIEND",userId);
        })
    })
}
// End Hủy Kết Bạn