import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';
// dùng để hiển thị ra template trước khi gọi tới DOM
const divRoot = document.getElementById('root');
const templateroot = `
<div class="dv-content">
    <div class="addCourse">
        <button class="btn btn-primary btn-addCourse">Add Course</button>
        <div class="addCourse-box">
            <form action="" class="addCourse-form">
                <div class="fromGroup">
                    <label for="courseName" class="formLabel">Course Name</label>
                    <input type="text" id="courseName" name="courseName" class="formInput" placeholder="Enter course name">
                </div>
                <div>
                    <button class="btn btn-primary">Add</button>
                </div>
            </form>
            <button class="addCourse-box-btn-close">⬆️</button>
        </div>
    </div>
    <div class="listCourse">
        <h3 class="listCourse-title">List Courses</h3>
        <div class="course-search">
            <div class="course-search-box"></div>
        </div>
        <table class="table-course">
            <thead>
                <tr>
                    <th>Course Name</th>
                    <th>Total Lessons</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tbody-course"></tbody>
        </table>
        <div class="listCourse-pagination-container">
            <div class="listCourse-pagination-container-select">
                <select name="" id="">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
            <div class="listCourse-pagination"></div>
        </div>
    </div>
    </div>
</div>
<div class="dv-edit-course-container"></div>
    `;
divRoot.innerHTML = templateroot;


// dùng để số box thêm khóa học
const EaddCourse = document.querySelector('.addCourse');
const btnAddCourse = document.querySelector('.btn-addCourse');
const closeboxaddcourse = document.querySelector('.addCourse-box-btn-close');
btnAddCourse.addEventListener('click', () => {
    EaddCourse.classList.add('show');
});
closeboxaddcourse.addEventListener('click', () => {
    EaddCourse.classList.remove('show');
});

// show các khóa học

const courseObject = {
    currentPage: 1,
    totalPage: null,
    itemPerPage: 5,
}
const handlerProxyCourse = {
    set(target, property, value) {
        target[property] = value;
        // Nếu người dùng thay đổi trang
        if (property === 'currentPage') {
            renderCourse();
        }else if (property === 'itemPerPage') {
            renderCourse();
            
        }
        return true;
    }
};
const proxyCourse = new Proxy(courseObject, handlerProxyCourse);

proxyCourse.currentPage = 1;

async function renderCourse() {
    const EliscourtLoading = document.querySelector('.dv-content .listCourse');
    mbLoading(true, EliscourtLoading);
    const url = 'admin/courses/getcourses/' + courseObject.currentPage + '/' + courseObject.itemPerPage;
    let datares = [];
    try {
        datares = await mbFetch(url);
        console.log(datares);
    } catch (err) {
        console.log(err);
        return;
    } finally {
        mbLoading(false, EliscourtLoading);
    }

    proxyCourse.totalPage = datares.totalPages;
    const data = datares.courses;
    const tbdycourse = document.createElement('tbody');
    tbdycourse.id = 'tbody-course';
    data.forEach(item => {
        const tr = itemtr(item);
        tbdycourse.appendChild(tr);
    });

    const tbodyold = document.getElementById('tbody-course');
    tbodyold.replaceWith(tbdycourse);

    // render pagination
    const paginationBox = document.querySelector('.listCourse-pagination');
    const paginationUl = mbPagination(courseObject.currentPage, courseObject.totalPage);
    if (paginationBox.firstChild) {
        paginationBox.removeChild(paginationBox.firstChild);
    }
    paginationBox.appendChild(paginationUl);
    [...paginationBox.querySelectorAll('a')].forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            proxyCourse.currentPage = page;
        });
    });

}

// component item tr

