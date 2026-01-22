const input = document.querySelector("input");
const btn = document.querySelector("#newNoteBtn");
const newnotedetails = document.querySelector("#newnotedetails");
const savebtn = document.querySelector("#save");
const deletebtn = document.querySelector("#discard");
const titleinp = document.querySelector("#title");
const notebody = document.querySelector("#notebody");
const cardscon = document.querySelector("#cards-con");
const appSection = document.querySelector("#appSection");
const authSection = document.querySelector("#authSection");
const signupName = document.querySelector("#signupName");
const signupEmail = document.querySelector("#signupEmail");
const signupPassword = document.querySelector("#signupPassword");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const authBtn = document.querySelector(".authBtn");
const signupTab = document.querySelector("#signupTab");
const loginTab = document.querySelector("#loginTab");
const signupform = document.querySelector("#signupForm");
const loginform = document.querySelector("#loginForm");
const logoutBtn = document.querySelector("#logoutBtn");

//IMP URLs
const BASE_URL = "http://localhost:5000";
const API_URL = "http://localhost:5000/api/notes";
const AUTH_API = `http://localhost:5000/auth`;
const SIGNUP_URL = `${AUTH_API}/signup`;
const LOGIN_URL = `${AUTH_API}/login`;

//switching tabs js logic
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginform.classList.remove("hidden");
  signupform.classList.add("hidden");
});
signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupform.classList.remove("hidden");
  loginform.classList.add("hidden");
});

//signup form handling and API call to backend
signupform.addEventListener("submit", async (e) => {
  e.preventDefault();
  let signupname = signupName.value;
  let signupemail = signupEmail.value;
  let signuppass = signupPassword.value;
  console.log("Signup Values:", signupname, signupemail, signuppass);
  if (!signupname || !signupemail || !signuppass) {
    alert("All fields are required");
    return;
  }
  //API call
  const res = await fetch(SIGNUP_URL, {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({
      name: signupname,
      email: signupemail,
      password: signuppass,
    }),
  });
  const result = await res.json();
  console.log(result);
  if (!result.success) {
    alert("user could not signup");
    return;
  }
  if (result.token) {
    localStorage.setItem("token", result.token);
    appSection.classList.remove("hidden");
    authSection.classList.add("hidden");
    loadNotes();
  }
});

loginform.addEventListener("submit", async (e) => {
  e.preventDefault();
  let loginemail = loginEmail.value;
  let loginpass = loginPassword.value;
  // console.log(loginemail)
  // console.log(loginpass)
  if (!loginemail || !loginpass) {
    alert("All fields are required");
    return;
  }
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({
      email: loginemail,
      password: loginpass,
    }),
  });
  const result = await res.json();
  console.log(result);
  if (!result.success) {
    alert("Error in login occurs");
    return;
  }
  const token = result.token;
  localStorage.setItem("token", token);
  authSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  loadNotes();
});

//logout logic

function clearUIafterLogout() {
  notes = [];
  editableid = null;
  titleinp.value = "";
  notebody.value = "";

  newnotedetails.classList.remove("active");
  cardscon.innerHTML = "";
  savebtn.textContent = "save";
}
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  clearUIafterLogout();
  appSection.classList.add("hidden");
  authSection.classList.remove("hidden");
});

btn.addEventListener("click", function () {
  console.log("btn clicked");
  newnotedetails.classList.add("active");
});

const autologin = () => {
  const token = localStorage.getItem("token");
  if (token) {
    authSection.classList.add("hidden");
    appSection.classList.remove("remove");
    loadNotes();
  } else {
    authSection.classList.add("active");
    appSection.classList.add("hidden");
  }
};

let notes = [];
let editableid = null;

const loadNotes = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    const result = await res.json();
    notes = result.data || [];
    renderCards();
  } catch (error) {
    console.log("Error loading notes:", error);
    alert("failed to load notes from backend");
  }
};

const createNote = async (title, content) => {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "content-Type": "application/json", Authorization: `${token}` },
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
    if (editableid !== null) {
      const result = await updateNote(editableid, titleval, noteval);

      if (!result.success) {
        alert(result.message || "update failed");
        return;
      }
      alert("updated successfully");
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
    console.log("save error", error);
    alert("Something went wrong while saving note");
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
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `${token}` },
    body: JSON.stringify({ title, content }),
  });
  console.log(res);
  return res.json();
}
function editable(id) {
  const note = notes.find((n) => n._id === id);
  if (!note) {
    console.log("note not found");
    return;
  }

  editableid = id;
  titleinp.value = note.title;
  notebody.value = note.content;

  newnotedetails.classList.add("active");
  savebtn.textContent = "update";
}
async function deletecard(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "content-Type": "application/json", Authorization: `${token}` },
  });
  const result = await res.json();
  if (!result.success) {
    alert(result.message || "Delete failed");
    return;
  }
  await loadNotes();
}

autologin();
