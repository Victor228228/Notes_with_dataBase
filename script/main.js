function Notes () {
    this.buttonAdd = document.querySelector(".button_add_notes");
    this.wrapperNotes = document.querySelector(".wrapper_notes");
}
Notes.prototype.start = function () {
    this.geNotesFromSever("http://localhost:3000/notes")
        .then(data => {
            data.forEach(function (item) {
                myNotes.wrapperNotes.insertAdjacentHTML("beforeend", `
                    <div class="note animate__bounceIn">
                        <div class="note_title">
                          <p class="note_data">${item.time}</p>
                          <div class="note_buttons">
                            <a href="" class="note_button_change">
                              <img src="./img/ok.svg" alt="">
                            </a>
                            <a href="" class="note_button_delete">
                              <img src="./img/delete.svg" alt="">
                            </a>
                          </div>
                        </div>
                        <div class="note_description">
                          <textarea class="note_input">${item.text}</textarea>
                        </div>
                    </div>
                `);
            });
        });
    this.buttonAdd.addEventListener("click", function (event) {
        myNotes.noteRender();
    });
    this.catchEvents();
}
Notes.prototype.noteRender = function () {
    let dataNow = new Date();
    myNotes.wrapperNotes.insertAdjacentHTML("beforeend", `
        <div class="note animate__bounceIn">
            <div class="note_title">
              <p class="note_data">${dataNow}</p>
              <div class="note_buttons">
                <a href="" class="note_button_change">
                  <img src="./img/ok.svg" alt="">
                </a>
                <a href="" class="note_button_delete">
                  <img src="./img/delete.svg" alt="">
                </a>
              </div>
            </div>
            <div class="note_description">
              <textarea class="note_input"></textarea>
            </div>
        </div>
    `);
    let object = {
        time: dataNow.toString(),
        text: ""
    }
    myNotes.postNotesToSever(JSON.stringify(object));
}
Notes.prototype.catchEvents = function () {
    const that = this;
    window.addEventListener("click", function (event) {
        event.preventDefault();
        const target = event.target;
        if (target.closest(".note_input")) {
            const pic = target.closest(".note_input").closest(".note").children[0].children[1].children[0].children[0];
            pic.src = "./img/edit.svg";
            pic.classList.add("active_change");
            const noteWrapper = target.closest(".note_input").closest(".note");
            if (!noteWrapper.querySelector(".save_changed")) {
                noteWrapper.insertAdjacentHTML("beforeend", `
                <div class="save_changed">
                     <button>Save changed</button>
                </div>
                `);
                const buttonSaveChange = noteWrapper.querySelector(".save_changed");
                buttonSaveChange.addEventListener("click", function (event) {
                    pic.src = "./img/ok.svg";
                    const currentInput = noteWrapper.querySelector(".note_input");
                    that.geNotesFromSever("http://localhost:3000/notes")
                        .then(data => {
                            data.forEach(function (item) {
                                if (item.time === noteWrapper.querySelector(".note_data").textContent) {
                                    item.text = currentInput.value;
                                    console.log(currentInput.value)
                                    item.time = new Date().toString();
                                    let id = item.id;
                                    console.log(id)
                                    that.pushNotesToSever(JSON.stringify(item), id);
                                }
                            });
                        });
                    buttonSaveChange.remove();
                });
            }
        }
        if (target.closest(".note_button_delete img")) {
            console.log("deleeee")
            that.geNotesFromSever("http://localhost:3000/notes")
                .then(data => {
                    data.forEach(function (item) {
                        if (item.time === target.closest(".note_button_delete img").closest(".note").querySelector(".note_data").textContent) {
                            let id = item.id;
                            console.log(id)
                            that.deleteNotesFromServer(id);
                        }
                    });
                    target.closest(".note_button_delete img").closest(".note").remove();
                });
        }
    });
}

Notes.prototype.geNotesFromSever = async function (url) {
    let res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, статус: ${res.status}`);
    }
    return await res.json();
}
Notes.prototype.postNotesToSever = async function (object) {
    await fetch("http://localhost:3000/notes/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json'
        },
        body: object
    });
}
Notes.prototype.pushNotesToSever = async function (object, id) {
    await fetch("http://localhost:3000/notes/"+id , {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json'
        },
        body: object
    });
}
Notes.prototype.deleteNotesFromServer = async function (id) {
    await fetch("http://localhost:3000/notes/" + id, {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json'
        }
    })
}

const myNotes= new Notes();
myNotes.start();
