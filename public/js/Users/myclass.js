import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

const divRoot = document.getElementById('root');
divRoot.innerHTML = `
<div class="dv-content">
    <h4 class="dv-title">My Classes</h4>
    <div class="dv-box filter">
        <div class="box-btn" id="box-btn">
            <button class="active" data-page="1">Class joined</button>
            <button data-page="0">Class pending</button>
        </div>
    </div>
    <div class="dv-box show-class" id="listClass">
    </div>
</div>
`;

// variable global

let pageActive = 1;

(() => {
    const btns = document.querySelectorAll('#box-btn button');
    btns.forEach(btn => {
        btn.addEventListener('click', function () {
            const pageNumber = parseInt(this.getAttribute('data-page'));
            if (pageNumber === pageActive) return;
            btns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            pageActive = pageNumber;
            if (pageNumber === 1) {
                getClassJoined();
            } else {
                getClassPending();
            }
        });
    });
})();

getClassJoined();

async function getClassJoined() {
    const url = 'admin/classes/getclassjoined';
    const listClass = document.getElementById('listClass');
    emptyElement(listClass);
    try {
        mbLoading(true);
        const res = await mbFetch(url);
        res.forEach(item => {
            const boxClass = componentClass(item);
            listClass.appendChild(boxClass);
        });
    } catch ($err) {
        console.log($err);
    } finally {
        mbLoading(false);
    }

}

async function getClassPending() {
    const url = 'admin/classes/getclasspending';
    const listClass = document.getElementById('listClass');
    emptyElement(listClass);
    try {
        mbLoading(true);
        const res = await mbFetch(url);
        res.forEach(item => {
            const boxClass = componentClass(item,true);
            listClass.appendChild(boxClass);
        });
    } catch ($err) {
        console.log($err);
    } finally {
        mbLoading(false);
    }
}

function componentClass(classDetail, btn = false) {
    let objectinfo = {}

    if(btn){
        objectinfo = {
            status: 'pending',
            text: 'Pending enrollment',
            idClass: classDetail.idClass
        }
    }else{
        objectinfo = {
            status: 'joined',
            text: 'Joined',
            idClass: classDetail.idClass
        }
    }

    const boxClass = document.createElement('div');
    boxClass.classList.add('box-class');
    boxClass.classList.add(objectinfo.status);
    boxClass.innerHTML = `
<h3 class="classname">${classDetail.className}</h3>
<p class="course">Course: <span>${classDetail.courseName}</span></p>
<p>Members: <span>${classDetail.quantityStudent}</span></p>
<p class="stt">Status: <span>${objectinfo.text}</span></p>
    <div class="btn_quiz_pro${btn ? ' hidden' : ''}">
        <a href="quizzes?class=${objectinfo.idClass}">Quizzes</a>
        <a href="classes/progress?class=${objectinfo.idClass}">Progress</a>
    </div>
`;

if (btn) {
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


async function cancelClass(idClass){
    const url = 'admin/classes/canceljoinclass';
    const dataReq = {
        idClass: idClass
    }
    try {
        const res = await mbFetch(url, dataReq);
        if(res.error){
            mbNotification('Warrning', res.error, 3, 2.5);
            return;
        }
        getClassPending();
        mbNotification('Success', 'Cancel class success', 3, 2.5);
    } catch ($err) {
        console.log($err)
    } finally {

    }
}


function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}