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
  if (contact === "delete" && id) {
    const options = {
      method: "DELETE",
    };
    fetch(`http://localhost:7000/contacts/${id}`, options);
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
    fetch("http://localhost:7000/contacts", options);
  } else if (contact && id) {
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
    fetch(`http://localhost:7000/contacts/${id}`, options);
  }
}

async function getJSON() {
  let contactsResponse = await fetch("http://localhost:7000/contacts");
  result = await contactsResponse.json();
  return result;
}

function grabForms() {
  let inputName = document.getElementById("forms_name");
  let inputLName = document.getElementById("forms_last-name");
  let inputPhone = document.getElementById("forms_phone");
  let inputPhoto = document.getElementById("forms_photo");
  let inputBtn = document.getElementById("forms_btn");
  inputBtn.addEventListener("click", () => {
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
  let names = document.getElementById("names");
  let contacts = await getJSON();
  contacts.forEach((contact) => {
    let li = document.createElement("li");
    names.append(li);
    li.innerText = `${contact.name} ${contact.lastName}`;
    li.addEventListener("click", () => {
      renderContact(contact.id);
    });
  });
}
async function renderContact(id) {
  let renderedUl = document.getElementById("contacts_rendered-ul");
  let renderedName = document.getElementById("contacts_rendered-name");
  let renderedLName = document.getElementById("contacts_rendered-last-name");
  let renderedPhone = document.getElementById("contacts_rendered-phone");
  let renderedPhoto = document.getElementById(
    "contacts_rendered-photo-wrapper"
  );
  let contacts = await getJSON();
  contacts.forEach((contact) => {
    if (id === contact.id) {
      console.log(contact);
      renderedName.innerText = contact.name;
      renderedLName.innerText = contact.lastName;
      renderedPhone.innerText = contact.phone;
      renderedPhoto.innerHTML = `<img class = "contacts_photo" src="${contact.photo}">`;
    }
  });
  editContacts(id);
  deleteContact(id);
}

function deleteContact(id) {
  let del = document.getElementById("delete");
  del.addEventListener("click", (e) => {
    setJSON("delete", id);
  });
}

function editContacts(id) {
  let renderedName = document.getElementById("contacts_rendered-name");
  let renderedLName = document.getElementById("contacts_rendered-last-name");
  let renderedPhone = document.getElementById("contacts_rendered-phone");
  let renderedPhotoWrapper = document.getElementById(
    "contacts_rendered-photo-wrapper"
  );
  let renderedImg = document.getElementById("contacts_photo");
  let renderedUL = document.getElementById("contacts_rendered-ul");
  let save = document.getElementById("save");
  let cancel = document.getElementById("cancel");
  let dataContainer = renderedUL.querySelectorAll(".contacts_data-container");
  dataContainer.forEach((li) => {
    let editInp = document.createElement("input");
    li.addEventListener("click", () => {
      editInp.value = li.innerText;
      li.parentNode.replaceChild(editInp, li);
      if (editInp.value == "") {
        editInp.value == "add new value";
      }
      editInp.focus();
    });
    editInp.addEventListener("focusout", () => {
      li.innerText = editInp.value;
    });
    cancel.addEventListener("click", () => {
      editInp.parentNode.replaceChild(li, editInp);
    });
  });

  save.addEventListener("click", () => {
    let contact = [
      renderedName.textContent,
      renderedLName.textContent,
      renderedPhone.textContent,
      renderedPhoto.textContent,
    ];

    setJSON(contact, id);
  });
}

grabForms();
renderNames();
renderContact(1);
