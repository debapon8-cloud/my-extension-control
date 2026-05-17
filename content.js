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

if(await stopped()){
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
{bubbles:true}
));

}

await sleep(2500);

let btn=
document.querySelector(
'[data-testid="baseform-submit-button"]'
)

||

[...document.querySelectorAll(
"button"
)]

.find(x=>

x.innerText
?.toLowerCase()
.includes("confirm")

||

x.innerText
?.toLowerCase()
.includes("register")

);

if(btn){

btn.click();

emails.shift();

await chrome.storage.local.set({

emails,
sentCount:
(data.sentCount||0)+1

});

}

await sleep(
Number(data.delay)||5000
);

}

})();
