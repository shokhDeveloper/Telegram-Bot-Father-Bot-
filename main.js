"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AUTORIZHATION_URL = "https://api.telegram.org/bot";
const BOT_TOKEN = "6401693836:AAGHYEvahQWQOnb2U_im_Mdrrjas7jNsCcc";
const elList = document.querySelector("ul");
const elLiTemplate = document.querySelector("template").content;
const myChatId = {
    id: 1500754703
};
const elForm = document.querySelector("form");
let resultFromUser = [];
// const handleResponseChatId = (response:chatResponse[]) => {
//     // const result :chatResponse = {
//     // }
//     // response?.map((item) => {
//     //         handleSendMesage(item.message?.chat?.id)
//         // if(result){
//         //     result.update_id = item.update_id
//         //     result.message = {
//         //         chat : {
//         //             first_name: item.message?.chat?.first_name,
//         //             id: item.message?.chat?.id,
//         //             username: item.message?.chat?.username
//         //         }
//         //     }
//         // }
//     // })
//     // resultFromUser = [...resultFromUser, result]
//     // console.log(resultFromUser)
// }
const handleRenderData = (datas) => {
    var _a, _b, _c, _d, _e;
    if (datas === null || datas === void 0 ? void 0 : datas.length) {
        const fragment = document.createDocumentFragment();
        elList.innerHTML = '';
        for (const userData of datas) {
            const clone = elLiTemplate.cloneNode(true);
            const userName = clone.querySelector(".username");
            userName.textContent = ((_b = (_a = userData.message) === null || _a === void 0 ? void 0 : _a.chat) === null || _b === void 0 ? void 0 : _b.username) || ((_d = (_c = userData.message) === null || _c === void 0 ? void 0 : _c.chat) === null || _d === void 0 ? void 0 : _d.first_name);
            const userText = clone.querySelector(".message");
            userText.textContent = (_e = userData.message) === null || _e === void 0 ? void 0 : _e.text;
            fragment.append(clone);
        }
        elList.append(fragment);
    }
};
const handleSendMesage = (users, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        users === null || users === void 0 ? void 0 : users.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const request = yield fetch(AUTORIZHATION_URL + BOT_TOKEN + "/sendMessage", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: (_b = (_a = item.message) === null || _a === void 0 ? void 0 : _a.chat) === null || _b === void 0 ? void 0 : _b.id,
                    text: `${text}`
                })
            });
            const response = yield request.json();
            console.log(response);
        }));
    }
    catch (error) {
        return Promise.reject(error);
    }
});
const handleUpdatesBot = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield fetch(AUTORIZHATION_URL + BOT_TOKEN + "/getUpdates", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                allowed_updates: ["message", "image"]
            })
        });
        if (request.status === 200) {
            const response = yield request.json();
            handleRenderData(response.result);
            return Promise.resolve(response.result);
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
const handleSub = (evt) => __awaiter(void 0, void 0, void 0, function* () {
    evt.preventDefault();
    const data = new FormData(evt.target);
    try {
        const users = yield handleUpdatesBot();
        handleSendMesage(users, data.get("value"));
    }
    catch (error) {
        console.log(error);
    }
});
elForm.addEventListener("submit", handleSub);
setInterval(() => {
    handleUpdatesBot();
}, 1000);
