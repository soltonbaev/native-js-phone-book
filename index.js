// ====================DECLARE GLOBALS======================
const API = "https://sltnbv-json-server.herokuapp.com/contacts";

let inputName = document.getElementsByClassName("contacts__input-name")[0];
let inputLName = document.getElementsByClassName("contacts__input-lname")[0];
let inputPhone = document.getElementsByClassName("contacts__input-phone")[0];
let inputPhoto = document.getElementsByClassName("contacts__input-photo")[0];
let addBtn = document.getElementsByClassName("contacts__btn-add")[0];
let contactList = document.getElementsByClassName("contacts__list")[0];
let renderedName = document.getElementsByClassName("contacts__info-name")[0];
let renderedLName = document.getElementsByClassName("contacts__info-lname")[0];
let renderedPhone = document.getElementsByClassName("contacts__info-phone")[0];
let renderedPhoto = document.getElementsByClassName("contacts__info-photo")[0];
let editSpan = document.getElementsByClassName("contacts__edit-buttons")[0];
let updateBtn = document.getElementsByClassName("contacts__btn-update")[0];
let delBtn = document.getElementsByClassName("contacts__btn-delete")[0];
let newContact = document.getElementsByClassName("contacts__btn-new")[0];
let contactDetails = document.getElementsByClassName(
  "contacts__info-wrapper"
)[0];
let contactInstructions = document.getElementsByClassName("contacts__help")[0];
let forms = document.getElementsByClassName("contacts__forms")[0];
let info = document.getElementsByClassName("contacts__help-info")[0];
let details = document.getElementsByClassName("contacts__details")[0];
let detailsClose = document.getElementsByClassName(
  "contacts__details_close"
)[0];
let selected;
//==================LAUNCH EVENT LISTENERS=====================

details.addEventListener("click", (e) => {
  if (e.target.classList.contains("contacts__btn-add")) {
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
  } else if (e.target.classList.contains("contacts__btn-update")) {
    console.log(selected);
    updateContact(selected.id);
    details.classList.remove("contacts__details_mobile");
  } else if (e.target.classList.contains("contacts__btn-delete")) {
    console.log(selected);
    setJSON("delete", selected.id);
    resetForms();
    clearInputs();
    details.classList.remove("contacts__details_mobile");
  } else if (e.target.classList.contains("contacts__btn-new")) {
    clearInputs();
    resetForms();
  } else if (e.target.classList.contains("contacts__details-close")) {
    details.classList.remove("contacts__details_mobile");
  }
});

function resetForms() {
  editSpan.classList.add("contacts__element_hidden");
  addBtn.classList.remove("contacts__element_hidden");
  contactDetails.classList.add("contacts__element_hidden");
  contactInstructions.classList.remove("contacts__element_hidden");
  selected.classList.remove("contacts__list-item_selected");
}
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
      details.classList.add("contacts__details_mobile");
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
    currentLi.classList.add("contacts__list-item_selected");
    liCol.forEach((li) => {
      if (li !== currentLi) {
        li.classList.remove("contacts__list-item_selected");
      }
    });

    contactDetails.classList.remove("contacts__element_hidden");
    contactInstructions.classList.add("contacts__element_hidden");
    renderedName.innerText = contact.name;
    renderedLName.innerText = contact.lastName;
    renderedPhone.innerText = contact.phone;
    renderedPhoto.innerHTML = `<img class = "contacts__photo" src="${contact.photo}">`;
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
  addBtn.classList.add("contacts__element_hidden");
  editSpan.classList.remove("contacts__element_hidden");
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
