// import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from "../allmodule.js";

// khung tĩnh
const divRoot = document.getElementById('root');
divRoot.innerHTML = `

<div class="dv-addquiz">
    <h4 class="dv-title-filter">Add Quiz</h4>
    <div class="dv-box dv-box-1">
        <form action="" id="dv-form-addquiz">
            <div class="choose-course-lesson">
                <div class="form-group">
                    <label for="txtSearch">Courses</label>
                    <select class="form-control" name="idClass" id="id-course-filter">
                        <option value="" disabled selected>Please choose class</option>
                    </select>
                </div>
                <div class="form-group" id="box-lesson">
                    <label for="txtSearch">Lessons</label>
                    <select class="form-control" name="idClass" id="id-lesson-filter">
                        <option value="" disabled selected>Please choose lesson</option>
                    </select>
                </div>
            </div>
            <div class="dv-quiz-name">
                <div class="form-group">
                    <label for="txtSearch">Quiz Name</label>
                    <input type="text" name="question" id="quiz-name" class="form-control"
                        placeholder="Enter Quiz Name">
                </div>
            </div>

            <div class="choose-quiz-media">
                <div class="left">
                    <hr>
                    <span>Media</span>
                    <hr>
                </div>
                <div class="right">
                    <div class="form-group">
                        <select class="form-control" name="idClass" id="select-type-media">
                            <option value="">None</option>
                            <option value="1">Text</option>
                            <option value="2">Audio Drive</option>
                            <option value="3">Video YouTube</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-primary" id="btn-type-media">Add Media</button>
                </div>
            </div>

            <div class="dv-quiz-media" id="box-media">
            </div>
            <div class="dv-title-question">
                <hr>
                <span>Questions</span>
                <hr>
            </div>

            <div class="dv-list-question" id="quiz-list-question">
            </div>
            <div class="dv-btn-add-question">
                <button type="button" class="btn btn-primary" id="btn-add-question-choose">Add Question Choose</button>
                <button type="button" class="btn btn-primary" id="btn-add-question-truefalse">Add Question
                    True/False</button>
                <button type="button" class="btn btn-primary" id="btn-add-question-write">Add Question Write</button>
            </div>
            <div class="dv-quiz-btn-submit">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
</div>
`;

// variable global

const Quizzes = {
    idCourse: null,
    idLesson: null,
    quizName: null,
    media: null,
    questions: []
};

let questionIdCounter = 0;
let idatmp = 0;

// lấy khóa học và bài học
(async () => {
    let divLoading = document.querySelector('.choose-course-lesson');
    const EselectCourse = document.getElementById('id-course-filter');
    try {
        mbLoading(true, divLoading);
        const courses = await mbFetch('admin/quizzes/getCourses');

        const fragment = document.createDocumentFragment();
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.courseName;
            fragment.appendChild(option);
        });
        EselectCourse.appendChild(fragment);
        EselectCourse.addEventListener('change', changeCourses);
    }
    catch (error) {
        console.log(error);
    } finally {
        mbLoading(false, divLoading);
    }
})();

async function changeCourses(e) {
    Quizzes.idCourse = parseInt(e.target.value);
    Quizzes.idLesson = null;
    let divLoading = document.querySelector('.choose-course-lesson');
    const EselectLesson = document.getElementById('id-lesson-filter');
    emptyElement(EselectLesson);
    if (isNaN(e.target.value)) return;
    const idCourse = parseInt(e.target.value);
    const url = `admin/quizzes/getLessonByCourseId/${idCourse}`;
    const optiondefault = document.createElement('option');
    optiondefault.value = '';
    optiondefault.selected = true;
    optiondefault.disabled = true;
    try {
        mbLoading(true, divLoading);
        const lessons = await mbFetch(url);
        if (lessons.length === 0) {
            optiondefault.textContent = 'No lesson';
            EselectLesson.appendChild(optiondefault);
            return;
        } else {
            optiondefault.textContent = 'Please choose lesson';
            EselectLesson.appendChild(optiondefault);
        }
        const fragment = document.createDocumentFragment();
        lessons.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson.id;
            option.textContent = lesson.lessonName;
            fragment.appendChild(option);
        });
        EselectLesson.appendChild(fragment);
        EselectLesson.addEventListener('change', changeLessons);
    } catch (error) {
        console.log(error);
    } finally {
        mbLoading(false, divLoading);
    }
}

