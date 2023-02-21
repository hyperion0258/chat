const apiKey = "7bec7db09e4952a18eee3ee717d0593c94bd2d2dfa7f1fe10c6e3ff1a9d7b2ba"
const appId = "2052a7e3-6110-4a2a-8cfd-ae58d3f57394"
let userId = ""
let userName = ""
let password = ""
let loginToken = ""
const channelName = "sb_test_channel_name"
const channelId = "sb_test_channel_id"
const client = new TalkPlus.Client({appId: appId});

// function createUser() {
//     userId = document.querySelector('.userId').value;
//     userName = document.querySelector('.userName').value;
//     password = document.querySelector('.password').value;
//     fetch("https://api.talkplus.io/v1.4/api/users/create", {
//         method: "POST",
//         headers: {
//             "content-type": "application/json",
//             "api-key": apiKey,
//             "app-id": appId
//         },
//         body: JSON.stringify({
//             userId: userId,
//             password: password,
//             username: userName
//         }),
//     })
//         .then((data) => {
//             console.log(data)
//         })
//         .catch((error) => {
//             console.error(error)
//         })
// }

function createUser() {
    userId = document.querySelector('.userId').value;
    userName = document.querySelector('.userName').value;
    password = document.querySelector('.password').value;
    $.ajax({
        type: "POST",
        url: "https://api.talkplus.io/v1.4/api/users/create",
        beforeSend: function (xhr) {
            console.log("api-key",apiKey)
            console.log("app-id",appId)
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("api-key",apiKey);
            xhr.setRequestHeader("app-id",appId);
        },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            userId: userId,
            password: password,
            username: userName
        }),
        success: function (res) {
            console.log(res);
        },
        error: function (err) {
            console.error(err);
        }
    });
}


function logOut() {
    client.logout();
}

function isLoggedIn() {
    const isLoggedIn = client.isLoggedIn();
    console.log(isLoggedIn);  // true or false
}

function createChannel() {
    client.createChannel({
        channelId: channelId,
        name: channelName,
        type: "public"
    })
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err)
        })
}

function getChannel() {
    client.getChannel({
        channelId: channelId,
    })
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err)
        })
}

function joinChannel() {
    client.joinChannel({
        channelId: channelId
    })
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err)
        })
}

function leaveChannel() {
    client.leaveChannel({
        channelId: channelId
    })
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err)
        })
}

function sendMessage() {
    client.sendMessage({
        channelId: channelId,
        type: 'text',
        text: '안녕하세요?'
    })
        .then((response) => {
            console.log(response.message.text)
        })
        .catch((err) => {
            console.log(err)
        })
}