(async()=>{

const s=await chrome.storage.local.get([
"enabled"
]);

if(s.enabled===false){

console.log(
"Extension disabled"
);

return;

}

const saved=
await chrome.storage.local.get(
["sessionId"]
);

const myId=
saved.sessionId;

function sleep(ms){
return new Promise(
r=>setTimeout(r,ms)
);
}

async function stopped(){

const x=
await chrome.storage.local.get([
"running",
"sessionId"
]);

return(
!x.running ||
x.sessionId!==myId
);

}

while(true){

let state=
await chrome.storage.local.get([
"enabled"
]);

if(state.enabled===false){

console.log(
"Remote disabled"
);

return;

}

if(await stopped()){
console.log("Stopped");
return;
}

let data=
await chrome.storage.local.get([
"emails",
"delay",
"sentCount"
]);

let emails=
data.emails||[];

if(!emails.length){

await chrome.storage.local.set({
running:false
});

return;

}

let email=
emails[0];

let input=
document.querySelector(
'input[type="email"]'
);

if(input){

input.focus();

const setter=
Object
.getOwnPropertyDescriptor(
HTMLInputElement.prototype,
"value"
).set;

setter.call(
input,
email
);

input.dispatchEvent(
new Event(
"input",
{
bubbles:true
}));

input.dispatchEvent(
new Event(
"change",
{
bubbles:true
}));

}

await sleep(2500);

if(await stopped()){
return;
}

let confirmBtn=

document.querySelector(
'[data-testid="baseform-submit-button"]'
)

||

[...document.querySelectorAll(
"button"
)]
.find(btn=>

btn.innerText
?.toLowerCase()
.includes("confirm")

||

btn.innerText
?.toLowerCase()
.includes("register")

||

btn.innerText
?.toLowerCase()
.includes("join")

);

if(confirmBtn){

confirmBtn
.scrollIntoView({
block:"center"
});

await sleep(500);

confirmBtn.click();

console.log(
"confirm clicked"
);

}

let d=
Number(
data.delay
)||5000;

for(
let i=0;
i<d/500;
i++
){

let check=
await chrome.storage.local.get([
"enabled"
]);

if(
check.enabled===false
){
return;
}

if(await stopped()){
return;
}

await sleep(500);

}

let add=

[...document.querySelectorAll(
"button"
)]

.find(x=>

x.textContent
?.includes(
"Add a new registrant"
)

);

if(add){

add.click();

emails.shift();

await chrome.storage.local.set({

emails,

sentCount:
(data.sentCount||0)+1

});

}

await sleep(1000);

}

})();
