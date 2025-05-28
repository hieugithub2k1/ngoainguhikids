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
            <div class="fromGroup">
            <h3 class="list-Class-title">List Class</h3>
            <div class="filter">
            <div class="filter-sel">
                <label for="courseId" class="formLabel">Filter courses</label>
                <select id="filter-class" name="courseId" class="formInput">
                    <option value="">All</option>
                </select>
              </div>
            <div class="filter-sel-1">
                <label for="courseId" class="formLabel">Statuss</label>
                <select id="statusSelect" name="statusSelect" class="formInput">  
                    <option value="1">Active</option>
                    <option value="0">Stop working</option>
                </select>
              </div>
            </div>
          </div>
            <div class="course-search">
                <div class="course-search-box"></div>
            </div>
            <table class="table-class">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Class Name</th>
                        <th>List Student</th>
                        <th>Access Class</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="tbody-class"></tbody>
            </table>
            <div class="list-class-pagination-container">
                <div class="list-class-pagination-container-select">
                    <select name="" id="">
                        <option value="5">5</option>
                        <option selected value="10">10</option>
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


// biến toàn cục
let coursesGlobal = [];

const classObject = {
  currentPage: 1,
  totalPage: null,
  itemPerPage: 10,
};

const statusResquest = {
  currentPage: classObject.currentPage,
  itemPerPage: classObject.itemPerPage,
  idCourses: null,
  status: 1
}

const handlerProxyCourse = {
  set(target, property, value) {
    target[property] = value;
    // Nếu người dùng thay đổi trang
    updateStatusRequest();
    if (property === "currentPage") {
      getClass();
    } else if (property === "itemPerPage") {
      getClass();
    }
    return true;
  },
};
const proxyCourse = new Proxy(classObject, handlerProxyCourse);

proxyCourse.currentPage = 1;

const Courses = [];

( async () => {
  const url = "admin/courses/getallcourses";
  try {
    const courses = await mbFetch(url);
    courses.forEach(item => Courses.push(item));   
    renderCourses(Courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
  }
})();

function updateStatusRequest() {
  statusResquest.currentPage = classObject.currentPage;
  statusResquest.itemPerPage = classObject.itemPerPage;
}

async function getClass(){
  const EliscourtLoading = document.querySelector(".dv-content .list-Class");
  mbLoading(true, EliscourtLoading);
  const url = "admin/classes/getclasses/";
  let datares = [];
  try {
    datares = await mbFetch(url,statusResquest);
  } catch (err) {
    console.log(err);
    return;
  } finally {
    mbLoading(false, EliscourtLoading);
  }

  proxyCourse.totalPage = datares.totalPages;
  const data = datares.Classes;
  renderClass(data);

}


function renderClass(data){
  const oldtbody = document.getElementById('tbody-class');
  const newtbody = document.createElement("tbody");
  newtbody.id = "tbody-class";
  data.forEach(item => {
    const tr = itemtr(item);
    newtbody.appendChild(tr);
  });
  oldtbody.replaceWith(newtbody);

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

// thay doi trang thai
const EselectStatus = document.getElementById('statusSelect');
EselectStatus.addEventListener('change', function(e){
  let value = e.target.value;
  value = parseInt(value);
  statusResquest.status = value;
  getClass();
});

async function renderClassfix() {


  // hiển thị dữ liệu dựa trên trạng thái


  document.getElementById("statusSelect").addEventListener("change", function () {
    const selectedStatus = this.value;
    const selectedCourseId = document.getElementById("filter-class").value;
    displayFilteredData(selectedStatus, selectedCourseId);
  });
  
  // Lắng nghe sự kiện thay đổi trên phần tử <select> cho khóa học
  document.getElementById("filter-class").addEventListener("change", function () {
    const selectedStatus = document.getElementById("statusSelect").value;
    const selectedCourseId = this.value;
    displayFilteredData(selectedStatus, selectedCourseId);
  });
 
  // displayFilteredData("1", "");
  // ================================================================
}




 // lấy danh sách khóa học để lọc
function renderCourses(courses) {
    const courseSelect = document.getElementById("filter-class");
    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.courseName;
      courseSelect.appendChild(option);
    });

    courseSelect.addEventListener('change', function (e){
      const idCourse = parseInt(e.target.value);
      statusResquest.idCourses = isNaN(idCourse) ? null : idCourse;
      getClass();
    });
}

// fetchCourses();

 // hiển thị dữ liệu mặc định khi tải trang.
// function displayFilteredData(status = null, selectedCourse = null) {
//   const tbdyclass = document.createElement("tbody");
//   tbdyclass.id = "tbody-class";
//   const filteredData = data.filter((item) => {
//     return (
//       (status === null || item.statuss === status) &&
//       (selectedCourse === "" || item.idCourses === selectedCourse)
//     );
//   });
//   filteredData.forEach((item) => {
//     const tr = itemtr(item);
//     tbdyclass.appendChild(tr);
//   });
//   const tbodyold = document.getElementById("tbody-class");
//   if (tbodyold) {
//     tbodyold.replaceWith(tbdyclass);
//   } else {
//     const table = document.querySelector(".table-class");
//     table.appendChild(tbdyclass);
//   }
// }

