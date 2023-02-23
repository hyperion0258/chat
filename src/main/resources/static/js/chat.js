const apiKey = "7bec7db09e4952a18eee3ee717d0593c94bd2d2dfa7f1fe10c6e3ff1a9d7b2ba"
const appId = "2052a7e3-6110-4a2a-8cfd-ae58d3f57394"
let userId = ""
let userName = ""
let password = ""
let loginToken = ""
const channelName = ""
const channelId = ""
const client = new TalkPlus.Client({appId: appId});
let pathName = (window.location.pathname).replaceAll("/", "").toString();

$(document).ready(function() {
    client.on('event', function (data) {
        if (data.type === 'message') {
            receiveMessage(data.message)
            scrollDown()
        }
    })
    start();
    writerSendMessage();
    scrollDown();
});



function start() {
    if(localStorage.getItem('userId') === null || localStorage.getItem('userId') === undefined) {
        client.loginAnonymous({
            userId: generateRandomId()
        }, function (errResp, data) {
            console.log("loginAnonymous_errResp : " + JSON.stringify(errResp))
            console.log("loginAnonymous_data : " + JSON.stringify(data))
            localStorage.setItem('userId', JSON.stringify(data.user.id))
            if (errResp) {
                return alert(JSON.stringify(errResp))
            }
            client.joinChannel({
                channelId: pathName
            }, function (errResp, data) {
                console.log("joinChannel_errResp : " + JSON.stringify(errResp))
                console.log("joinChannel_data : " + JSON.stringify(data))
                if(errResp) {
                    if (errResp.code === '2003') { // if channel not found, create it
                        client.createChannel({
                            channelId: pathName,
                            name: pathName,
                            type: 'super_public',
                            members: []
                        }, function (errResp, data) {
                            console.log("createChannel_errResp : " + JSON.stringify(errResp))
                            console.log("createChannel_data : " + JSON.stringify(data))
                            if (errResp) {
                                return alert(JSON.stringify(errResp));
                            }
                        })
                    } else if (errResp.code === '2008') { // if user already had joined channel before, don't worry about error
                        // don't handle
                    } else {
                        return alert(JSON.stringify(errResp));
                    }
                }
                client.getMessages({
                    channelId: pathName
                }, function (errResp, data) {
                    console.log("getMessages_errResp : " + JSON.stringify(errResp))
                    console.log("getMessages_data : " + JSON.stringify(data))
                    if (errResp) {
                        return alert(JSON.stringify(errResp));
                    }
                    getAllMessages(data.messages);
                })
            })
        })
    } else {
        client.loginAnonymous({
            userId: localStorage.getItem('userId').replaceAll("\"", "")
        }, function (errResp, data) {
            console.log("loginAnonymous_errResp : " + JSON.stringify(errResp))
            console.log("loginAnonymous_data : " + JSON.stringify(data))
            if (errResp) {
                return alert(JSON.stringify(errResp))
            }
            client.joinChannel({
                channelId: pathName
            }, function (errResp, data) {
                console.log("joinChannel_errResp : " + JSON.stringify(errResp))
                console.log("joinChannel_data : " + JSON.stringify(data))
                if(errResp) {
                    if (errResp.code === '2003') { // if channel not found, create it
                        client.createChannel({
                            channelId: pathName,
                            name: pathName,
                            type: 'super_public',
                            members: []
                        }, function (errResp, data) {
                            console.log("createChannel_errResp : " + JSON.stringify(errResp))
                            console.log("createChannel_data : " + JSON.stringify(data))
                            if (errResp) {
                                return alert(JSON.stringify(errResp));
                            }
                        })
                    } else if (errResp.code === '2008') { // if user already had joined channel before, don't worry about error
                        // don't handle
                    } else {
                        return alert(JSON.stringify(errResp));
                    }
                }
                client.getMessages({
                    channelId: pathName
                }, function (errResp, data) {
                    console.log("getMessages_errResp : " + JSON.stringify(errResp))
                    console.log("getMessages_data : " + JSON.stringify(data))
                    if (errResp) {
                        return alert(JSON.stringify(errResp));
                    }
                    getAllMessages(data.messages);
                })
            })
        })
    }
}

function writerSendMessage() {
    $(document).on('keypress', '.enterMessage', function (e) {
        if ($('.enterMessage').val() !== ''){
            if (e.keyCode === 13) {
                e.preventDefault();
                const message = $('.enterMessage').val();
                $('.enterMessage').val('');
                writerSendMessageToServer(message);
            }
        }
    });
}

function writerSendMessageToServer(message) {
    client.sendMessage({
        channelId: pathName,
        type: 'text',
        text: message
    }, function (errResp, data) {
        console.log("sendMessage_errResp : " + JSON.stringify(errResp))
        console.log("sendMessage_data : " + JSON.stringify(data))
        if (errResp) {
            return alert(JSON.stringify(errResp));
        }
        let html = '';
        html = writerSendMessageAddHtml(data.message);
        $('.chatArea').append(html);
        scrollDown();
    });
}

function writerSendMessageAddHtml(message) {
    let template = '';
    template = `<div class="writer">
                    <div class="user">${message.username}</div>
                    <div class="message-text">${message.text}</div>
                </div>`
    return template;
}

function othersSendMessageAddHtml(message) {
    let template = '';
    template = `<div class="others">
                    <div class="user">${message.username}</div>
                    <div class="message-text">${message.text}</div>
                </div>`
    return template;
}

function getAllMessages(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i]
        let html = '';
        if(message.userId === localStorage.getItem('userId').replaceAll("\"", "")) {
            html = writerSendMessageAddHtml(message);
            $('.chatArea').append(html);
        } else {
            html = othersSendMessageAddHtml(message);
            $('.chatArea').append(html);
        }

    }
    scrollDown();
}

function receiveMessage(message) {
    $('.chatArea').append(othersSendMessageAddHtml(message));
}


function logOut() {
    client.logout();
}

function isLoggedIn() {
    let isLoggedIn = client.isLoggedIn();
    console.log(isLoggedIn);  // true or false
}

function leaveChannel() {
    client.leaveChannel({
        channelId: pathName
    })
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err)
        })
}

function generateRandomId() {
    return generateRandomString() + '_' + generateRandomString() + '_' + generateRandomString();
}


function generateRandomString() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function scrollDown() {
    $('.chatArea').scrollTop($('.chatArea')[0].scrollHeight);
}

function updateUser() {
    let newUserName = $('.changeNameInput').val();
    client.updateUser({
        username: newUserName,
    });
    alert("닉네임이 " + newUserName + " (으)로 변경되었습니다")
}