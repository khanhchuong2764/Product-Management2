import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// Client_send_message
const formChat = document.querySelector(".chat .inner-form");
if(formChat) {
    formChat.addEventListener("submit",(e) => {
        e.preventDefault();
        const inputChat = formChat.elements.content;
        const content = inputChat.value;
        if(content) {
            socket.emit("CLIENT_SEND_MESSAGE",content);
            inputChat.value="";
            socket.emit("CLIENT_SEND_TYPING",false);
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
        let htmlFullName = "";
        if(data.user_id == MyId) {
            div.classList.add("inner-outgoing");
        }else {
            htmlFullName= `<div class="inner-name">${data.fullName}</div>`;
            div.classList.add("inner-incoming");
        }
        div.innerHTML= `
            ${htmlFullName}
            <div class="inner-content">${data.content}</div>
        `;
        body.insertBefore(div,ListTyping);
        body.scrollTop = body.scrollHeight;
    })
}

// END SERVER_RETURN_MESAGE


// Scroll Chat To Bottom
const bodyChat = document.querySelector(".inner-body");
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// END Scroll Chat To Bottom

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