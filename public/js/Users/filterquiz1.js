import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

const divRoot = document.getElementById('root');
divRoot.innerHTML = `
<div class="dv-content">
    <h4 class="dv-content-title">Quizzes</h4>
    <div class="dv-content-box box1">
        <div class="twoSelection">
        <div class="form-group">
            <label for="">Class</label>
            <select name="" id="select-class" hidden>
                <option value="" disabled selected>No Class</option>
            </select>
            <div class="custom-dropdown" id="idCustomSelectClass">
                <button class="dropdown-button"></button>
                <ul class="dropdown-options"></ul>
            </div>
        </div>
        <div class="form-group">
            <label for="">Unit</label>
            <select name="" id="select-unit" hidden>
                <option value="" disabled selected>No Unit</option>
            </select>
            <div class="custom-dropdown" id="idCustomSelectUnit">
                <button class="dropdown-button"></button>
                <ul class="dropdown-options"></ul>
            </div>
        </div>
    </div>
        
    </div>
    <div class="dv-content-box box2">
        <div class="totalQuizzes">
            <span>Total quizzes:</span>
            <span id="mb-totalQuizzes">0</span>
        </div>
        <div class="listQuizzes" id="mb-listQuizzes">
        </div>
    </div>
</div>
`;

/* <button class="btn btn-primary" id="btn-filter-quiz">Show Result</button> */

// variable global

let flagFilter = false;

const dataPage = {
    idClass: null,
    idLesson: null,
};

const urlParams = new URLSearchParams(window.location.search);
let idClass = urlParams.get('class');
let idLesson = urlParams.get('lesson');
if (!isNaN(idClass)) {
    dataPage.idClass = idClass;
}
if (!isNaN(idLesson)) {
    dataPage.idLesson = idLesson;
}
function updateURL() {
    let url = window.location.origin + window.location.pathname;
    if (dataPage.idClass !== null && dataPage.idLesson !== null) {
        url += '?class=' + dataPage.idClass + '&lesson=' + dataPage.idLesson;
        window.history.replaceState({}, '', url);
    }
}

// lấy danh sách class của 1 người dùng

(async () => {
    const loading = document.querySelector('.dv-content-box.box1');
    const idCustomSelectClass = document.getElementById('idCustomSelectClass');
    const customOption = idCustomSelectClass.querySelector('.dropdown-options');
    try {
        mbLoading(true, loading);
        const dataClass = await mbFetch('quizzes/getClassByUser');
        if (dataClass.length === 0) {
            const dropdownButton = idCustomSelectClass.querySelector('.dropdown-button');
            dropdownButton.innerText = 'No Class';
            mbNotification('Info', 'No Class',4,4);
            return;
        }

        emptyElement(customOption);
        dataClass.forEach(item => {
            const option = document.createElement('li');
            option.setAttribute('data-value', item.idClass);
            option.innerText = item.className;
            customOption.appendChild(option);
        });

        if (dataClass.length === 1) {
            getUnitByClass(dataClass[0].idClass);
            dataPage.idClass = dataClass[0].idClass;
        } else {
            if (dataPage.idClass !== null) {
                getUnitByClass(dataPage.idClass);
            } else {
                getUnitByClass(dataClass[0].idClass);
                dataPage.idClass = dataClass[0].idClass;
            }
        }

        customSelect('idCustomSelectClass', function (value) {
            dataPage.idClass = value;
            dataPage.idLesson = null;
            getUnitByClass(value);
        }, dataPage.idClass);

    } catch (e) {
        console.log(e);
    } finally {
        mbLoading(false, loading);
    }
})();

