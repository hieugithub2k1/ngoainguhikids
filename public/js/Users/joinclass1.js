import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

const divRoot = document.getElementById('root');
divRoot.innerHTML = `
<div class="dv-content">
    <h4 class="dv-title">Classes</h4>
    <div class="dv-box filter">
        <form action="">
            <div class="form-group">
                <label for="filter">Course</label>
                <select name="" id="select-courses">
                    <option value="" disabled selected>Choose Course</option>
                </select>
            </div>
        </form>
    </div>
        <div class="dv-box show-class" id="listClass">
        <h3>Please choose course</h3>
    </div>
</div>
`;

// variable global

let idCourse = '';

// lấy các khóa học hiện có

(async () => {

    const getCoursesUrl = 'admin/classes/getallcourse';
    const EselectCourses = document.getElementById('select-courses');
    const Eloading = document.querySelector('#root > div > div.dv-box.filter');
    try {
        mbLoading(true, Eloading);
        const courses = await mbFetch(getCoursesUrl);
        if(courses.length === 0) return;
        emptyElement(EselectCourses);

        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'All Courses';
        EselectCourses.appendChild(option);

        courses.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.courseName;
            EselectCourses.appendChild(option);
        });

        EselectCourses.addEventListener('change', (e) => {
            const id = parseInt(e.target.value);
            if(isNaN(id)){
                idCourse = '';
            }else{
                idCourse = id;
            }
            getDetailClass();
        });

    } catch ($err) {
        console.log($err)
    } finally {
        mbLoading(false, Eloading);
    }

})();


// (() => {
//     const btnFilter = document.getElementById('btn-filter');
//     btnFilter.addEventListener('click', (e) => {
//         e.preventDefault();
//         getDetailClass();
//     });

// })();

getDetailClass();

async function getDetailClass() {

        let url = 'admin/classes/getClassDetailByCourseClass/' + idCourse;

        try {
            mbLoading(true);
            const classes = await mbFetch(url);
            renderClass(classes);
        } catch ($err) {
            console.log($err)
        } finally {
            mbLoading(false);
        }
}

function renderClass(data){
    const listClass = document.getElementById('listClass');
    emptyElement(listClass);

    if(data.length == 0){
        const h3 = document.createElement('h3');
        h3.textContent = 'The course has no classes yet';
        listClass.appendChild(h3);
        return;
    }

    data.forEach(classDetail => {
        listClass.appendChild(componentClass(classDetail));
    });
}


function componentClass(classDetail) {

    const objectStatus = {
        null: {
            status: 'nojoin',
            text: 'Not enrolled yet'
        },
        0: {
            status: 'pending',
            text: 'Pending enrollment'
        },
        1: {
            status: 'joined',
            text: 'Joined'
        }
    }

    const classStatus = objectStatus[classDetail.statusUser];

    const boxClass = document.createElement('div');
    boxClass.classList.add('box-class');
    boxClass.classList.add(classStatus.status);
    boxClass.innerHTML = `
        <h3 class="classname">${classDetail.className}</h3>
        <p class="course">Course: <span>${classDetail.courseName}</span></p>
        <p>Members: <span>${classDetail.quantityStudent}</span></p>
        <p class="stt">Status: <span>${classStatus.text}</span></p>
        `;
        // <button class="btn btn-primary">Join</button>

        
    if (classDetail.statusUser == null) {
        const btnJoin = document.createElement('button');
        btnJoin.classList.add('btn', 'btn-primary');
        btnJoin.textContent = 'Join';

        btnJoin.onclick = async function () {
            const text = 'Are you sure to join this class <span style="color: green">' + classDetail.className + '</span> ?';
            const check = await mbConfirm(text);
            if (!check) {
                return;
            }
            joinClass(classDetail.idClass);
        }

        boxClass.appendChild(btnJoin);

    }else if(classDetail.statusUser == 0){
        const btnCancel = document.createElement('button');
        btnCancel.classList.add('btn', 'btn-primary');
        btnCancel.textContent = 'Cancel';

        btnCancel.onclick = async function () {
            const text = 'Are you sure to cancel this class <span style="color: red">' + classDetail.className + '</span> ?';
            const check = await mbConfirm(text);
            if (!check) {
                return;
            }
            cancelClass(classDetail.idClass);
        }

        boxClass.appendChild(btnCancel);
    }


    return boxClass;
}

async function joinClass(idClass){
    const url = 'admin/classes/joinclass';
    const dataReq = {
        idClass: idClass
    }
    try {
        mbLoading(true);
        const res = await mbFetch(url, dataReq);
        if(res.error){
            mbNotification('Warrning', res.error, 3, 2.5);
            return;
        }
        getDetailClass();
        mbNotification('Success', 'Join class success', 3, 2.5);
    } catch ($err) {
        console.log($err)
    } finally {
        mbLoading(false);
    }
}

async function cancelClass(idClass){
    const url = 'admin/classes/canceljoinclass';
    const dataReq = {
        idClass: idClass
    }
    try {
        mbLoading(true);
        const res = await mbFetch(url, dataReq);
        if(res.error){
            mbNotification('Warrning', res.error, 3, 2.5);
            return;
        }
        getDetailClass();
        mbNotification('Success', 'Cancel class success', 3, 2.5);
    } catch ($err) {
        console.log($err)
    } finally {
        mbLoading(false);
    }
}


function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

