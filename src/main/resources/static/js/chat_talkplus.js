// appId, appKey는 talkplus에서 제공 하는 고유 아이디와 키로 30일(2023-03-14까지) 사용 가능, 그 이후에 사용하려면 유료결제가 필요함
const appId = "2052a7e3-6110-4a2a-8cfd-ae58d3f57394"
const appKey = "7bec7db09e4952a18eee3ee717d0593c94bd2d2dfa7f1fe10c6e3ff1a9d7b2ba"
let userId = ""
let userName = ""
let password = ""
let loginToken = ""
const channelName = ""
const channelId = ""
// talkplus 초기화 appId 필요
const client = new TalkPlus.Client({appId: appId});
// pathName은 url의 경로와 그앞의 / 로 이루어진 문자열을 반환하는데 / 는 공백으로 변경
let pathName = (window.location.pathname).replaceAll("/", "").toString();

$(document).ready(function() {
    // 이벤트 감지 핸들러
    client.on('event', function (data) {
        // 이벤트 타입이 메세지 일경우 상대방 메세지 받기, 스크롤다운
        if (data.type === 'message') {
            // 상대방 메세지 받기
            receiveMessage(data.message)
            // 상대방 메세지를 받을때 스크롤 다운
            scrollDown()
        }
    })
    $('.layer_popWrap').hide();
    // init 함수(익명 로그인, 채널생성, 채널입장, 채널 메세지들 가져오기)
    start();
    // 사용자가 글작성해서 엔터치면 서버에 전달
    writerSendMessage();
    // 닉네임 변경 길이 체크 함수
    lengthCheck();
    // 채팅창 클릭시 사용자 닉네임 변경 팝업창 띄우는 함수
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
            // 익명 로그인이 성공하면 로컬스토리지에 userId, username을 저장
            localStorage.setItem('userId', JSON.stringify(data.user.id))
            // 팝업창 띄우는 함수
            layerPopWrap(data.user.id)
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
            // 팝업창 띄우는 함수
            layerPopWrap(data.user.id)
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
// 사용자가 엔터를치거나 보내는 버튼을 클릭하면 input태그를 비워주고 서버에 메세지를 보내는 함수를 호출
function writerSendMessage() {
    // 키 이벤트
    $(document).keypress(function (e) {
        // input태그의 value가 공백이 아니고
        if ($('.enterMessage').val() !== ''){
            // keyCode 13 = enter 일때
            if (e.keyCode === 13) {
                // preventDefault는 input태그의 고유동작(페이지 리로드)을 중지시킴
                e.preventDefault();
                const message = $('.enterMessage').val();
                // 엔터키 입력후 input태그의 내용을 비워줌
                $('.enterMessage').val('');
                // 서버에 메세지를 보내는 함수를 호출
                writerSendMessageToServer(message);
            }
        }
    });
    // 클릭 이벤트
    $('.sendbtn').click(function (e) {
        // input태그의 value가 공백이 아니고
        if ($('.enterMessage').val() !== ''){
            // preventDefault는 input태그의 고유동작(페이지 리로드)을 중지시킴
            e.preventDefault();
            const message = $('.enterMessage').val();
            // 클릭후 input태그의 내용을 비워줌
            $('.enterMessage').val('');
            // 서버에 메세지를 보내는 함수를 호출
            writerSendMessageToServer(message);
        }
    })
}

// 사용자가 쓴 메세지를 서버에 보내는 함수
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
        // 서버에 메세지를 보내고 응답으로 받은 메세지를 html에 넣는다
        html = writerSendMessageAddHtml(data.message);
        // chatArea에 append
        $('.chatArea').append(html);
        // 사용자가 메세지를 입력했을때 스크롤 다운
        scrollDown();
    });
}

// 사용자가 쓴 메세지를 html에 넣는 함수
function writerSendMessageAddHtml(message) {
    let template = '';
    template = `<div class="writer">
                    <div class="user">${message.username}</div>
                    <div class="message-text">${message.text}</div>
                </div>`
    return template;
}

// 다른 사용자가 쓴 메세지를 html에 넣는 함수
function othersSendMessageAddHtml(message) {
    let template = '';
    template = `<div class="others">
                    <div class="user">${message.username}</div>
                    <div class="message-text">${message.text}</div>
                </div>`
    return template;
}

