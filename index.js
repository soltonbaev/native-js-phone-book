// ====================DECLARE GLOBALS======================
const API = "https://sltnbv-json-server.herokuapp.com/contacts";

let inputName = document.getElementById("forms_name");
let inputLName = document.getElementById("forms_last-name");
let inputPhone = document.getElementById("forms_phone");
let inputPhoto = document.getElementById("forms_photo");
let addBtn = document.getElementById("forms_btn-add");
let contactList = document.getElementById("names");
let renderedName = document.getElementById("contacts_rendered-name");
let renderedLName = document.getElementById("contacts_rendered-last-name");
let renderedPhone = document.getElementById("contacts_rendered-phone");
let renderedPhoto = document.getElementById("contacts_rendered-photo-wrapper");
let editSpan = document.getElementById("forms_edit-span");
let updateBtn = document.getElementById("forms_btn-update");
let delBtn = document.getElementById("delete");
let newContact = document.getElementById("new");
let contactDetails = document.getElementById("contact-details");
let contactInstructions = document.getElementById("contact-instructions");
let forms = document.getElementById("forms");
let list = document.getElementById("names");
let info = document.getElementById("info");
let selected;
//==================LAUNCH EVENT LISTENERS=====================

forms.addEventListener("click", (e) => {
  if (e.target.id == "forms_btn-add") {
    if (inputName.value === "") {
      info.innerText = "Please, enter the first name at least";
      info.style.color = "red";
      return;
    } else {
      if (inputPhoto.value == "") {
        inputPhoto.value = "./assets/placeholder.jpg";
      }
      setJSON([
        inputName.value,
        inputLName.value,
        inputPhone.value,
        inputPhoto.value,
      ]);
    }
    clearInputs();
  } else if (e.target.id === "forms_btn-update") {
    console.log(selected);
    updateContact(selected.id);
  } else if (e.target.id === "delete") {
    console.log(selected);
    setJSON("delete", selected.id);
    editSpan.classList.add("hidden");
    addBtn.classList.remove("hidden");
    contactDetails.classList.add("hidden");
    contactInstructions.classList.remove("hidden");
    selected.classList.remove("selected");
    clearInputs();
  }
});

//===================LAUNCH APP========================

async function renderNames() {
  info.innerText = "or select existing contact from the list";
  info.style.color = "white";
  contactList.innerText = ""; // clear contact list
  let contacts = await getJSON();
  contacts.forEach((contact) => {
    let li = document.createElement("li");
    contactList.append(li);
    li.innerText = `${contact.name} ${contact.lastName}`;
    li.setAttribute("id", contact.id);
    li.addEventListener("click", async function render(e) {
      await renderContact(contact.id, contact);
    });
  });
}

async function updateContact(id) {
  if (inputPhoto.value == "") {
    inputPhoto.value = "./assets/placeholder.jpg";
  }
  await setJSON(
    [inputName.value, inputLName.value, inputPhone.value, inputPhoto.value],
    id
  );
  await renderNames();
}

async function renderContact(id, contact) {
  if (id && contact && id === contact.id) {
    let liCol = contactList.querySelectorAll("li");
    let currentLi = document.getElementById(id);
    selected = currentLi;
    currentLi.classList.add("selected");
    liCol.forEach((li) => {
      if (li !== currentLi) {
        li.classList.remove("selected");
      }
    });

    contactDetails.classList.remove("hidden");
    contactInstructions.classList.add("hidden");
    renderedName.innerText = contact.name;
    renderedLName.innerText = contact.lastName;
    renderedPhone.innerText = contact.phone;
    renderedPhoto.innerHTML = `<img class = "contacts_photo" src="${contact.photo}">`;
    await editContact(id, contact);
  } else {
    clearInputs();
  }
}

function clearInputs() {
  inputName.value = "";
  inputLName.value = "";
  inputPhone.value = "";
  inputPhoto.value = "";
}

async function editContact(id, contact) {
  addBtn.classList.add("hidden");
  editSpan.classList.remove("hidden");
  inputName.value = contact.name;
  inputLName.value = contact.lastName;
  inputPhone.value = contact.phone;
  inputPhoto.value = contact.photo;
}

async function setJSON(contact, id) {
  if (contact === "delete" && id) {
    const options = {
      method: "DELETE",
    };
    await fetch(`${API}/${id}`, options);
    renderNames();
  } else if (id === undefined) {
    [name, lastName, phone, photo] = contact;
    const contactObj = {
      name: name,
      lastName: lastName,
      phone: phone,
      photo: photo,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactObj),
    };
    await fetch(API, options);
    renderNames();
  } else if (contact && id) {
    [name, lastName, phone, photo] = contact;
    const contactObj = {
      name: name,
      lastName: lastName,
      phone: phone,
      photo: photo,
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactObj),
    };
    await fetch(`${API}/${id}`, options);
  }
}

async function getJSON() {
  let contactsResponse = await fetch(API);
  result = await contactsResponse.json();

  return result;
}

renderNames();