// component item tr

function itemtr(item) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
                  <td>${item.courseName}</td>
                  <td>${item.className}</td>
                   <td><a class="link_detail" href="admin/classdetails?classId=${item.id}">Detail (${item.inclass})</a></td> 
                   <td><a class="link_detail" href="admin/accessclass?classId=${item.id}">Pending (${item.pending})</a></td> 
                    <td><a class="link_detail" href="admin/classes/progress?class=${item.id}">Progress</a></td> 
                  <td>
                    <label class="toggle-switch">
                      <input type="checkbox" id="toggleSwitch-${item.id}">
                      <div class="toggle-switch-background">
                        <div class="toggle-switch-handle"></div>
                      </div>
                    </label>
                  </td>
                  <td class="td-btn">
                      <button class="btn btn-primary btn-edit-class">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="23" height="23">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                      </button>
                      <button class="btn btn-danger btn-del-class">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>                              
                      </button>
                  </td>
          `;
  const btnedit = tr.querySelector(".btn-edit-class");
  const btndel = tr.querySelector(".btn-del-class");
  const toggleSwitch = tr.querySelector(`#toggleSwitch-${item.id}`);
  if (toggleSwitch) {
    toggleSwitch.checked = Number(item.statuss) === 1;
    toggleSwitch.onchange = async function () {
      const statuss = this.checked ? 1 : 0;
      const url = "admin/classes/updateStatus";
      const datareq = { id: item.id, statuss };
      try {
        const datares = await mbFetch(url, datareq);
        if (datares.error) {
          console.log(datares.error);
          mbNotification("Error", datares.error, 2, 2);
        } else {
          mbNotification("Success", "Cập nhật trạng thái thành công", 1, 2);
        }
      } catch (err) {
        console.log(err);
      }
    };
  } else {
    console.error(
      `Công tắc chuyển đổi id toggleSwitch-${item.id} không tồn tại`
    );
  }

  btnedit.onclick = async function () {
    const data = await showFormEditClass(item);
    if (data) {
      const oneCourse = Courses.find((course) => course.id === data.idCourses);
      data.courseName = oneCourse.courseName;
      const newtr = itemtr(data);
      tr.replaceWith(newtr);
    }
  };
  btndel.onclick = async function () {
    const confirm = await mbConfirm(
      `You definitely want to delete lesson <span style="color: blue"> ${item.className} </span>?`
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
// sửa khóa học
function showFormEditClass(data) {
  return new Promise((resolve) => {
    const box = document.querySelector(".dv-edit-class-container");
    const boxcontent = document.createElement("div");
    boxcontent.classList.add("dv-edit-class");
    boxcontent.innerHTML = `
                    <form class="formEdit">
                    <div class="fromGroup">
                        <label for="" class="formLabel">Nhập tên khóa học</label>
                        <input type="text" value="${data.id}" name="id" id="idClass"  hidden>
                        <input type="text" value="${data.className}" id="className" class="formInput" placeholder="">
                        <div class="fromGroup">
                      <label for="courseId" class="formLabel">Courses ID</label>
                      <select id="courseId" name="courseId" class="formInput">

                      </select>
                    </div>
                    </div>
                    <button class="btn btn-primary">Accept</button>
                </form>
        `;

    const formEdit = boxcontent.querySelector(".formEdit");

    boxcontent.onclick = function(e){
      if (!formEdit.contains(e.target)) {
        boxcontent.remove();
        resolve(null);
      }
    }

    const EselectCourses = boxcontent.querySelector("#courseId");
    Courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.courseName;
      EselectCourses.appendChild(option);
      if(course.id == data.idCourses){
        option.selected = true;
      }
    });

    formEdit.onsubmit = async function (e) {
      e.preventDefault();
      const formData = {
        classId: document.getElementById("idClass").value,
        courseId: document.getElementById("courseId").value,
        className: document.getElementById("className").value,
      };
      if (!formData.courseId || !formData.className) {
        mbNotification("Error", "Please enter all required fields", 3);
        return;
      }
      const urledit = "admin/classes/editClass";
      const data = await mbFetch(urledit, formData);
      boxcontent.remove();
      if (data.error) {
        console.log(data.error);
        mbNotification("Error", data.error, 2, 2);
        resolve(null);
      } else {
        mbNotification("Success", "Edit success", 1, 2);
        resolve(data);
      }
    };
    box.appendChild(boxcontent);
  });
}

// fetchCourses();

// xóa Lớp học

async function removeClass(Class) {
  return new Promise(async (resolve) => {
    const url = "admin/classes/deleteClass";
    const datareq = { id: Class.id };
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