function changeLessons(e) {
    const idLesson = e.target.value || null;
    Quizzes.idLesson = parseInt(idLesson);
}

// add quiz name 

(() => {
    const quizName = document.getElementById('quiz-name');
    quizName.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.quizName = value || null;
    }
})();

// add media

(() => {
    const boxMedia = document.getElementById('box-media');
    const EselectMedia = document.getElementById('select-type-media');
    const btnMedia = document.getElementById('btn-type-media');
    btnMedia.addEventListener('click', () => {
        const typeMedia = EselectMedia.value;
        if (typeMedia == '') {
            Quizzes.media = null;
            emptyElement(boxMedia);
            return;
        }
        const media = {
            title: null,
            type: null,
            content: null
        }
        if (typeMedia == 0) {
            media.type = 0;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 0) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(componentMediaAudio());
        } else if (typeMedia == 1) {
            media.type = 1;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 1) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(componentMediaText());
        } else if (typeMedia == 2) {
            media.type = 2;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 2) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(compoentMediaAudioDrive());
        } else if (typeMedia == 3) {
            media.type = 3;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 3) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(compoentMediaVideoYtb());
        }
    });
})();

// add question

(() => {

    const boxQuestion = document.getElementById('quiz-list-question');
    const btnChoose = document.getElementById('btn-add-question-choose');
    const btnTrueFalse = document.getElementById('btn-add-question-truefalse');
    const btnWrite = document.getElementById('btn-add-question-write');

    btnChoose.addEventListener('click', () => {
        boxQuestion.appendChild(componentQuestionChoose());
    });

    btnTrueFalse.addEventListener('click', () => {
        boxQuestion.appendChild(componentQuestionTrueFalse());
    });

    btnWrite.addEventListener('click', () => {
        boxQuestion.appendChild(componentQuestionWrite());
    });

})();

const removeBorderRed = (e) => {
    const arrBorderRed = document.querySelectorAll('.dv-border-red');
    arrBorderRed.forEach((item) => {
        item.classList.remove('dv-border-red');
    });
    document.removeEventListener('click', removeBorderRed);
}

// submit

