import {
  mbNotification,
  mbConfirm,
  mbLoading,
  mbFetch,
  mbPagination,
  mbFormData,
} from "../allmodule.js";

// dùng để hiển thị ra template trước khi gọi tới DOM
const divRoot = document.getElementById("root");
const templateroot = `
<div class="dv-content">
    <div class="addLesson">
        <button class="btn btn-primary btn-addLesson">Add Lesson</button>
        <div class="addLesson-box">
            <form action="" class="addLesson-form">
    <div class="fromGroup">
        <label for="lessonName" class="formLabel">Lesson Name</label>
        <input type="text" id="lessonName" name="lessonName" class="formInput" placeholder="Enter lesson name">
    </div>
    <div class="fromGroup">
        <label for="courseId" class="formLabel">Courses ID</label>
        <select id="courseId" name="courseId" class="formInput">
            <option value="">Select Course ID</option>
        </select>
    </div>
    <div>
        <button class="btn btn-primary">Add</button>
    </div>
</form>


            <button class="addLesson-box-btn-close">⬆️</button>
        </div>
    </div>
    <div class="list-Lession">
        <h3 class="list-Lession-title">List Lesson</h3>
        <div class="course-search">
            <div class="course-search-box">
                <div class="formGroup">
                  <label for="">Courses</label>
                  <select name="" id="selectCourses"></select>
                </div>
            </div>
        </div>
        <table class="table-lesson">
            <thead>
                <tr>
                    <th>Course Name</th>
                    <th>Lesson Name</th>
                    <th>Total Quiz</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tbody-lesson"></tbody>
        </table>
        <div class="list-lesson-pagination-container">
            <div class="list-lesson-pagination-container-select">
                <select name="" id="">
                    <option value="5">5</option>
                    <option selected value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
            <div class="list-lesson-pagination"></div>
        </div>
    </div>
    </div>
</div>
<div class="dv-edit-lesson-container"></div>
    `;
divRoot.innerHTML = templateroot;

// dùng để số box thêm khóa học
const EaddLesson = document.querySelector(".addLesson");
const btnaddLesson = document.querySelector(".btn-addLesson");
const closeboxaddLesson = document.querySelector(".addLesson-box-btn-close");
btnaddLesson.addEventListener("click", () => {
  EaddLesson.classList.add("show");
});
closeboxaddLesson.addEventListener("click", () => {
  EaddLesson.classList.remove("show");
});

let coursesGlobal = [];

const lessonObject = {
  currentPage: 1,
  totalPage: null,
  itemPerPage: 10,
  idCourse: ''
};
const handlerProxyCourse = {
  set(target, property, value) {
    target[property] = value;
    // Nếu người dùng thay đổi trang
    if (property === "currentPage") {
      renderLesson();
    } else if (property === "itemPerPage") {
      renderLesson();
    } else if (property === "idCourse") {
      renderLesson();
    }
    return true;
  },
};
const proxyCourse = new Proxy(lessonObject, handlerProxyCourse);

proxyCourse.currentPage = 1;


// lấy danh sách khóa học
let Courses = [];
(async () => {
  const url = "admin/courses/getallcourses";
  try {
    Courses = await mbFetch(url);
    const selectCourses = document.getElementById("selectCourses");
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "All Courses";
    selectCourses.appendChild(option);
    Courses.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.courseName;
      selectCourses.appendChild(option);
    });
    selectCourses.addEventListener("change", function (e) {
      const courseId = parseInt(this.value);
      if (isNaN(courseId)) {
        proxyCourse.idCourse = '';
      } else {
        proxyCourse.idCourse = courseId;
      }
    });
  } catch (err) {
    console.log(err);
  }
})();

