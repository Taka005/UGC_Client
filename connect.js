const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.getElementById("ul");

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const lists = document.querySelectorAll("li");
    for(i=0;i<lists.length;i++){
       lists[i].remove()
    }
    
    websocket()
});

function websocket(){
    const token = input.value;

    const ws = new Websocket("wss://ugc.renorari.net/api/v1/gateway");

    ws.addEventListener("close", (code, reason)=>{
      setTimeout(() =>{
        websocket();
      }, 10000);
      const li = document.createElement("li");
      li.innerText = `LOG:${code} ${reason}`;
      li.classList.add("list-group-item")  
      ul.appendChild(li);
    });
    
    ws.addEventListener("error", (error)=>{
        const li = document.createElement("li");
        li.innerText = `LOG:${error}`;
        li.classList.add("list-group-item")  
        ul.appendChild(li);
        return;
    });

    ws.addEventListener("message", (rawData)=>{

      Zlib.inflate(rawData, (err,_data) =>{
        if(!err){
            const li = document.createElement("li");
            li.innerText = `LOG:${err}`;
            li.classList.add("list-group-item")  
            ul.appendChild(li);
            return;
        }
        let data = JSON.parse(_data);
        if(data.type === "hello"){
          ws.send(Zlib.deflateSync(JSON.stringify({
            "type": "identify",
            "data": {
              "token": token
            }
            }),(err)=>{
              if(!err) return; 
              const li = document.createElement("li");
              li.innerText = `LOG:${err}`;
              li.classList.add("list-group-item")  
              ul.appendChild(li);
            }
          ));
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
    });
  }
  websocket()