const formAddQuiz = document.getElementById('dv-form-addquiz');
formAddQuiz.addEventListener('submit', async function (e) {
    e.preventDefault();

    // validate Quizzes để gửi lên server
    if (Quizzes.idLesson === null) {
        mbNotification('Warrning', 'Please choose lesson', 3, 2);
        const boxlesson = document.getElementById('id-lesson-filter');
        boxlesson.scrollIntoView({ behavior: 'smooth', block: 'center' });
        boxlesson.classList.add('dv-border-red');
        document.addEventListener('click', removeBorderRed);
        return;
    }

    if (Quizzes.quizName === null) {
        mbNotification('Warrning', 'Please enter quiz name', 3, 2);
        const quizName = document.getElementById('quiz-name');
        quizName.scrollIntoView({ behavior: 'smooth', block: 'center' });
        quizName.classList.add('dv-border-red');
        document.addEventListener('click', removeBorderRed);
        return;
    }

    if (Quizzes.media !== null) {
        const typeMedia = Quizzes.media.type;
        const obmesaage = {
            0: 'Please choose file audio',
            1: 'Please enter content text',
            2: 'Please enter link audio drive',
            3: 'Please enter iframe video youtube'
        }
        const mesaage = obmesaage[typeMedia];
        if (Quizzes.media.content === null) {
            mbNotification('Warrning', mesaage, 3, 2);
            const boxMedia = document.querySelector('#box-media');
            boxMedia.scrollIntoView({ behavior: 'smooth', block: 'center' });
            boxMedia.classList.add('dv-border-red');
            document.addEventListener('click', removeBorderRed);
            return;
        }

        const check = checkTextLength(Quizzes.media.content, 'TEXT');
        if(!check.isValidForMySQL){
            mbNotification('Warrning', 'Dữ liệu có kích thước quá lớn', 3, 2);
            const boxMedia = document.querySelector('#box-media');
            boxMedia.scrollIntoView({ behavior: 'smooth', block: 'center' });
            boxMedia.classList.add('dv-border-red');
            document.addEventListener('click', removeBorderRed);
            return;
        }
    }

    if (Quizzes.questions.length === 0) {
        mbNotification('Warrning', 'Please add question', 3, 2);
        return;
    }


    for (let i = 0; i < Quizzes.questions.length; i++) {
        const question = Quizzes.questions[i];
        const boxQuestion = document.getElementById('box-question-' + question.idtmp);
        if (question.questionName === null) {
            mbNotification('Warrning', 'Please enter question name', 3, 2);
            boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            boxQuestion.classList.add('dv-border-red');
            document.addEventListener('click', removeBorderRed);
            return;
        }

        if (question.typeAnswers === 0) {
            let isCorrect = false;
            for (let j = 0; j < question.answers.length; j++) {
                const answer = question.answers[j];
                if (answer.answerName === null) {
                    mbNotification('Warrning', 'Please enter answer name', 3, 2);
                    boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    boxQuestion.classList.add('dv-border-red');
                    document.addEventListener('click', removeBorderRed);
                    return;
                }
                if (answer.isCorrect) {
                    isCorrect = true;
                }
            }
            if (!isCorrect) {
                mbNotification('Warrning', 'Please choose answer correct', 3, 2);
                boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                boxQuestion.classList.add('dv-border-red');
                document.addEventListener('click', removeBorderRed);
                return;
            }
        } else if (question.typeAnswers === 1) {
            if (question.answers.answerName === null) {
                mbNotification('Warrning', 'Please enter answer name', 3, 2);
                boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                boxQuestion.classList.add('dv-border-red');
                document.addEventListener('click', removeBorderRed);
                return;
            }
            if (question.answers.answerName === null) {
                mbNotification('Warrning', 'Please enter answer name', 3, 2);
                boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                boxQuestion.classList.add('dv-border-red');
                document.addEventListener('click', removeBorderRed);
                return;
            }
        }
    }

    // gửi lên server

    const main = document.querySelector('main');
    try {
        mbLoading(true);
        const dataRes = await mbFetch('admin/quizzes/addQuiz', Quizzes);
        if (dataRes.error) {
            console.error('DuyVan: ', dataRes.error);
            mbNotification('Error', dataRes.error, 2, 2.5);
            return;
        }
        mbNotification('Success', dataRes.message, 1, 2.5);
        resetPage();
    } catch (error) {
        console.log(error);
    } finally {
        mbLoading(false);
    }



});



// reset new quiz

function resetPage() {
    Quizzes.quizName = null;
    Quizzes.media = null;
    Quizzes.questions = [];
    questionIdCounter = 0;
    const boxMedia = document.getElementById('box-media');
    emptyElement(boxMedia);
    const boxQuestion = document.getElementById('quiz-list-question');
    emptyElement(boxQuestion);
    const form = document.getElementById('dv-form-addquiz');
    form.reset();
    const EselectCourse = document.getElementById('id-course-filter');
    EselectCourse.value = Quizzes.idCourse;
    const EselectLesson = document.getElementById('id-lesson-filter');
    EselectLesson.value = Quizzes.idLesson;
}


