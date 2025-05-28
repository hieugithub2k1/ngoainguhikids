import {
  mbNotification,
  mbLoading,
  mbFetch,
  mbPagination,
  mbFormData,
  mbConfirm,
} from "../allmodule.js";

const divRoot = document.getElementById("root");
const listClassTemplate = `
   <div class="dv-content">
                 <h4 class="list-Class-title">Access Class</h4>
          <div class="list-Class">
              <button class="btn btn-primary btnsub" id="btnsub">Xác Nhận</button>
              <div class="course-search">
                  <div class="course-search-box"></div>
              </div>
              <table class="table-class">
                  <thead>
                      <tr>
                      <th><input type="checkbox" id="check-account-all"></th>
                          <th>Account Class</th>
                          <th>Class Name</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody id="tbody-class"></tbody>
              </table>
              <div class="list-class-pagination-container">
                  <div class="list-class-pagination-container-select">
            
                  </div>
                  <div class="list-class-pagination"></div>
              </div>
          </div>
          </div>
      </div>
      <div class="dv-edit-class-container"></div>
          `;

// variable global

let selectedIds = [];
let currentClass = {
  classId: null,
};

// lấu url từ trình duyệt

const urlParams = new URLSearchParams(window.location.search);
let idClassUrl = urlParams.get("classId");
if (!isNaN(idClassUrl)) {
  currentClass.classId = parseInt(idClassUrl);
}

divRoot.innerHTML = listClassTemplate;
const classObject = {
  currentPage: 1,
  totalPage: null,
  itemPerPage: 10,
};
const handlerProxyCourse = {
  set(target, property, value) {
    target[property] = value;
    // Nếu người dùng thay đổi trang
    if (property === "currentPage") {
      renderClass();
    } else if (property === "itemPerPage") {
      renderClass();
    }
    return true;
  },
};
const proxyCourse = new Proxy(classObject, handlerProxyCourse);

proxyCourse.currentPage = 1;

async function renderClass() {
  const EliscourtLoading = document.querySelector(".dv-content .list-class");
  mbLoading(true, EliscourtLoading);
  let url = "admin/accessclass/getAccessStatuss/";
  if (currentClass.classId !== null) {
    url += currentClass.classId;
  }
  
  let datares = [];
  try {
    datares = await mbFetch(url, currentClass);
  } catch (err) {
    console.log(err);
    return;
  } finally {
    mbLoading(false, EliscourtLoading);
  }

  const students = datares.student;
  const tbdyclass = document.createElement("tbody");

  tbdyclass.id = "tbody-class";
  students.forEach((item) => {
    const tr = itemtr(item);
    tbdyclass.appendChild(tr);
  });

  const tbodyold = document.getElementById("tbody-class");
  tbodyold.replaceWith(tbdyclass);

  // render pagination
  const paginationBox = document.querySelector(".list-class-pagination");
  const paginationUl = mbPagination(
    classObject.currentPage,
    classObject.totalPage
  );
  if (paginationBox.firstChild) {
    paginationBox.removeChild(paginationBox.firstChild);
  }
  paginationBox.appendChild(paginationUl);
  [...paginationBox.querySelectorAll("a")].forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.dataset.page);
      proxyCourse.currentPage = page;
    });
  });
}

