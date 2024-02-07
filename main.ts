const AUTORIZHATION_URL:string = "https://api.telegram.org/bot"
const BOT_TOKEN:string = "6401693836:AAGHYEvahQWQOnb2U_im_Mdrrjas7jNsCcc"
const elList = document.querySelector("ul") as HTMLUListElement
const elLiTemplate = (document.querySelector("template") as HTMLTemplateElement).content
type chatid = {
    id?: number ;
    first_name?: string,
    username?:string
}
type chatResponse = {
    update_id?: number,
    message?: {
        chat?: chatid,
        text?: string
    }
}
const myChatId:chatid = {
    id: 1500754703
}
const elForm = document.querySelector("form") as HTMLFormElement;
let resultFromUser: chatResponse[] = []
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
const handleRenderData = (datas:chatResponse[]):void => {
    if(datas?.length){
        const fragment = document.createDocumentFragment() as DocumentFragment
        elList.innerHTML = ''
        for (const userData of datas) {
            const clone = elLiTemplate.cloneNode(true) as DocumentFragment
            const userName = clone.querySelector(".username") as HTMLParagraphElement
            userName.textContent = userData.message?.chat?.username || userData.message?.chat?.first_name as string
            const userText = clone.querySelector(".message") as HTMLParagraphElement
            userText.textContent = userData.message?.text as string
           fragment.append(clone) 
        }
        elList.append(fragment)
    }
}
const handleSendMesage = async (users:chatResponse[], text: string ):Promise<void> => {
    try{
        users?.map(async (item) => {
            const request = await fetch(AUTORIZHATION_URL + BOT_TOKEN + "/sendMessage", {
                method: "POST",
                headers:{
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: item.message?.chat?.id,
                    text:  `${text}`
                })
            })
            const response = await request.json()
            console.log(response)
        })
    }catch(error){
        return Promise.reject(error)
    }
    
}
const handleUpdatesBot = async ():Promise<void> | never => {
    try{
        const request = await fetch(AUTORIZHATION_URL + BOT_TOKEN + "/getUpdates", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                allowed_updates: ["message", "image"]
            })
        })
        if(request.status === 200){
            const response = await request.json()
            handleRenderData(response.result)
            return Promise.resolve(response.result)
        }
    }catch(error){
        return Promise.reject(error)
    }
}
const handleSub = async (evt:SubmitEvent):Promise<void> => {
    evt.preventDefault()
    const data = new FormData(evt.target as HTMLFormElement)
    try{
        const users:chatResponse[] | any = await handleUpdatesBot()
        handleSendMesage(users, data.get("value") as string) 
    }catch(error){
        console.log(error)
    }
}
elForm.addEventListener("submit", handleSub)

setInterval(() => {
    handleUpdatesBot()
}, 1000)