// compoent
function componentMediaAudio() {
    const div = document.createElement('div');
    div.classList.add('div-media-audio');
    const html = `
                <div class="form-group">
                    <label for="">Title media</label>
                    <input type="text" name="title-audio" id="" class="form-control" placeholder="Enter title Audio">
                </div>
                <div class="file-audio">
                    <div class="file-audio-input">
                        <label for="file-audio">Choose Audio</label>
                        <input type="file" name="file-audio" id="file-audio" class="form-control">
                    </div>
                    <div class="file-audio-preview">
                        <audio controls>
                            <source src="#" type="audio/mpeg">
                        </audio>
                    </div>
                </div>
    `;
    div.innerHTML = html;

    const titleAudio = div.querySelector('input[name=title-audio]');
    titleAudio.oninput = function (e) {
        const value = e.target.value;
        Quizzes.media.title = value;
    }

    const fileAudio = div.querySelector('input[type=file]');
    fileAudio.onchange = function (e) {
        const file = e.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            const reader = new FileReader();
            // Đọc file dưới dạng base64 (hoặc có thể là binary)
            reader.onload = function (event) {
                // Gán nội dung file vào object Quizzes
                Quizzes.media.content = event.target.result;
                // Hiển thị file âm thanh đã chọn (tùy chọn)
                const audioPreview = div.querySelector('.file-audio-preview audio source');
                audioPreview.src = URL.createObjectURL(file);
                audioPreview.parentElement.load(); // Tải lại để phát tệp mới
            };
            reader.readAsDataURL(file);
        } else {
            mbNotification('Warrning', 'Not Type MP3', 3, 2);
        }
    };
    return div;
}

function componentMediaText() {
    const div = document.createElement('div');
    div.classList.add('dv-media-text');

        const html = `
        <div class="form-group">
        <label for="">Title media</label>
        <input type="text" name="titletext" id="" class="form-control" placeholder="Enter title text">
        </div>
        <div class="form-group">
        <label for="">Content Media</label>
              <div>
                <div id="contentmedia" class="editor"></div>
            </div>
        </div>
        `;

    div.innerHTML = html;

    const titleText = div.querySelector('input[name=titletext]');
    titleText.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.media.title = value;
    }

    const callback = (value) => {
        Quizzes.media.content = value || null;
    }
    initQuillDeboun('#contentmedia', 'Nội dung bài đọc...', callback,350);

    return div;
}

function compoentMediaAudioDrive() {
    const div = document.createElement('div');
    div.classList.add('dv-media-audio-drive');
    div.innerHTML = `
                <a href="https://docs.google.com/document/d/1bwcO5BRMi4yIYxxchLxG5jtEtxWXMmBQ/edit?usp=drive_link&ouid=103986830156427311078&rtpof=true&sd=true" class="huongdanmb" target="_blank">Totorial</a>
                <div class="form-group">
                    <label for="">Title media</label>
                    <input type="text" name="titleaudiodrive" class="form-control" placeholder="Enter title text">
                </div>
                <div class="form-group">
                    <label for="">Content Media</label>
                    <input type="text" name="contentdrive" placeholder="Enter link audio drive">
                </div>
                <div class="preview"></div>
    `;

    const preview = div.querySelector('.preview');
    const title = div.querySelector('input[name=titleaudiodrive]');
    title.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.media.title = value || null;
    }

    const content = div.querySelector('input[name=contentdrive]');

    content.oninput = function (e) {
        const link = e.target.value;
        const regex = /\/d\/(.+?)\//;
        const match = link.match(regex);
        if (match && match[1]) {
            const fileId = match[1];
            // Tạo URL nhúng cho iframe
            const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
            Quizzes.media.content = embedUrl;
            // Tạo iframe và đặt URL nhúng
            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.allow = "autoplay";  // Cho phép phát tự động nếu cần
            iframe.frameBorder = "0";
            // Xóa iframe cũ nếu có và thêm iframe mới vào div
            emptyElement(preview);
            preview.appendChild(iframe);  // Thêm iframe vào div
        } else {
            mbNotification('Warrning', 'Not link drive', 3);
            emptyElement(preview);
            Quizzes.media.content = null;
        }
    }

    return div;
}

