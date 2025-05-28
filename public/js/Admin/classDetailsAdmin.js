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
        <div class="list-Class">
            <h3 class="list-Class-title">Student List</h3>
            <div class="course-search">
                <div class="course-search-box"></div>
            </div>
            <table class="table-class">
                <thead>
                    <tr>
                        <th>Account Class</th>
                        <th>Class Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="tbody-class"></tbody>
            </table>
            <div class="list-class-pagination-container">
                <div class="list-class-pagination-container-select">
                    <select name="" id="">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="list-class-pagination"></div>
            </div>
        </div>
        </div>
    </div>
    <div class="dv-edit-class-container"></div>
        `;

divRoot.innerHTML = listClassTemplate;
const classObject = {
  currentPage: 1,
  totalPage: null,
  itemPerPage: 5,
};
const handlerProxyCourse = {
  set(target, property, value) {
    const classId = getQueryParam('classId');
    target[property] = value;
    // Nếu người dùng thay đổi trang
    if (property === "currentPage") {
      renderClass(classId);
    } else if (property === "itemPerPage") {
      renderClass(classId);
    }
    return true;
  },
};
const proxyCourse = new Proxy(classObject, handlerProxyCourse);

proxyCourse.currentPage = 1;

async function fetchStudentsByClassId(classId) {
  const url = `admin/classdetails/getClassDetails?classId=${classId}`;
  const EliscourtLoading = document.querySelector(".dv-content .list-Class"); // Khai báo EliscourtLoading
  let datares; // Khai báo datares
  try {
    datares = await mbFetch(url);
    console.log(datares);
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    mbLoading(false, EliscourtLoading);
  }
  return datares; // Trả về datares
}


async function renderClass(classId) {
  const EliscourtLoading = document.querySelector(".dv-content .list-Class");
  mbLoading(true, EliscourtLoading);
  const datares = await fetchStudentsByClassId(classId);
  if (!datares) {
    console.log('Failed to fetch students');
    return;
  }
  
  const students = datares;

  const tbdyclass = document.createElement("tbody");
  tbdyclass.id = "tbody-class";
  students.forEach((item) => {
    console.log(item);
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
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
const idFromUrl = getQueryParam('classId');
console.log('ID from URL:', idFromUrl);

function itemtr(item) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
                  <td>${item.fullName}</td>  
                  <td>${item.className}</td>
                  <td class="td-btn">
                      <button class="btn btn-danger btn-del-class">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>                              
                      </button>
                  </td>
          `;
  const btndel = tr.querySelector(".btn-del-class");
  btndel.onclick = async function () {
    const confirm = await mbConfirm(
      `You definitely want to delete Student <span style="color: blue"> ${item.fullName} </span>?`
    );
    if (!confirm) {
      return;
    }
    const check = await removeClass(item);
    if (check) {
      tr.remove();
    }
  };
  return tr;
}

async function removeClass(detail) {

  return new Promise(async (resolve) => {
    const url = "admin/classdetails/deletedetailClass";
    const datareq = { idStudent: detail.idStudent, idClass : detail.idClasses };
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

const selectItemPerPage = document.querySelector(
  ".list-class-pagination-container-select select"
);
selectItemPerPage.addEventListener("change", function () {
  proxyCourse.itemPerPage = parseInt(this.value);
});


