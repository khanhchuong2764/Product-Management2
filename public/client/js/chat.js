import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images',{
    multiple:true,
    maxFileCount:6
});
// End file-upload-with-preview

// Client_send_message
const formChat = document.querySelector(".chat .inner-form");
if(formChat) {
    formChat.addEventListener("submit",(e) => {
        e.preventDefault();
        const inputChat = formChat.elements.content;
        const content = inputChat.value;
        const images =upload.cachedFileArray || [];
        if(content !="" || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE",{
                content:content,
                images:images
            });
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING",false);
            inputChat.value="";
        }   
    })
}
//End Client_send_message

// SERVER_RETURN_MESAGE
const body = document.querySelector(".inner-body");
if(body){
    const ListTyping = document.querySelector(".inner-list-typing");
    const MyId = document.querySelector("[my_id]").getAttribute("my_id");
    socket.on("SERVER_RETURN_MESSAGE" , (data) => {
        let div = document.createElement("div");
        div.setAttribute("chat-id",data.chatId);
        let htmlFullName = "";
        let htmlContent = ""; 
        let htmlImage = "";
        // <span class="btn btn-light mx-1" user_id=${data.user_id} delete-chat-id=${data.chatId}>
            //     <i class="fa-solid fa-trash"></i>
        // </span>
        if(data.content) {
            htmlContent = `<div class="inner-content">
                                ${data.content}
                            </div>`;
        }
        if(data.images.length > 0){
            htmlImage +=`<div class="inner-images">`;
            for (const item of data.images) {
                htmlImage += `<img src=${item}></img>`;
            }
            htmlImage +=`</div>`;
        }
        if(data.user_id == MyId) {
            div.classList.add("inner-outgoing");
        }else {
            htmlFullName= `<div class="inner-name">${data.fullName}</div>`;
            div.classList.add("inner-incoming");
        }
        div.innerHTML= `
            ${htmlFullName}
            ${htmlContent}
            ${htmlImage}
        `;
        body.insertBefore(div,ListTyping);
        body.scrollTop = body.scrollHeight;
        new Viewer(div);
        // const button = div.querySelector("[delete-chat-id]");
        // button.addEventListener("click",() => {
        //     const chatId = button.getAttribute("delete-chat-id");
        //     const user_id = button.getAttribute("user_id");
        //     console.log("OK");
        //     socket.emit("CLIENT_SEND_DELETE_MESSAGE",{
        //         chatId : chatId,
        //         user_id :user_id
        //     });
        // })    
    })
}

// END SERVER_RETURN_MESAGE


// Scroll Chat To Bottom
const bodyChat = document.querySelector(".inner-body");
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// END Scroll Chat To Bottom


// ViewerJS
new Viewer(bodyChat);
// End ViewerJs

// Show Typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING",true);
    clearTimeout(timeOut);
    timeOut=setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING",false);
    },3000)
}
// End Show Typing

// Show Emoji
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
    const buttonIcon = document.querySelector(".chat .inner-form .button-icon");
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.addEventListener("click",() => {
        tooltip.classList.toggle("shown");
    })
    const inputChat = document.querySelector("input[name='content']");
    emojiPicker.addEventListener('emoji-click',(e) => {
        inputChat.value = inputChat.value + e.detail.unicode;
        inputChat.setSelectionRange(inputChat.value.length,inputChat.value.length);
        inputChat.focus();
        showTyping();
    });
    inputChat.addEventListener("keyup",() => {
        showTyping();
    })
}

const ListTyping = document.querySelector(".inner-list-typing");
if(ListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if(data.type) {
            const existBoxtyping = ListTyping.querySelector(`.box-typing[userid="${data.user_id}"]`);
            const bodyChat = document.querySelector(".inner-body");
            if(!existBoxtyping){
                let boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("userid",data.user_id);
                boxTyping.innerHTML = `
                    <div class="box-typing">
                        <div class="inner-name">${data.fullName}</div>
                        <div class="inner-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                `
                ListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        }else {
            const existBoxtyping = ListTyping.querySelector(`.box-typing[userid="${data.user_id}"]`);
            if(existBoxtyping) {
                ListTyping.removeChild(existBoxtyping);
            }
        }
    })
}

// Upload Image

// Delete Chat
const DeleteChat = document.querySelectorAll("[delete-chat-id]");
if(DeleteChat.length > 0) {
    DeleteChat.forEach(button => {
        button.addEventListener("click",() => {
            const chatId = button.getAttribute("delete-chat-id");
            const user_id = button.getAttribute("user_id");
            socket.emit("CLIENT_SEND_DELETE_MESSAGE",{
                chatId : chatId,
                user_id :user_id
            });
        })
    })
}
// End Delete Chat

// SERVER_RETURN_MESSAGE_DELETE
socket.on("SERVER_RETURN_MESSAGE_DELETE", (chatId) => {
    const bodyChat = document.querySelector(".inner-body");
    const boxChat = bodyChat.querySelector(`[chat-id='${chatId}']`);
    console.log(boxChat);
    if(boxChat) {
        bodyChat.removeChild(boxChat);
    }
})

// End SERVER_RETURN_MESSAGE_DELETE