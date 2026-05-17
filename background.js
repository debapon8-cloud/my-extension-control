async function checkStatus(){

try{

const res=await fetch(
"https://raw.githubusercontent.com/debapon8-cloud/my-extension-control/main/status.json"
);

const data=await res.json();

await chrome.storage.local.set({
enabled:data.enabled
});

console.log(
"Status:",
data.enabled
);

}catch(e){

console.log(e);

}

}

checkStatus();

setInterval(
checkStatus,
10000
);