// Lấy id từ url
function itemtr(item) {
  const tr = document.createElement("tr");
  const nameClass = 'idtr_' + item.idStudent + '_' + item.idClasses;
  tr.classList.add(nameClass);
  tr.innerHTML = `
    <td><input type="checkbox" class="check-account" data-id="${item.idStudent}" data-idclass="${item.idClasses}"></td>
                    <td>${item.fullName}</td>  
                    <td>${item.className}</td>
                    <td class="td-btn">
                    <button class="btn btn-whil btn-submit-student" id="btn-submit">
                    <svg fill="none" height="25" width="25" viewBox="0 0 170 163"xmlns="http://www.w3.org/2000/svg"><path d="M142.196 30.4125C142.586 30.0637 142.897 29.6356 143.109 29.1567C143.32 28.6778 143.427 28.1592 143.422 27.6357C143.417 27.1122 143.3 26.5959 143.079 26.1213C142.858 25.6467 142.538 25.2248 142.141 24.8838C141.722 24.5249 141.307 24.1678 140.895 23.8127C137.751 21.1093 134.5 18.3102 131.1 15.9225C105.123 -2.36044 78.1316 -2.4633 50.8803 7.23287C26.2068 16.0055 10.3619 33.5563 3.77909 59.3882C-3.56415 88.249 2.86618 113.71 22.9048 135.073C23.4261 135.625 23.9582 136.177 24.4895 136.704C35.2539 147.469 48.6614 154.115 59.2847 158.739C63.8445 160.731 87.2404 163.149 93.5707 162.206C131.19 156.588 155.946 135.37 164.569 99.8725C166.215 92.9194 167.035 85.7962 167.011 78.6508C166.974 71.1466 165.712 63.6988 163.275 56.6012C163.097 56.0703 162.805 55.5851 162.418 55.1805C162.031 54.7759 161.56 54.4618 161.037 54.2606C160.515 54.0595 159.954 53.9764 159.396 54.0171C158.838 54.0579 158.295 54.2216 157.808 54.4965L157.706 54.5547C156.931 54.9984 156.336 55.7005 156.027 56.5381C155.717 57.3757 155.712 58.2954 156.012 59.1364C158.212 65.2371 159.334 71.674 159.327 78.1592C159.251 85.9394 158.198 93.6792 156.192 101.197C150.248 122.8 136.038 138.545 112.75 149.315C89.0741 160.65 55.1215 149.19 46.0879 143.226C36.1031 136.4 27.3663 127.908 20.2596 118.121C9.11418 102.34 6.61369 79.6587 12.6028 58.9229C15.4055 49.3489 20.3036 40.5185 26.9421 33.0722C33.5806 25.6259 41.793 19.7503 50.9838 15.8714C74.8941 5.93474 98.8852 4.18192 122.285 19.0635C125.422 21.061 133.422 27.3424 137.465 30.5501C138.143 31.0882 138.99 31.3691 139.855 31.3432C140.721 31.3172 141.549 30.986 142.194 30.4082L142.196 30.4125Z" fill="green"/><path d="M74.6287 104.313C76.2312 102.79 77.1115 102.019 77.9173 101.177C103.753 74.1855 132.047 49.8851 160.508 25.7727C161.584 24.8619 162.685 23.7 163.958 23.3737C165.493 22.9815 167.996 23.4326 168.682 24.2661C169.133 24.8821 169.418 25.6035 169.509 26.3612C169.601 27.1189 169.496 27.8875 169.206 28.5932C168.537 30.3474 166.907 31.8498 165.429 33.1629C156.607 41.0019 147.538 48.5708 138.872 56.5716C120.756 73.3024 102.756 90.1576 84.8704 107.137C77.0334 114.561 74.0173 114.862 66.8059 106.929C62.0589 101.705 47.7328 84.0973 43.3455 78.5495C42.7256 77.6872 42.1735 76.7781 41.6941 75.8305C40.7045 74.0756 40.0576 72.1419 42.0246 70.7814C44.2158 69.2662 45.7707 70.8473 47.0696 72.4937C48.384 74.1607 49.5048 75.9916 50.9121 77.5713C55.2811 82.4737 69.908 99.1421 74.6287 104.313Z" fill="green"/></svg>
                      </button>
                        <button class="btn btn-danger btn-del-student">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>                              
                        </button>
                    </td>
            `;

  const btnsub = tr.querySelector(".btn-submit-student");
  btnsub.onclick = function () {
    const dataRow = [];
    let itemid = {
      idUser: item.idStudent,
      idClass: item.idClasses,
    };
    dataRow.push(itemid);
    const check = updateStatus(dataRow);
    if (check) {
      tr.remove();
    }
  };

  const btndel = tr.querySelector(".btn-del-student");
  btndel.onclick = async function () {
    const confirm = await mbConfirm(
      `You definitely want to delete lesson <span style="color: blue"> ${item.fullName} </span>?`
    );
    if (!confirm) {
      return;
    }
    const check = await removeClass(item);
    if (check) {
      tr.remove();
    }
  };

  const input = tr.querySelector("input[type=checkbox]");
  input.addEventListener("change", (e) => {
    const check = e.target.checked;
    const idUser = parseInt(e.target.dataset.id);
    const idClass = parseInt(e.target.dataset.idclass);

    let itemid = {
      idUser: idUser,
      idClass: idClass,
    };
    if (check) {
      // kiểm tra xem iduser và idclass có tồn tại chưa
      let check = selectedIds.find(
        (selectedId) =>
          selectedId.idUser === idUser && selectedId.idClass === idClass
      );
      if (!check) {
        selectedIds.push(itemid);
      }
    } else {
      selectedIds = selectedIds.filter(
        (selectedId) =>
          selectedId.idUser !== idUser || selectedId.idClass !== idClass
      );
    }

  });
  return tr;
}

const checkaccountall = document.getElementById("check-account-all");
checkaccountall.addEventListener("change", (e) => {
  const checkaccounts = document.querySelectorAll(".check-account");
  checkaccounts.forEach((item) => {
    item.checked = e.target.checked;
    const idUser = parseInt(item.dataset.id);
    const idClass = parseInt(item.dataset.idclass);
    let itemid = {
      idUser: idUser,
      idClass: idClass,
    };
    if (e.target.checked) {
      let check = selectedIds.find(
        (selectedId) =>
          selectedId.idUser === idUser && selectedId.idClass === idClass
      );
      if (!check) {
        selectedIds.push(itemid);
      }
    } else {
      selectedIds = [];
    }
  });
});

const btnsub = document.querySelector("#btnsub");
btnsub.onclick = async function () {
  if (selectedIds.length === 0) {
    mbNotification("Error", "Please select at least one item", 4, 2);
    return;
  }
  let checkRemove = await mbConfirm('Are you sure you want to delete the selected items?');
  if (!checkRemove) {
    return;
  }

  selectedIds.forEach( async (item) => {
  const check = await updateStatus(item.idStudent, item.idClasses);
  if (check) {
    const trRemove = document.querySelector(`.idtr_${item.idUser}_${item.idClass}`);
    if (trRemove) {
      trRemove.remove();
    }
  }
  });
  selectedIds = [];
};

async function removeClass(accounts_classes) {
  return new Promise(async (resolve) => {
    const url = "admin/accessclass/deleteAccessStatus";
    const datareq = { idStudent: accounts_classes.idStudent, idClass : accounts_classes.idClasses };
    try {
      const datares = await mbFetch(url, datareq);
      if (datares.error) {
        console.log(datares.error);
        resolve(false);
      } else {
        resolve(true);
        mbNotification("Success", "Delete success", 1, 2);
      }
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
}

function updateStatus(oneRow = null) {
  return new Promise(async (resolve) => {
    const url = "admin/accessclass/subaccessStatus";
    try {
      const datares = await mbFetch(url, oneRow ?? selectedIds);
      if (datares.error) {
        console.log(datares.error);
        mbNotification("Error", datares.error, 2, 2);
        resolve(false);
      } else {
        resolve(true);
        mbNotification("Success", "Update success", 1, 2);
      }
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
}

function emptyElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
