const appId = "2052a7e3-6110-4a2a-8cfd-ae58d3f57394"
const client = new TalkPlus.Client({appId: appId});
let pathName = (window.location.pathname).replaceAll("/", "").toString();

$(document).ready(function() {
    // 이벤트 핸들러
    client.on('event', function (data) {
        // 이벤트 타입이 메세지 일경우 상대방 메세지 받기, 스크롤다운
        if (data.type === 'message') {
            // 상대방 메세지 받기
            receiveMessage(data.message)
            // 스크롤 다운
            scrollDown()
        }
    })
    // init 함수(익명 로그인, 채널생성, 채널입장, 채널 메세지들 가져오기)
    start();
    // 사용자가 글작성해서 엔터치면 서버에 전달
    writerSendMessage();
    // 방 입장시 스크롤다운되게끔
    scrollDown();
});



function start() {
    //로컬스토리지의 userId가 null 또는 undefined 일경우 아래 로직 실행
    if(localStorage.getItem('userId') === null || localStorage.getItem('userId') === undefined) {
        //익명 로그인 함수
        client.loginAnonymous({
            // userId는 랜덤 생성 id 함수로(string)
            userId: generateRandomId()
        }, function (errResp, data) {
            console.log("loginAnonymous_errResp : " + JSON.stringify(errResp))
            console.log("loginAnonymous_data : " + JSON.stringify(data))
            // 익명 로그인이 성공하면 로컬스토리지에 userId를 저장
            localStorage.setItem('userId', JSON.stringify(data.user.id))
            // 익명 로그인이 실패시
            if (errResp) {
                // 에러 경고문 발생
                return alert(JSON.stringify(errResp))
            }
            // 익명 로그인후 채널 입장
            client.joinChannel({
                // channelId는 localhost:8080 뒤의 경로(/는 공백으로 변경)
                channelId: pathName
            }, function (errResp, data) {
                console.log("joinChannel_errResp : " + JSON.stringify(errResp))
                console.log("joinChannel_data : " + JSON.stringify(data))
                // 채널 입장 실패시
                if(errResp) {
                    // error code 2003은 존재하지 않는 채널일때 나오는 에러 메세지
                    if (errResp.code === '2003') {
                        // 채널이 존재 하지 않으므로 채널 생성
                        client.createChannel({
                            channelId: pathName,
                            name: pathName,
                            // type super_public은 최대 멤버 제한수를 100명이상으로 설정 가능, 다만 FCM(Firebase Cloud Messaging) Push Notification 지원되지 않음
                            type: 'super_public',
                            members: []
                        }, function (errResp, data) {
                            console.log("createChannel_errResp : " + JSON.stringify(errResp))
                            console.log("createChannel_data : " + JSON.stringify(data))
                            if (errResp) {
                                return alert(JSON.stringify(errResp));
                            }
                        })
                        // error code 2008은 이미 채널에 입장되어 있는 경우
                    } else if (errResp.code === '2008') {

                    } else {
                        return alert(JSON.stringify(errResp));
                    }
                }
                // 채널에 작성된 메세지들을 불러온다
                client.getMessages({
                    channelId: pathName
                }, function (errResp, data) {
                    console.log("getMessages_errResp : " + JSON.stringify(errResp))
                    console.log("getMessages_data : " + JSON.stringify(data))
                    if (errResp) {
                        return alert(JSON.stringify(errResp));
                    }
                    // 채널에 작성된 메세지들을 html에 붙이는 함수
                    getAllMessages(data.messages);
                })
            })
        })
        //로컬스토리지의 userId가 null 또는 undefined 일경우가 아닌걍우(로컬스토리지에 유저 아이디가 있는 경우) 아래 로직 실행
    } else {
        // 익명으로 로그인
        client.loginAnonymous({
            // 로컬스토리지에 아이디가 있으므로 아이디를 가져온다 다만 setItem에서 JSON형식으로 가져왔기떄문에 큰 따옴표를 제거
            userId: localStorage.getItem('userId').replaceAll("\"", "")
        }, function (errResp, data) {
            console.log("loginAnonymous_errResp : " + JSON.stringify(errResp))
            console.log("loginAnonymous_data : " + JSON.stringify(data))
            if (errResp) {
                return alert(JSON.stringify(errResp))
            }
            // 채널에 참가
            client.joinChannel({
                channelId: pathName
            }, function (errResp, data) {
                console.log("joinChannel_errResp : " + JSON.stringify(errResp))
                console.log("joinChannel_data : " + JSON.stringify(data))
                if(errResp) {
                    // error code 2003은 존재하지 않는 채널일때 나오는 에러 메세지
                    if (errResp.code === '2003') {
                        // 채널이 존재 하지 않으므로 채널 생성
                        client.createChannel({
                            channelId: pathName,
                            name: pathName,
                            // type super_public은 최대 멤버 제한수를 100명이상으로 설정 가능, 다만 FCM(Firebase Cloud Messaging) Push Notification 지원되지 않음
                            type: 'super_public',
                            members: []
                        }, function (errResp, data) {
                            console.log("createChannel_errResp : " + JSON.stringify(errResp))
                            console.log("createChannel_data : " + JSON.stringify(data))
                            if (errResp) {
                                return alert(JSON.stringify(errResp));
                            }
                        })
                        // error code 2008은 이미 채널에 입장되어 있는 경우
                    } else if (errResp.code === '2008') {

                    } else {
                        return alert(JSON.stringify(errResp));
                    }
                }
                // 채널에 작성된 메세지들을 불러온다
                client.getMessages({
                    channelId: pathName
                }, function (errResp, data) {
                    console.log("getMessages_errResp : " + JSON.stringify(errResp))
                    console.log("getMessages_data : " + JSON.stringify(data))
                    if (errResp) {
                        return alert(JSON.stringify(errResp));
                    }
                    // 채널에 작성된 메세지들을 html에 붙이는 함수
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