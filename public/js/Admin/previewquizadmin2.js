import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

const divRoot = document.getElementById('root');
divRoot.innerHTML = `

<div class="dv-content-quiz">
<h3 class='quiz-title-admin'>Preview</h3>
    <div class="dv-content-quiz-box boxinfo">
    </div>
    <div class="dv-content-quiz-box quizzes">
        <form action="" id="formQuizzes">
            <div class="title">
                <h3 class="quiz-title"></h3>
            </div>
            <div class="quizmedia">
            </div>
            <div class="quizListQuestions">
            </div>
        </form>
    </div>
</div>
`;

const dataPage = {
    idCourse: null,
    idLesson: null,
    idQuiz: null,
};

let quizzes = null;

let isEdit = false;

// kiểm tra có param idCourse không thì gắn vào dataPage
const urlParams = new URLSearchParams(window.location.search);
let idCourse = urlParams.get('course');
let idLesson = urlParams.get('lesson');
let idQuiz = urlParams.get('quiz');
// kiểm tra nếu param là số thì gắn vào dataPage
if (!isNaN(idCourse)) {
    dataPage.idCourse = idCourse;
}
if (!isNaN(idLesson)) {
    dataPage.idLesson = idLesson;
}
if (!isNaN(idQuiz)) {
    dataPage.idQuiz = idQuiz;
}

const STTABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const formQuizzes = document.getElementById('formQuizzes');
const quizTitle = formQuizzes.querySelector('.quiz-title');
const quizMedia = formQuizzes.querySelector('.quizmedia');
const listQuestions = formQuizzes.querySelector('.quizListQuestions');
const score = formQuizzes.querySelector('.quize-score');

getQuiz();

async function getQuiz() {
    // kiểm tra các thuộc tính của dataPage, nếu có thuộc tính null thì cho dừng lại
    if (dataPage.idQuiz === null) {
        mbNotification('Error', 'Wrong link, please go back', 2, 3);
        return;
    }

    const url = `admin/quizzes/previewquiz/${dataPage.idCourse}/${dataPage.idLesson}/${dataPage.idQuiz}`;
    try {
        mbLoading(true);
        quizzes = await mbFetch(url);
        console.log(quizzes);
      
        renderInfo(quizzes.courseName, quizzes.lessonName,quizzes.user);
        renderQuizzes(quizzes);
    } catch (err) {
        console.log(err);
    } finally {
        mbLoading(false);
    }
}

function renderQuizzes(data) {

    quizTitle.textContent = data.quizName;
    listQuestions.classList.add('showResult');
    handlEmptyChildren(quizMedia);
    const mediaElement = hanldMediaComponent(data.mediaCMS)
    if (mediaElement) {
        quizMedia.appendChild(mediaElement);
    }
    const questions = data.questionsCMS;
    handlEmptyChildren(listQuestions);
    questions.forEach((question, index) => {

        let questionComponent = null;
        if (question.typeAnswers == 0) {
            questionComponent = quizChoiceComponent(question, index);
        } else if (question.typeAnswers == 1) {
            questionComponent = quizWriteComponent(question, index);
        }
        if (questionComponent) {
            listQuestions.appendChild(questionComponent);
        }
    });

    return;

}

function renderInfo(CourseName, LessonName,user) {
    const box2 = document.querySelector('.dv-content-quiz-box.boxinfo');
    handlEmptyChildren(box2);
    const divTop = document.createElement('div');
    divTop.classList.add('dv-top-admin');
    divTop.innerHTML = `
    <div class="dv-top-admin-box">
        <div>
            <h4><span>Course: </span> <span>${CourseName}</span></h4>
            <h4><span>Lesson: </span> <span>${LessonName}</span></h4>
            <h4><span>Author: </span> <span title='${user.email}'>${user.fullName}</span></h4>
        </div>
        <div id='btn-edit-quiz'>
                <a href="admin/quizzes/edit?course=${dataPage.idCourse}&lesson=${dataPage.idLesson}&quiz=${dataPage.idQuiz}" class="btn btn-primary ct">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                </a>
        </div>
    </div>
    `;

    const tagDiv = document.createElement('div');
    const btnEditQuiz = divTop.querySelector('#btn-edit-quiz');
    if(!quizzes.isEdit){
        btnEditQuiz.replaceWith(tagDiv);
    }

    box2.append(divTop);
}

