const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.getElementById("ul");

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const lists = document.querySelectorAll("li");
    for(i=0;i<lists.length;i++){
       lists[i].remove()
    }
    const token = input.value;
  



    for(i=0;i<temp;i++){
        const random = Math.floor(Math.random() * temp_data.length);
        const li = document.createElement("li");
        li.innerText = temp_data[random];
        li.classList.add("list-group-item")  

        ul.appendChild(li);
    }
});