function compoentMediaVideoYtb() {
    const div = document.createElement('div');
    div.classList.add('dv-media-video-ytb');
    div.innerHTML = `
                <a href="https://docs.google.com/document/d/1TKp2lBRqdLk7yLNFqYOoeixxRmZ1dYO8/edit?usp=drive_link&ouid=103986830156427311078&rtpof=true&sd=true" class="huongdanmb" target="_blank">Totorial</a>
                <div class="form-group">
                    <label for="">Title media</label>
                    <input type="text" name="title"  class="form-control" placeholder="Enter title">
                </div>
                <div class="form-group">
                    <label for="">Content Media</label>
                    <input type="text" name="contentytb" placeholder="Enter iframe video youtube">
                </div>
                <div class="preview"></div>
    `;

    const title = div.querySelector('input[name=title]');
    title.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.media.title = value || null;
    }

    const content = div.querySelector('input[name=contentytb]');
    content.oninput = function (e) {
        const preview = div.querySelector('.preview');
        let textIframe = e.target.value;
        textIframe = textIframe.trim();
        console.log(textIframe);

        const firstString = "<iframe";
        const lastString = "</iframe>";

        // Tìm vị trí của thẻ mở và thẻ đóng
        const startIdx = textIframe.indexOf(firstString);
        const endIdx = textIframe.indexOf(lastString);
        let stringIframe = null;
        if (startIdx !== -1 && endIdx !== -1) {
            // Lấy nội dung từ thẻ mở đến thẻ đóng
            stringIframe = textIframe.slice(startIdx, endIdx + lastString.length);
        } else {
            mbNotification('Warrning', 'Not iframe youtube', 3);
            emptyElement(preview);
            Quizzes.media.content = null;
            return;
        }
        Quizzes.media.content = stringIframe;
        emptyElement(preview);
        const preview1 = document.createElement('div');
        preview1.classList.add('preview1');
        preview1.innerHTML = stringIframe;
        preview.appendChild(preview1);
    }
    return div;
}

function componentQuestionChoose() {

    const stt = getOdinal();
    const currentId = ++questionIdCounter;
    

    const question = {
        idtmp: currentId,
        questionName: null,
        typeAnswers: 0,
        answers: [],
        note: null
    };

    Quizzes.questions.push(question);

    const div = document.createElement('div');
    div.classList.add('dv-question-choose');
    div.id = 'box-question-' + currentId;

    const html = `
                <div class="dv-question-info">
                    <span>${stt}. Question Choose</span>
                    <div class="dv-question-option">
                        <button type="button" class="btn btn-danger" name="del-question" >Delete</button>
                    </div>
                </div>
                <div class="" style="margin-top: 10px;">
                    <div id="questionEditor${currentId}" class="editor"></div>
                </div>
                <div class="answers">

                </div>
                <div class="dv-add-answer">
                    <button type="button" >+</button>
                </div>
                <div class="dv-note">
                    <div id="dvnote_${currentId}"></div>
                </div>
    `;

    div.innerHTML = html;

    const callBackInputQuestion = (value) => {
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        Quizzes.questions[indexQuestion].questionName = value || null; // Gán vào object question
    }
    initQuillDeboun(`#questionEditor${currentId}`, 'Nhập câu hỏi ở đây...', callBackInputQuestion,350);

    const callBackInputNote = (value) => {
      console.log(value);
      let indexQuestion = getIndexQuestion(currentId);
      if (indexQuestion === -1) return;
      Quizzes.questions[indexQuestion].note = value || null; // Gán vào object question
    };
    initQuillDeboun(`#dvnote_${currentId}`, 'Nhập ghi chú...', callBackInputNote,350);

    const answers = div.querySelector('.answers');
    for (let i = 0; i < 4; i++) {
        answers.appendChild(boxAnswer(currentId, idatmp++));
    }

    const btnAddAnswer = div.querySelector('.dv-add-answer button');
    btnAddAnswer.onclick = function (e) {
        answers.appendChild(boxAnswer(currentId, idatmp++));
    }

    function boxAnswer(currentId,idatmp) {

        const answer = {
            answerName: null,
            isCorrect: false,
            idatmp: idatmp
        };
        question.answers.push(answer);

        const div = document.createElement('div');
        div.classList.add('group-answer');

        let html = `
            <input type="radio" name="answer_${currentId}" id="">
            <div class="box-editor">
                <div id="answerEditor${idatmp}" class="editor"></div>
            </div>
            <button type="button" class="del-answer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            </button>
        `;

        div.innerHTML = html;

        const callBackInputAnswer = (value) => {
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        const indexAnswer = getIndexAnswer(currentId, idatmp);
        if(indexAnswer === -1) return;
        Quizzes.questions[indexQuestion].answers[indexAnswer].answerName = value || null; // Gán vào object question
        }
        initQuillDeboun(`#answerEditor${idatmp}`, 'Nhập câu trả lời ở đây...', callBackInputAnswer,350);

        const inputradio = div.querySelector('input[type=radio]');
        inputradio.onchange = function (e) {
            const indexQuestion = getIndexQuestion(currentId);
            if(indexQuestion === -1) return;
            const indexAnswer = getIndexAnswer(currentId, idatmp);
            if(indexAnswer === -1) return;
            Quizzes.questions[indexQuestion].answers.forEach((ans, i) => {
                ans.isCorrect = i === indexAnswer;
            });
        }

        const btnDel = div.querySelector('button.del-answer');
        btnDel.onclick = function (e) {

            const total = question.answers.length;
            if (total <= 2) {
                mbNotification('Warrning', 'Min 2 answer', 3, 2);
                return;
            }

            let indexQuestion = getIndexQuestion(currentId);
            if(indexQuestion === -1) return;
            let indexAnswer = getIndexAnswer(currentId, idatmp);
            if(indexAnswer === -1) return;
            if(Quizzes.questions[indexQuestion].answers[indexAnswer].isCorrect){
                mbNotification('Warrning', 'Can not delete answer correct', 3, 2);
                return;
            }

            Quizzes.questions[indexQuestion].answers.splice(indexAnswer, 1);
            div.remove();
        }

        return div;
    }

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = function (e) {
        Quizzes.questions = Quizzes.questions.filter(q => q.idtmp !== currentId);
        div.remove();
    }
    return div;
}