function quizChoiceComponent(questions, indexQuestion) {

    const divBox = document.createElement('div');
    divBox.classList.add('question-box', 'question-choice', 'isCorrectTrue');
    divBox.setAttribute('data-indexQuestion', indexQuestion);
    const stringIsCorrect = {
        0: 'isCorrectFalse',
        1: 'isCorrectTrue'
    }

    const questionName = normalizeWhitespace(questions.questionName);
    const note = normalizeWhitespace(questions.note);
    const idShowNote = `boxShowNote1id_${questions.id}`;

        divBox.innerHTML = `
        <div class="question-title"> 
             <span>${indexQuestion + 1}.&nbsp;</span>
             <div class='conten-editer'>${questionName}</div>
             <div class="box-btn-note"></div>
        </div>
        <div class="answers-choice-group"></div>
        `;

        if(note){
            const boxBtnNote = divBox.querySelector('.box-btn-note');
            boxBtnNote.innerHTML = `
                      <div class="btn-note">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15"> 
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                            </svg>
                        </div>
            `;
            const btnNote = boxBtnNote.querySelector('.btn-note');
            btnNote.onclick = function () {
                // temp 
                const boxShowNote = document.getElementById(idShowNote);
                if(boxShowNote) {
                    toggleShowNote(idShowNote);
                }
            }
        }

    const answers = questions.answersCMS;
    const answersGroup = divBox.querySelector('.answers-choice-group');
    answers.forEach((answer, index) => {
        let checked = '';
        if (answer.isCorrect) {
            checked = 'checked';
        }
        const label = document.createElement('label');
        label.classList.add('answers-choice-label');

        const answerName = normalizeWhitespace(answer.answerName);

        label.innerHTML = `
        <input type="radio" name="question_${questions.id}" id="question_${questions.id}" value="${answer.id}" ${checked}>
        <div class="box-answer">
        <span>${STTABC[index]}.&nbsp;</span>
        <div class='answer-editer'> ${answerName} </div>
        </div>
        `;
        answersGroup.appendChild(label);

        if (note) {
            const boxShowNote = document.createElement("div");
            boxShowNote.classList.add("boxShowNote1");
            boxShowNote.setAttribute("id", idShowNote);
            boxShowNote.innerHTML = `
              <p class="note-title" >Note:</p>
              <div class="boxShowNote2"> ${questions.note ?? ""} </div>
          `;
            divBox.appendChild(boxShowNote);
          }
    });

    return divBox;
}

function quizWriteComponent(Question, indexQuestion) {

    const divBox = document.createElement('div');
    divBox.classList.add('question-box', 'question-write', 'isCorrectTrue');
    divBox.setAttribute('data-indexQuestion', indexQuestion);
    const stringIsCorrect = {
        0: 'isCorrectFalse',
        1: 'isCorrectTrue'
    }

    const questionName = normalizeWhitespace(Question.questionName);

    const note = normalizeWhitespace(Question.note);
    const idShowNote = `boxShowNote1id_${Question.id}`;
    
    divBox.innerHTML = `
            <div class="question-title"> 
            <span>${indexQuestion + 1}.&nbsp;</span>
             <div class='conten-editer'>${questionName}</div>
                <div class="box-btn-note"></div>
            </div>
    `;

    if(note){
        const boxBtnNote = divBox.querySelector('.box-btn-note');
        boxBtnNote.innerHTML = `
                  <div class="btn-note">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15"> 
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                    </div>
        `;
        const btnNote = boxBtnNote.querySelector('.btn-note');
        btnNote.onclick = function () {
            // temp 
            const boxShowNote = document.getElementById(idShowNote);
            if(boxShowNote) {
                toggleShowNote(idShowNote);
            }
        }
    }
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your answer';
    input.value = Question.answersCMS.answerName ?? '';
    divBox.appendChild(input);
    if (note) {
      const boxShowNote = document.createElement("div");
      boxShowNote.classList.add("boxShowNote1");
      boxShowNote.setAttribute("id", idShowNote);
      boxShowNote.innerHTML = `
        <p class="note-title" >Note:</p>
        <div class="boxShowNote2"> ${Question.note ?? ""} </div>
    `;
      divBox.appendChild(boxShowNote);
    }

    return divBox;
}

function hanldMediaComponent(data) {
    if (!data) {
        return null;
    }
    if (data.type == 0) {
        return mediaAudioComponent(data);
    } else if (data.type == 1) {
        return mediaTextComponent(data);
    } else if (data.type == 2) {
        return mediaDriveAudio(data);
    } else if (data.type == 3) {
        return mediaYoutubeVideo(data);
    }
}

function mediaAudioComponent(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('media-audio');
    divBox.innerHTML = `
                <span>${data.title}</span>
                <audio controls>
                    <source src="public/media/${data.content}" type="audio/mpeg">
                </audio>
`;
    return divBox;
}

function mediaTextComponent(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('media-text');
    divBox.innerHTML = `
    <span>${data.title}</span>
    <div class="textContents ql-container ql-snow ql-editor">${data.content}</div>
`;
    return divBox;
}

function mediaDriveAudio(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('mediaDriveAudio');
    divBox.innerHTML = `
    <span>${data.title}</span>
    <iframe src="${data.content}" frameborder="0"></iframe>
    `;
    return divBox;
}

function mediaYoutubeVideo(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('mediaYoutubeVideo');
    divBox.innerHTML = `
                <span>${data.title}</span>
                <div class="preview">
                    <div class="preview1">
                        ${data.content}
                    </div>
                </div>
    `;
    return divBox;
}

function handlEmptyChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function normalizeWhitespace(quillContent) {
    // return quillContent;
    if (!quillContent) return ""; // Nếu nội dung rỗng, trả về chuỗi rỗng
    return quillContent
        .replace(/&nbsp;/g, ' ')  // Chuyển `&nbsp;` thành khoảng trắng bình thường
        .trim();                  // Xóa khoảng trắng đầu và cuối
}

function toggleShowNote(idShowNote) {
    const boxShowNote = document.getElementById(idShowNote);
    const allNotes = document.querySelectorAll('.boxShowNote1.active');
    allNotes.forEach(note => {
        if (note.id !== idShowNote) {
            note.classList.remove('active');
        }
    });
    if (boxShowNote) {
        boxShowNote.classList.toggle('active');
    }
}