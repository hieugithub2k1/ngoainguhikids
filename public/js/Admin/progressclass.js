import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from "../allmodule.js";

const divRoot = document.getElementById('root');
divRoot.innerHTML = `
<div class="dv-content">
    <div class="dv-content-title">Progress</div>
    <div class="dv-content-box box1">
    </div>
    <div class="dv-content-box box2">
    </div>
</div>
<div class="box-overllay">
</div>
`;

const urlParams = new URLSearchParams(window.location.search);
const idClass = parseInt(urlParams.get('class'));

// kiểm tra idclass có phải là number không 
if (isNaN(idClass)) {
    window.location.href = 'admin/classes';
}

// lấy thông tin

(async () => {
    const url = "admin/classes/getprogress/" + idClass;
    try {
        mbLoading(true);
        const res = await mbFetch(url);
        if (res.error) {
            mbNotification('Error', res.error, 2, 5);
            return;
        }
        renderProgress(res);
        console.log(res);
    } catch ($err) {
        console.log($err);
    } finally {
        mbLoading(false);
    }
})();

function renderProgress(data) {
    const box1 = document.createElement('div');
    box1.classList.add('dv-content-box', 'box1');
    box1.innerHTML = `
         <p class="courseName">Course Name: <span>${data.courseName}</span></p>
        <p class="className">ClassName: <span>${data.className}</span></p>
    `;

    const box2 = document.createElement('div');
    box2.classList.add('dv-content-box', 'box2');
    box2.innerHTML = `
            <div class="chart-container">
            <div class="chart"></div>
        </div>
    `;
    const chart = box2.querySelector('.chart');
    data.students.forEach(item => {
        const div = document.createElement('div');
        const percent = item.percent;
        div.innerHTML = `
                    <div class="bar${percent <= 10 ? ' red' : ''}" style="--width: ${percent}%">.<div>${percent}%</div></div>
                    <div class="bar-label nomal">${item.studentName}</div>
                    <div class="separator"></div>
        `;
        const btn = div.querySelector('.bar-label');
        btn.addEventListener('click',()=>{
            getProgressDetail(item.idStudent);
        });
        chart.appendChild(div);
    });
    
    const oldbox1 = document.querySelector('.dv-content-box.box1');
    const oldbox2 = document.querySelector('.dv-content-box.box2');
    oldbox1.replaceWith(box1);
    oldbox2.replaceWith(box2);
}


async function getProgressDetail(idUser){
    const url = 'admin/classes/getprogressdetail/' + idUser + '/' + idClass;
    try{
        mbLoading(true);
        const res = await mbFetch(url);
        if(res.error){
            mbNotification('Error',res.error,2,3);
            return;
        }
        renderProgressDetail(res);
    }catch($err){
        console.log($err);
    }finally{
        mbLoading(false);
    }
}

function renderProgressDetail(data){
    const boxOverllay = document.querySelector('.box-overllay');
    emptyElement(boxOverllay);
    const div = document.createElement('div');
    div.classList.add('progress-overllay');
    div.innerHTML = `
           <div class="box-overllay-close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>              
    </div>
    <div class="progress-overllay-content">
        <div class="progress-item info">
            <p>Name: <span>${data.userName}</span></p>
            <p>Course: <span>${data.courseName}</span></p>
            <p>Class: <span>${data.className}</span></p>
        </div>
    </div>
    `;

    const content = div.querySelector('.progress-overllay-content');
    data.lessons.forEach(lesson => {
        const div = document.createElement('div');
        div.classList.add('progress-item');
        div.innerHTML = `
                <div class="chart-container">
                <h4 class="chart-title">${lesson.lessonName} <span>(${lesson.percentLesson}%)</span></h4>
                <div class="chart"></div>
            </div>
        `;
        const chart = div.querySelector('.chart');
        lesson.quizzes.forEach(quiz => {
            const div = document.createElement('div');
            const percent = quiz.percentQuiz;
            div.innerHTML = `
                <div class="bar${percent <= 10 ? ' red' : ''}" style="--width: ${percent}%">.<div>${percent}%</div></div>
                <div class="bar-label">${quiz.quizName}</div>
                <div class="separator"></div>
            `;
            chart.appendChild(div);
        });
        content.appendChild(div);
    });

    const close = div.querySelector('.box-overllay-close');
    close.onclick = ()=>{
        emptyElement(boxOverllay);
    }
    boxOverllay.appendChild(div);
}


function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