function componentQuestionTrueFalse() {

    const stt = getOdinal();

    const currentId = ++questionIdCounter;

    const question = {
        idtmp: currentId,
        questionName: null,
        typeAnswers: 0,
        answers: [
            {
                answerName: "True",
                isCorrect: false
            },
            {
                answerName: "False",
                isCorrect: false
            }
        ],
        note: null
    };

    Quizzes.questions.push(question);

    const div = document.createElement('div');
    div.classList.add('dv-question-choose', 'true-false');
    div.id = 'box-question-' + currentId;
    const html = `
                <div class="dv-question-info">
                    <span>${stt}. Question True/False</span>
                    <div class="dv-question-option">
                        <button type="button" class="btn btn-danger" name='del-question' >Delete</button>
                    </div>
                </div>
                    <div class="" style="margin-top: 10px;">
                    <div id="questionEditor${currentId}" class="editor"></div>
                    </div>
                <div class="answers">
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="" value="1">
                        <input type="text" placeholder="Answer 1" value="True" disabled>
                    </div>
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="" value="0">
                        <input type="text" placeholder="Answer 2" value="False" disabled>
                    </div>
                </div>
                <div class="dv-note">
                    <div id="dvnote_${currentId}"></div>
                </div>
    `;
    div.innerHTML = html;

    const callBackInputQuestion = (value) => {
        const indexQuestion = getIndexQuestion(currentId);
        if (indexQuestion === -1) return;
        Quizzes.questions[indexQuestion].questionName = value || null; // Gán vào object question
    }
    initQuillDeboun(`#questionEditor${currentId}`, 'Nhập câu hỏi ở đây...', callBackInputQuestion,350);

    const callBackInputNote = (value) => {
      const indexQuestion = getIndexQuestion(currentId);
      if (indexQuestion === -1) return;
      Quizzes.questions[indexQuestion].note = value || null; // Gán vào object question
    };
    initQuillDeboun(`#dvnote_${currentId}`, 'Nhập ghi chú...', callBackInputNote,350);

    const inputradio = div.querySelectorAll('input[type=radio]');
    inputradio.forEach((radio, index) => {
        radio.onchange = function (e) {
            const indexQuestion = getIndexQuestion(currentId);
            if (indexQuestion === -1) return;
            Quizzes.questions[indexQuestion].answers.forEach((ans, i) => {
                ans.isCorrect = i === index;
            });
        }
    });

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = function (e) {
        Quizzes.questions = Quizzes.questions.filter(q => q.idtmp !== currentId);
        div.remove();
    }
    return div;
}