async function getUnitByClass(idClass) {
    const idCustomSelectUnit = document.getElementById('idCustomSelectUnit');
    const selectUnit = idCustomSelectUnit.querySelector('.dropdown-button');
    const customOption = idCustomSelectUnit.querySelector('.dropdown-options');
    const loading = document.querySelector('.dv-content-box.box1');
    try {
        mbLoading(true, loading);
        const dataUnit = await mbFetch('admin/quizzes/getUnitByClass/' + idClass);
        emptyElement(selectUnit);

        if (dataUnit.length === 0) {
            const dropdownButton = idCustomSelectUnit.querySelector('.dropdown-button');
            dropdownButton.innerText = 'No Unit';
            mbNotification('Info', 'No Unit',4,4);
            emptyElement(customOption);
            return;
        }

        emptyElement(customOption);
        dataUnit.forEach(item => {
            const option = document.createElement('li');
            option.setAttribute('data-value', item.idLesson);
            option.innerText = item.lessonName;
            customOption.appendChild(option);
        });

        if (dataUnit.length === 1) {
            getQuizByUnit(dataPage.idClass, dataUnit[0].idLesson);
            dataPage.idLesson = dataUnit[0].idLesson;
        } else {
            if (dataPage.idLesson !== null) {
                getQuizByUnit(dataPage.idClass, dataPage.idLesson);
            } else {
                getQuizByUnit(dataPage.idClass, dataUnit[0].idLesson);
                dataPage.idLesson = dataUnit[0].idLesson;
            }
        }

        customSelect('idCustomSelectUnit', function (value) {
            dataPage.idLesson = value;
            flagFilter = true;
            // console.log('change unit');
            updateURL();
            getQuizByUnit(dataPage.idClass, dataPage.idLesson);
        }, dataPage.idLesson);

    } catch (e) {
        console.log(e);
    } finally {
        mbLoading(false, loading);
    }
}

// btn filter
// (() => {

//     const btnFilterQuiz = document.getElementById('btn-filter-quiz');
//     btnFilterQuiz.addEventListener('click', function () {

//         if (dataPage.idClass === null || dataPage.idLesson === null) {
//             mbNotification('Warrning', 'Please select Class and Unit',3,1.5);
//             return;
//         }
//         if(!flagFilter){
//             return;
//         }
//         flagFilter = false;

//         updateURL();
//         getQuizByUnit(dataPage.idClass, dataPage.idLesson);
//     });

// })();

async function getQuizByUnit(idClass, idUnit) {
    const loading = document.querySelector('.dv-content-box.box2');
    try {
        mbLoading(true, loading);
        const dataQuizzes = await mbFetch('admin/quizzes/getQuizByIdLesson/' + idClass + '/' + idUnit);
        renderQuizzes(dataQuizzes);
    } catch (e) {
        console.log(e);
    } finally {
        mbLoading(false, loading);
    }
}


function renderQuizzes(dataQuizzes) {

    const EtotalQuiz = document.getElementById('mb-totalQuizzes');
    const ElistQuiz = document.getElementById('mb-listQuizzes');
    EtotalQuiz.innerText = dataQuizzes.length;
    emptyElement(ElistQuiz);
    dataQuizzes.forEach(item => {
        ElistQuiz.appendChild(componentBoxQuiz(item));
    });

}


function componentBoxQuiz(row) {
    let scorePercent = 0;
    if (row.score !== null) {
        scorePercent = (row.score / 10) * 100;
    }

    const div = document.createElement('div');
    div.innerHTML = `
    <p>Class: <span>${row.className}</span></p>
    <p>Unit: <span>${row.lessonName}</span></p>
    <p>Quiz: <a href="quizzes/startquiz?class=${row.idClass}&unit=${row.idLesson}&quiz=${row.idQuiz}">${row.quizName}</a></p>
    <p>Score: <span class="${row.score === null ? 'null' : ''}">${row.score === null ? 'Not Attempted' : row.score + '/10'}</span></p>
    <div class="srore_v2" style="--mb-percent: ${scorePercent}%" data-percent="${scorePercent}">
    <div class="progress_v2"></div>
    </div>
    `;
    return div;
}


function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function customSelect(idElement, callback, idSelected = null) {
    
    const idCustomSelect = document.getElementById(idElement);
    if (idCustomSelect === null) {
        return;
    }
    
    const dropdownButton = idCustomSelect.querySelector('.dropdown-button');
    const dropdownOptions = idCustomSelect.querySelector('.dropdown-options');
    const options = idCustomSelect.querySelectorAll('.dropdown-options li');
    dropdownButton.onclick = function () {
        dropdownOptions.classList.toggle('block');
    };
    options.forEach(option => {
        if (idSelected !== null && option.getAttribute('data-value') == idSelected) {
            dropdownButton.innerText = option.innerText;
        }
        option.onclick = function (e) {
            const value = option.getAttribute('data-value');
            const text = option.innerText;
            dropdownButton.innerText = text;
            dropdownOptions.classList.remove('block');
            callback(value);
        };
    });

    document.addEventListener('click', function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownOptions.contains(event.target)) {
            dropdownOptions.classList.remove('block');
        }
    });
}
