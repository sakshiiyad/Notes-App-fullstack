// ==============================
// 1) DOM ELEMENTS
// ==============================
const input = document.querySelector("input");
const btn = document.querySelector("button");
const newnotedetails = document.querySelector("#newnotedetails");
const savebtn = document.querySelector("#save");
const deletebtn = document.querySelector("#discard");
const titleinp = document.querySelector("#title");
const notebody = document.querySelector("#notebody");
const cardscon = document.querySelector("#cards-con");

// ==============================
// 2) BACKEND API URL
// ==============================
const API_URL = "http://localhost:5000/api/notes";

// ==============================
// 3) STATE
// ==============================
let notes = [];
let editableid = null;

// ==============================
// 4) OPEN NEW NOTE FORM
// ==============================
btn.addEventListener("click", function () {
  newnotedetails.classList.add("active");
});

// OPTIONAL: discard button if you want
if (deletebtn) {
  deletebtn.addEventListener("click", function () {
    clearInputs();
    editableid = null;
    savebtn.textContent = "save";
    newnotedetails.classList.remove("active");
  });
}

// ==============================
// 5) API CALLS
// ==============================
async function loadNotes() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();

    notes = result.data || [];
    renderCards();
  } catch (error) {
    console.log("Error loading notes:", error);
    alert("Failed to load notes from backend");
  }
}

async function createNote(title, content) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  return res.json();
}

async function updateNote(id, title, content) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  return res.json();
}

async function deleteNote(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return res.json();
}

// ==============================
// 6) SAVE BUTTON (CREATE / UPDATE)
// ==============================
savebtn.addEventListener("click", async function () {
  let titleval = titleinp.value.trim();
  let noteval = notebody.value.trim();

  if (!titleval || !noteval) {
    alert("please enter valid entries");
    return;
  }

  try {
    // UPDATE
    if (editableid !== null) {
      const result = await updateNote(editableid, titleval, noteval);

      if (!result.success) {
        alert(result.message || "Update failed");
        return;
      }

      editableid = null;
      savebtn.textContent = "save";
    }
    // CREATE
    else {
      const result = await createNote(titleval, noteval);

      if (!result.success) {
        alert(result.message || "Create failed");
        return;
      }
    }

    clearInputs();
    await loadNotes(); // refresh UI from backend
    newnotedetails.classList.remove("active");
  } catch (error) {
    console.log("Save error:", error);
    alert("Something went wrong while saving note");
  }
});

// ==============================
// 7) RENDER CARDS
// ==============================
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

    // MongoDB fields: note.title, note.content
    cardtitle.textContent = note.title;
    notecontent.textContent = note.content;

    editbtn.textContent = "edit";
    deletecardbtn.textContent = "delete";

    notecard.append(cardtitle, notecontent, hr, editbtn, deletecardbtn);
    cardscon.appendChild(notecard);

    // EDIT
    editbtn.addEventListener("click", function () {
      editable(note._id);
    });

    // DELETE
    deletecardbtn.addEventListener("click", function () {
      deletecard(note._id);
    });
  });
}

// ==============================
// 8) EDIT HANDLER
// ==============================
function editable(id) {
  const note = notes.find((n) => n._id === id);
  if (!note) return;

  editableid = id;

  // MongoDB fields
  titleinp.value = note.title;
  notebody.value = note.content;

  newnotedetails.classList.add("active");
  savebtn.textContent = "update";
}

// ==============================
// 9) DELETE HANDLER
// ==============================
async function deletecard(id) {
  try {
    const result = await deleteNote(id);

    if (!result.success) {
      alert(result.message || "Delete failed");
      return;
    }

    await loadNotes();
  } catch (error) {
    console.log("Delete error:", error);
    alert("Something went wrong while deleting");
  }
}

// ==============================
// 10) HELPERS
// ==============================
function clearInputs() {
  titleinp.value = "";
  notebody.value = "";
}

// ==============================
// 11) INITIAL LOAD
// ==============================
loadNotes();