function itemtr(item) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
                <td>${item.courseName}</td>
                <td>${item.totalLesson}</td>
                <td>${item.createdAt}</td>
                <td class="td-btn">
                    <button class="btn btn-primary btn-edit-course">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="23" height="23">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                    </button>
                    <button class="btn btn-danger btn-del-course">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>                              
                    </button>
                </td>
        `;

    const btnedit = tr.querySelector('.btn-edit-course');
    const btndel = tr.querySelector('.btn-del-course');
    btnedit.onclick = async function () {
        const data = await showFormEditCourse(item);
        if (data) {
            const oldtotalLesson = item.totalLesson;
            data.totalLesson = oldtotalLesson;
            const newtr = itemtr(data);
            tr.replaceWith(newtr);
        }
    }
    btndel.onclick = async function () {
        const confirm = await mbConfirm(`You definitely want to delete course <span style="color: blue"> ${item.courseName} </span>?`);
        if (!confirm) {
            return;
        }
        const check = await removeCourse(item);
        if (check) {
            tr.remove();
        }
    };
    return tr;
}

// sửa khóa học

function showFormEditCourse(data) {
    return new Promise((resolve) => {
        const box = document.querySelector('.dv-edit-course-container');
        const boxcontent = document.createElement('div');
        boxcontent.classList.add('dv-edit-course');
        boxcontent.innerHTML = `
                    <form action="" class="formEdit">
                    <div class="fromGroup">
                        <label for="" class="formLabel">Nhập tên khóa học</label>
                        <input type="text" value="${data.id}" name="id" hidden>
                        <input type="text" value="${data.courseName}" name="courseName" class="formInput" placeholder="">
                    </div>
                    <button class="btn btn-primary">Accept</button>
                </form>
        `;
        const formEdit = boxcontent.querySelector('.formEdit');
        boxcontent.onclick = function (e) {
            if (!formEdit.contains(e.target)) {
                boxcontent.remove();
                resolve(null);
            }
        }
        formEdit.onsubmit = async function (e) {
            e.preventDefault();
            const formData = mbFormData(formEdit);
            if(formData.courseName === ''){
                mbNotification('Error', 'Please enter course name', 3);
                return
            }
            const urledit = 'admin/courses/editCourse';
            const data = await mbFetch(urledit, formData);
            boxcontent.remove();
            if (data.error) {
                console.log(data.error);
                mbNotification('Error', data.error, 2, 2);
                resolve(null);
            } else {
                mbNotification('Success', 'Edit success', 1, 2);
                resolve(data);
            }
        }
        box.appendChild(boxcontent);
    });
}

// xóa khóa học

async function removeCourse(course) {
    return new Promise(async (resolve) => {
        const url = 'admin/courses/deleteCourse';
        const datareq = { id: course.id };
        try {
            const datares = await mbFetch(url, datareq);
            if (datares.error) {
                mbNotification('Error', datares.error, 2, 2);
                console.log(datares.error);
                resolve(false);
            } else {
                resolve(true);
                mbNotification('Success', 'Delete success', 1, 2);
            }
        } catch (err) {
            console.log(err);
            resolve(false);
        }
    });
}


// them khóa học

const addCourseform = document.querySelector('.addCourse-form');
addCourseform.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = mbFormData(addCourseform);
    if(formData.courseName === ''){
        mbNotification('Error', 'Please enter course name', 3);
        return
    }

    const check = await mbConfirm('You definitely want to add course?');
    if (!check) {
        return;
    }
    const url = 'admin/courses/addCourse';
    try {
        mbLoading(true);
        const data = await mbFetch(url, formData);
        mbLoading(false);
        if (data.error) {
            console.log(data.error);
            mbNotification('Error', data.error, 2, 2);
        } else {
            const tbody = document.getElementById('tbody-course');
            data.totalLesson = 0;
            const tr = itemtr(data);
            if (tbody.firstChild) {
                tbody.insertBefore(tr, tbody.firstChild);
            } else {
                tbody.appendChild(tr);
            }
            mbNotification('Success', 'Add course success', 1, 2);
            addCourseform.reset();
        }
    } catch (err) {
        console.log(err);
    } finally {
        EaddCourse.classList.remove('show');
    }
});


// thay đổi số item trên mỗi trang

const selectItemPerPage = document.querySelector('.listCourse-pagination-container-select select');
selectItemPerPage.addEventListener('change', function () {
    proxyCourse.itemPerPage = parseInt(this.value);
});


