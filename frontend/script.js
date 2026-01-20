const input = document.querySelector("input");
const btn = document.querySelector("button");
const newnotedetails = document.querySelector("#newnotedetails");
const savebtn = document.querySelector("#save");
const deletebtn = document.querySelector("#discard");
const titleinp = document.querySelector("#title");
const notebody = document.querySelector("#notebody");
const cardscon = document.querySelector("#cards-con");

btn.addEventListener("click", function () {
  console.log("btn clicked");
  newnotedetails.classList.add("active");
});
const API_URL = "http://localhost:5000/api/notes";
let notes = [];
let editableid = null;

const loadNotes = async () => {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    notes = result.data || [];
    renderCards();
  } catch (error) {
    console.log("Error loading notes:", error);
    alert("failed to load notes from backend");
  }
};

const createNote = async (title, content) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({
      title,
      content,
    }),
  });
  const data = await res.json();
  console.log(data);
  return data;
};

savebtn.addEventListener("click", async function () {
  let titleval = titleinp.value;
  let noteval = notebody.value;
  // console.log(titleval);
  // console.log(noteval);
  if (!titleval || !noteval) {
    alert("please enter valid entries");
    return;
  }

  try {
    //update
    if (editableid!== null) {
      const result = await updateNote(editableid, titleval, noteval);

      if (!result.success) {
        alert(result.message || "update failed");
        return;
      }
      alert('updated successfully')
      editableid = null;
      savebtn.textContent = "save";
    } else {
      //createNote
      const result = await createNote(titleval, noteval);
      if (result.success) {
        alert("Note Saved ");
       
      } else {
        alert(result.message || "failed");
        return;
      }
    }
    clearInputs();
     await loadNotes();
      newnotedetails.classList.remove("active");

  } catch (error) {
    console.log("save error",error);
    alert("Something went wrong while saving note")
  }

 
 
});

function renderCards() {
  cardscon.innerHTML = "";
  notes.forEach((note) => {
    const notecard = document.createElement("div");
    const cardtitle = document.createElement("h3");
    const notecontent = document.createElement("p");
    const hr = document.createElement("hr");
    const editbtn = document.createElement("button");
    const deletecardbtn = document.createElement("button");
    notecard.classList.add("cardstyle");

    cardtitle.textContent = `${note.title}`;
    notecontent.textContent = `${note.content}`;
    editbtn.textContent = `edit`;
    deletecardbtn.textContent = `delete`;

    notecard.append(cardtitle, notecontent, hr, editbtn, deletecardbtn);

    cardscon.appendChild(notecard);

    editbtn.addEventListener("click", function () {
      console.log(note._id);
      editable(note._id);
    });
    deletecardbtn.addEventListener("click", function () {
      deletecard(note._id);
    });
  });
}

function clearInputs() {
  titleinp.value = "";
  notebody.value = "";
}

async function updateNote(id, title, content) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  console.log(res)
  return res.json();
}
function editable(id) {
  const note = notes.find((n) => n._id === id);
  if (!note) {
    console.log("note not found")
    return;
  }

  editableid = id;
  titleinp.value = note.title;
  notebody.value = note.content;

  newnotedetails.classList.add("active");
  savebtn.textContent = "update";
}
async function deletecard(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!result.success) {
    alert(result.message || "Delete failed");
    return;
  }
  await loadNotes();
}

loadNotes();