function componentQuestionWrite() {

    const stt = getOdinal();

    const currentId = ++questionIdCounter;

    const question = {
        idtmp: currentId,
        questionName: null,
        typeAnswers: 1,
        answers:
        {
            answerName: null,
            isCorrect: true
        },
        note: null
    }

    Quizzes.questions.push(question);

    const div = document.createElement('div');
    div.classList.add('dv-question-write');
    div.id = 'box-question-' + currentId;
    const html = `
                <div class="dv-question-info">
                    <span>${stt}. Question Write</span>
                    <div class="dv-question-option">
                        <button type="button" class="btn btn-danger" name="del-question" >Delete</button>
                    </div>
                </div>
                <div class="" style="margin-top: 10px;">
                <div id="questionEditor${currentId}" class="editor"></div>
                </div>
                <input type="text" placeholder="Answer" name="answer">
                <div class="dv-note">
                    <div id="dvnote_${currentId}"></div>
                </div>
    `;
    div.innerHTML = html;

    const callBackInputQuestion = (value) => {
      const indexQuestion = getIndexQuestion(currentId);
      if (indexQuestion === -1) return;
      Quizzes.questions[indexQuestion].questionName = value || null; // Gán vào object question
    };
    initQuillDeboun(`#questionEditor${currentId}`, 'Nhập câu hỏi ở đây...', callBackInputQuestion,350);

    const callBackInputNote = (value) => {
      const indexQuestion = getIndexQuestion(currentId);
      if (indexQuestion === -1) return;
      Quizzes.questions[indexQuestion].note = value || null; // Gán vào object question
    };
    initQuillDeboun(`#dvnote_${currentId}`, 'Nhập ghi chú...', callBackInputNote,350);

    const answer = div.querySelector('input[name=answer]');
    answer.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        const indexQuestion = getIndexQuestion(currentId);
        if (indexQuestion === -1) return;
        Quizzes.questions[indexQuestion].answers.answerName = value || null; // Gán vào object question
    }

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = function (e) {
        Quizzes.questions = Quizzes.questions.filter(q => q.idtmp !== currentId);
        div.remove();
    }

    return div;
}

function getOdinal(){
    let total = Quizzes.questions.length;
    return total + 1;
}

// library
function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}



// library

function mbNotification(title = 'Nhập tiêu đề thông báo.', mess = 'Nhập nội dung thông báo.', type = 2, time = 1.5){
    let bodynotificationall = document.querySelector('.body-notification-all');
    if(!bodynotificationall){
        bodynotificationall = document.createElement('div');
        bodynotificationall.classList.add('body-notification-all');
        document.body.appendChild(bodynotificationall);
    }

    const getType = [
        {
            name: 'success',
            color: '#2DCE89',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>`,
        },
        {
            name: 'error',
            color: '#d60000',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>`,
        },
        {
            name: 'warning',
            color: '#FB6340',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>`,
        },
        {
            name: 'info',
            color: '#007bff',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>`,
        },
    ];
    const oneType = getType[type - 1] || getType[1];

    const divTemp = document.createElement('div');
    divTemp.innerHTML = `
        <div class="body-notification-all-box" style="--mb-notif-color: ${oneType.color}">
            <div class="body-notification-all-box-icon">
                ${oneType.icon}
            </div>
            <div class="body-notification-all-box-content">
                <p>${title}</p>
                <p>${mess}</p>
            </div>
            <div class="body-notification-all-box-close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
    `;

    const box = divTemp.querySelector('.body-notification-all-box');
    box.style.animation = `notifFadeIn .3s ease-in-out forwards, notifFadeOut .3s ease-in-out ${time + 0.3}s forwards`;
    // khi bấm xóa thì thêm hiệu ứng notifFadeOut xong rồi mới xóa
    const close = divTemp.querySelector('.body-notification-all-box-close');

     const removebox = function(e){
        if(e.animationName == 'notifFadeOut'){
            divTemp.remove();
        }
    }
    box.onanimationend = removebox;
    close.onclick = function(){
        box.style.animation = 'none';
        setTimeout(() => {
            box.style.animation = 'notifFadeOut .3s ease-in-out';
        }, 10);
    }
    bodynotificationall.appendChild(divTemp);
}

