const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.getElementById("ul");

form.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const lists = document.querySelectorAll("li");
    for(i=0;i<lists.length;i++){
       lists[i].remove()
    }

    const li = document.createElement("li");
    li.innerText = "Connecting....";
    li.classList.add("list-group-item")  
    ul.appendChild(li);

    await websocket()
});

async function websocket(){
  const token = input.value;

  const ws = new WebSocket("wss://ugc.renorari.net/api/v1/gateway");

  ws.addEventListener("close", (code, reason)=>{
    const li = document.createElement("li");
    li.innerText = `LOG:${code} ${reason}`;
    li.classList.add("list-group-item")  
    ul.appendChild(li);

    setTimeout(() =>{
      websocket();
    }, 10000);
    return;
  });
    
  ws.addEventListener("error", (error)=>{
      const li = document.createElement("li");
      li.innerText = `LOG:${error}`;
      li.classList.add("list-group-item")  
      ul.appendChild(li);
      return;
  });

  ws.addEventListener("message", (rawData)=>{
    const _data = (new Zlib.Gunzip(rawData).decompress());
    console.log(_data)
    const data = JSON.parse(_data);
    console.log(data)
    if(data.type === "hello"){
      const send = (new Zlib.Gzip(JSON.stringify({
        "type": "identify",
        "data": {
          "token": token
        }
      }))).compress();
          
      ws.send(send,(err)=>{
        if(!err) return; 
          const li = document.createElement("li");
          li.innerText = `LOG:${err}`;
          li.classList.add("list-group-item")  
          ul.appendChild(li);
      });
    }else if(data.type === "message"){
      const msg = data.data.data

      const li = document.createElement("li");
      li.innerText =`${msg.author.username}#${msg.author.discriminator}:${msg.message.content}`;
      li.classList.add("list-group-item")  
      ul.appendChild(li);

    }else if(data.type === "identify"){
      if(!data.success){
        const li = document.createElement("li");
        li.innerText = "LOG:No Ready";
        li.classList.add("list-group-item")  
        ul.appendChild(li);
        return;
      }
      const li = document.createElement("li");
      li.innerText = "LOG:Ready";
      li.classList.add("list-group-item")  
      ul.appendChild(li);
      return;

    }else if(data.type === "heartbeat"){
      return
    }
  });
}