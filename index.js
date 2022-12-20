/*Сделать контактную книжку с использованием  Dom и  Json Server

Нужно реализовать:

Нужно реализовать CRUD:
1)добавление
2) отображение
3) редактирование
4) удаление

При создании должно быть 4 инпута:
1) Имя контакта
2) фамилия
3) номер телефона
4) фото контакта

При сдаче прикрепить ссылку на гитхаб (zip, stackblitz и тд не будут приняты) */

async function setJSON(contact, id) {
  // console.log("Updating JSON server...");
  let endpoint = "http://localhost:8000/contacts/";
  if (contact === "delete" && id) {
    console.log("Deleting a contact...");
    const options = {
      method: "DELETE",
    };
    await fetch(`${endpoint}${id}`, options);
    await renderNames();
  } else if (id === undefined) {
    console.log("Creating a new contact...");
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
    await fetch(endpoint, options);
    await renderNames();
  } else if (contact && id) {
    console.log("Updating a contact...");
    [name, lastName, phone, photo] = contact;
    const contactObj = {
      name: name,
      lastName: lastName,
      phone: phone,
      photo: photo,
    };
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactObj),
    };
    await fetch(`${endpoint}${id}`, options);
    await renderNames();
    await renderContact(id, contactObj);
  }
}

async function getJSON() {
  let contactsResponse = await fetch("http://localhost:8000/contacts");
  result = await contactsResponse.json();
  return result;
}

function grabForms() {
  let inputName = document.getElementById("forms_name");
  let inputLName = document.getElementById("forms_last-name");
  let inputPhone = document.getElementById("forms_phone");
  let inputPhoto = document.getElementById("forms_photo");
  let inputBtn = document.getElementById("forms_btn-add");
  inputBtn.addEventListener("click", function addNew() {
    if (inputPhoto.value == "") {
      inputPhoto.value = "./assets/placeholder.jpg";
    }
    setJSON([
      inputName.value,
      inputLName.value,
      inputPhone.value,
      inputPhoto.value,
    ]);
  });
}

async function renderNames() {
  console.log("Rendering list of contacts...");
  let names = document.getElementById("names");
  names.innerText = "";
  let contacts = await getJSON();
  contacts.forEach((contact) => {
    let li = document.createElement("li");
    names.append(li);
    li.innerText = `${contact.name} ${contact.lastName}`;
    li.addEventListener("click", () => {
      renderContact(contact.id, contact);
    });
  });
}
async function renderContact(id, contact) {
  let renderedName = document.getElementById("contacts_rendered-name");
  let renderedLName = document.getElementById("contacts_rendered-last-name");
  let renderedPhone = document.getElementById("contacts_rendered-phone");
  let renderedPhoto = document.getElementById(
    "contacts_rendered-photo-wrapper"
  );

  if (id === contact.id) {
    renderedName.innerText = contact.name;
    renderedLName.innerText = contact.lastName;
    renderedPhone.innerText = contact.phone;
    renderedPhoto.innerHTML = `<img class = "contacts_photo" src="${contact.photo}">`;
  }
  editContact(id, contact);
  await deleteContact(id);
}

async function deleteContact(id) {
  let del = document.getElementById("delete");

  del.addEventListener("click", async function del() {
    console.log("Clicking delete button...");
    await setJSON("delete", id);
  });
  del.removeEventListener("click", del);
}

function editContact(id, contact) {
  let inputName = document.getElementById("forms_name");
  let inputLName = document.getElementById("forms_last-name");
  let inputPhone = document.getElementById("forms_phone");
  let inputPhoto = document.getElementById("forms_photo");
  let editSpan = document.getElementById("forms_edit-span");
  let inputBtn = document.getElementById("forms_btn-add");
  inputBtn.classList.add("toggle");
  let updateBtn = document.getElementById("forms_btn-update");
  editSpan.classList.remove("toggle");
  inputName.value = contact.name;
  inputLName.value = contact.lastName;
  inputPhone.value = contact.phone;
  inputPhoto.value = contact.photo;
  updateBtn.innerText = "Update";
  updateBtn.addEventListener("click", async function update() {
    if (inputPhoto.value == "") {
      inputPhoto.value = "./assets/placeholder.jpg";
    }
    await setJSON(
      [inputName.value, inputLName.value, inputPhone.value, inputPhoto.value],
      id
    );
    // updateBtn.removeEventListener("click", update);
  });
}

grabForms();
renderNames();
// renderContact(1, null);