function mbLoading(status = false, parentNode = null){
    if(!status){
        if(parentNode){
            parentNode.classList.remove('mbloadingoverflowhiddenandrelative');
            const ELoading = parentNode.querySelector('.mbLoadingAbsolute');
            if(ELoading){
                ELoading.remove();
            }
        }else{
            const ELoading = document.querySelector('.mbLoadingFixed');
            if(ELoading){
                ELoading.remove();
            }
        }
        return;
    }
    let bodyloading = null;
    const loadingContainer = document.createElement('div');
    if(parentNode){
        bodyloading = parentNode;
        const loadingold = parentNode.querySelector('.mbLoadingAbsolute');
        if(loadingold){
            loadingold.remove();
        }
        bodyloading.classList.add('mbloadingoverflowhiddenandrelative');
        loadingContainer.classList.add('mbLoadingAbsolute');
    }else{
        const loadingold = document.querySelector('.mbLoadingFixed');
        if(loadingold){
            loadingold.remove();
        }
        bodyloading = document.querySelector('body');
        loadingContainer.classList.add('mbLoadingFixed');
    }
    loadingContainer.innerHTML = `
    <div class="mb-dots-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
    `;
    bodyloading.appendChild(loadingContainer);
}

function mbFetch(url, data = null){
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null,
        })
        .then(response => {
            if(response.ok){
                return response.json()
                .catch(() => { 
                    const baseElement = document.querySelector('base');
                    let fullurl = baseElement ? baseElement.href + url : window.location.origin + url;
                    throw 'Duy Vấn: Dữ liệu không phải json, hãy kiểm tra trên server có trả về json không, đúng đường dẫn không, kiểm tra URL: ' + fullurl;
                });
            }
            throw new Error('Duy Vấn: Lỗi status, không phải 200 đến 299 hoặc do lỗi mạng, Error_Code: ' + response.status);
        })
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
}

function initQuillDeboun(selector, placeholder = '', onChangeCallback = null, delay = 300) {
    let quill = null;
  
    function debounce(callback, delay = 300) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          callback.apply(this, args);
        }, delay);
      };
    }
  
    function tryInit() {
      const el = document.querySelector(selector);
      if (!el) {
        requestAnimationFrame(tryInit); // Chưa có element thì thử lại ở frame tiếp theo
        return;
      }
  
      quill = initializeQuill(selector, placeholder);
  
      if (typeof onChangeCallback === 'function') {
        const handler = debounce(function () {
          let value = quill.root.innerHTML.trim();
          if(quill.getText().trim() === ''){
            value = null;
          }
          onChangeCallback(value);
        }, delay);
  
        quill.on("text-change", handler);
      }
    }
    requestAnimationFrame(tryInit); // Khởi tạo sau khi DOM sẵn sàng
    return quill;
  }
  

function initializeQuill(selector, placeholder = '') {
    return new Quill(selector, {
        theme: 'snow',
        placeholder: placeholder, 
        modules: {
            toolbar: [
                [{ 'size': ['small', false, 'large', 'huge'] }], // Thêm font size
                ['bold', 'italic', 'underline','strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ align: [] }], // Text alignment
                ['clean'], // Remove formatting
                ['image']
            ]
        }
    });
}



function checkTextLength(inputText,type = 0) {
    const charCount = inputText.length;
    const byteCount = new TextEncoder().encode(inputText).length;
  
    let isValid = false;
    if(type == 'TEXT'){
        isValid =  byteCount <= 65535;
    }else if(type == 'MEDIUMTEXT'){
        isValid =  byteCount <= 16777215;
    } else if(type == 'LONGTEXT'){
        isValid =  byteCount <= 4294967295;
    } else{
        isValid =  byteCount <= type;
    }

    return {
      charCount: charCount,
      byteCount: byteCount,
      isValidForMySQL: isValid
    };
  }
  
function getIndexQuestion(idtmp){
    return Quizzes.questions.findIndex(q => q.idtmp === idtmp);
}

function getIndexAnswer(idtmp,idatmp){
    const indexQuestion = getIndexQuestion(idtmp);
    if(indexQuestion === -1) return -1;
    return Quizzes.questions[indexQuestion].answers.findIndex(ans => ans.idatmp === idatmp);
}