async function renderLesson() {
  const EliscourtLoading = document.querySelector(".dv-content .list-Lession");
  mbLoading(true, EliscourtLoading);
  const url =
    "admin/lessons/getlessons/" +
    lessonObject.currentPage +
    "/" +
    lessonObject.itemPerPage + "/" + lessonObject.idCourse;
  let datares = [];
  try {
    datares = await mbFetch(url);
  } catch (err) {
    console.log(err);
    return;
  } finally {
    mbLoading(false, EliscourtLoading);
  }

  proxyCourse.totalPage = datares.totalPages;
  const data = datares.lessons;
  const tbdylesson = document.createElement("tbody");
  tbdylesson.id = "tbody-lesson";
  data.forEach((item) => {
    const tr = itemtr(item);
    tbdylesson.appendChild(tr);
  });

  const tbodyold = document.getElementById("tbody-lesson");
  tbodyold.replaceWith(tbdylesson);

  // render pagination
  const paginationBox = document.querySelector(".list-lesson-pagination");
  const paginationUl = mbPagination(
    lessonObject.currentPage,
    lessonObject.totalPage
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

// component item tr

function itemtr(item) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
                <td>${item.courseName}</td>
                <td><a class="mbLink" href="admin/quizzes?course=${item.idCourse}&lesson=${item.id}">${item.lessonName}</a></td>
                <td>${item.totalQuiz}</td>
                <td>${item.createdAt}</td>
                <td class="td-btn">
                    <button class="btn btn-primary btn-edit-lesson">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="23" height="23">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                    </button>
                    <button class="btn btn-danger btn-del-lesson">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>                              
                    </button>
                </td>
        `;

  const btnedit = tr.querySelector(".btn-edit-lesson");
  const btndel = tr.querySelector(".btn-del-lesson");
  btnedit.onclick = async function () {
    const data = await showFormEditLesson(item);
    if (data) {
      const oldtotalquiz = item.totalQuiz;
      data.totalQuiz = oldtotalquiz;
      const newtr = itemtr(data);
      tr.replaceWith(newtr);
    }
  };
  btndel.onclick = async function () {
    const confirm = await mbConfirm(
      `You definitely want to delete lesson <span style="color: blue"> ${item.lessonName} </span>?`
    );
    if (!confirm) {
      return;
    }
    const check = await removeLesson(item);
    if (check) {
      tr.remove();
    }
  };
  return tr;
}

// sửa khóa học
function showFormEditLesson(data) {
  return new Promise((resolve) => {
    const box = document.querySelector(".dv-edit-lesson-container");
    const boxcontent = document.createElement("div");
    boxcontent.classList.add("dv-edit-course");
    boxcontent.innerHTML = `
                  <form action="" class="formEdit">
                  <div class="fromGroup">
                      <label for="" class="formLabel">Nhập tên khóa học</label>
                      <input type="text" value="${data.id}" name="id" hidden>
                      <input type="text" value="${data.lessonName}" name="lessonName" class="formInput" placeholder="">\
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
    boxcontent.onclick = function (e) {
      if (!formEdit.contains(e.target)) {
        boxcontent.remove();
        resolve(null);
      }
    };
    const EselectCourses = boxcontent.querySelector("#courseId");
    Courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.courseName;
      EselectCourses.appendChild(option);
      if (course.id == data.idCourses) {
        option.selected = true;
      }
    });
    formEdit.onsubmit = async function (e) {
      e.preventDefault();
      const formData = mbFormData(formEdit);
      if (formData.lessonName === "") {
        mbNotification("Error", "Please enter course name", 3);
        return;
      }
      const urledit = "admin/lessons/editLesson";
      const data = await mbFetch(urledit, formData);
      boxcontent.remove();
      if (data.error) {
        console.log(data.error);
        mbNotification("Error", data.error, 2, 2);
        resolve(null);
      } else {
        const course = coursesGlobal.find(course => course.id == formData.courseId);
        if (course) {
          data.courseName = course.courseName;
        }
        mbNotification("Success", "Edit success", 1, 2);
        resolve(data);
      }
    };
    box.appendChild(boxcontent);
  });
}

// xóa khóa học

async function removeLesson(lesson) {
  return new Promise(async (resolve) => {
    const url = "admin/lessons/deleteLesson";
    const datareq = { id: lesson.id };
    try {
      const datares = await mbFetch(url, datareq);
      if (datares.error) {
        mbNotification("Error", datares.error, 2, 3);
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

document.addEventListener("DOMContentLoaded", function () {
  const addLessonForm = document.querySelector(".addLesson-form");
  const EaddLesson = document.querySelector(".addLesson");
  const btnaddLesson = document.querySelector(".btn-addLesson");
  const closeboxaddLesson = document.querySelector(".addLesson-box-btn-close");

  btnaddLesson.addEventListener("click", () => {
    EaddLesson.classList.add("show");
  });

  closeboxaddLesson.addEventListener("click", () => {
    EaddLesson.classList.remove("show");
  });

  // Fetch courses and populate the dropdown
  async function fetchCourses() {
    const url = "admin/courses/getallcourses";
    try {
      const courses = await mbFetch(url);
      // console.log("ghi chu 229: ",courses);
      coursesGlobal = courses;
      const courseSelect = document.getElementById("courseId");

      courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.courseName;
        courseSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }

  fetchCourses();

  addLessonForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = {
      courseId: document.getElementById("courseId").value,
      lessonName: document.getElementById("lessonName").value,
    };

    if (!formData.courseId || !formData.lessonName) {
      mbNotification("Error", "Please enter all required fields", 3);
      return;
    }

    const courseName = document.getElementById("courseId").selectedOptions[0].textContent;

    const url = "admin/lessons/addlesson";
    try {
      const data = await mbFetch(url, formData);
      if (data.error) {
        console.log(data.error);
        mbNotification("Error", data.error, 2, 2);
      } else {
        const tbody = document.getElementById("tbody-lesson");
        if (!tbody) {
          console.error("Element #tbody-lesson không tồn tại.");
          return;
        }
        data.totalQuiz = 0;
        data.courseName = courseName;
        const newtr = itemtr(data);

        if (tbody.firstChild) {
          tbody.insertBefore(newtr, tbody.firstChild);
        } else {
          tbody.appendChild(tr);
        }
        mbNotification("Success", "Add lesson success", 1, 2);
        addLessonForm.reset();
      }
    } catch (err) {
      console.log(err);
      mbNotification("Error", "An error occurred while adding the lesson", 3);
    } finally {
      EaddLesson.classList.remove("show");
    }
  });
});

const selectItemPerPage = document.querySelector(
  ".list-lesson-pagination-container-select select"
);
selectItemPerPage.addEventListener("change", function () {
  proxyCourse.itemPerPage = parseInt(this.value);
});