// 채널에 작성된 메세지들을 html에 붙이는 함수 파라미터 messages는 배열
function getAllMessages(messages) {
    // messages가 배열이므로 for문으로 하나씩 꺼낸다
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i]
        let html = '';
        // getAllMessages 함수는 client.getMessages 에서 호출되는데 client.getMessages가 성공하면 messages에 userId가 포함된 정보가 넘어온다, 그리고 로컬스토리지의 userId와 비교한다
        if(message.userId === localStorage.getItem('userId').replaceAll("\"", "")) {
            // 로컬스토리지의 userId와 client.getMessages 에서 넘어오는 userId가 일치하면 내가쓴것이므로 사용자가 쓴 메세지를 불러온다
            html = writerSendMessageAddHtml(message);
            $('.chatArea').append(html);
        } else {
            // 로컬스토리지의 userId와 client.getMessages 에서 넘어오는 userId가 일치하지 않으면 내가쓴것이 아니므로 다른 사용자가 쓴 메세지를 불러온다
            html = othersSendMessageAddHtml(message);
            $('.chatArea').append(html);
        }
    }
    // 채널에 작성된 메세지들을 불러오고 스크롤 다운
    scrollDown();
}

// 이벤트 감지 핸들러 내부에 있는 함수로 상대방의 메시지를 받는 함수
function receiveMessage(message) {
    $('.chatArea').append(othersSendMessageAddHtml(message));
}

// 로그아웃 함수(테스트용)
function logOut() {
    client.logout();
}

// 로그인 상태를 확인하는 함수, 로그인됬으면 true 로그인되지않았으면 false(테스트용)
function isLoggedIn() {
    let isLoggedIn = client.isLoggedIn();
    console.log(isLoggedIn);  // true or false
}

// 채널에서 나가는 함수(테스트용)
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

// 랜덤 아이디를 생성하는 함수
function generateRandomId() {
    return generateRandomString() + '_' + generateRandomString() + '_' + generateRandomString();
}

// 랜덤 아이디를 생성하기 위해 랜덤 스트링을 생성하는 함수
function generateRandomString() {
    // Math.floor() = 숫자 내림, Math.random() = 0~1 사이의 랜덤한 수, 0x10000 = 십육진법 수, 10진법으로는 65536
    return Math.floor((1 + Math.random()) * 0x10000)
        // toString(16)은 10진수를 16진법으로 바꿔준다
        .toString(16)
        // substring(1)은 시작 인덱스(1)부터 문자열 끝부분 까지 문자열을 반환
        .substring(1);
}

// 스크롤 다운 함수, 채팅을 치거나, 채널에 참가했을때 호출
function scrollDown() {
    $('.chatArea').scrollTop($('.chatArea')[0].scrollHeight);
}

// 사용자 닉네임 변경 함수
function updateUser() {
    let newUserName = $('.changeNameInput').val();
    client.updateUser({
        username: newUserName,
    });
    alert("닉네임이 " + newUserName + " (으)로 변경되었습니다")
    $('.layer_popWrap').hide();
}

// 사용자 닉네임 변경시 길이 체크(최대 8글자)해서 경고문 띄우는 함수
function lengthCheck() {
    $(".changeName > input").keydown(function (e) {
        // this는 $(".changeName > input")
        let inputLength = $(this).val().length;
        if(inputLength > 8) {
            alert("닉네임은 8글자를 초과할 수 없습니다")
        }
    })
}

// 사용자 조회를 하고 조회 닉네임이 공백인 경우(최초 진입) 사용자 닉네임 변경 팝업창 띄우는 함수
function layerPopWrap(userId, userName) {
    // 채팅창 클릭시
    $('.enterMessage').click(function (e) {
        // 사용자 조회 api
        $.ajax({
            type: "GET",
            url: "https://api.talkplus.io/v1.4/api/users/" + userId,
            contentType : "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("api-key", appKey)
                xhr.setRequestHeader("app-id", appId)
            },
            success: function (res) {
                console.log("Get User response : " + JSON.stringify(res))
                // 조회 닉네임이 공백인 경우
                if(res.user.username === "") {
                    // 팝업창 띄움
                    $('.layer_popWrap').show();
                }
            },
            error: function (err) {
                console.log("Get User error : " + JSON.stringify(err))
            }
        })
    })
    // 팝업창 x 표시 클릭시
    $('.close_popup > .blind').click(function (e) {
        // 팝업창 닫음
        $('.layer_popWrap').hide();
    })
}