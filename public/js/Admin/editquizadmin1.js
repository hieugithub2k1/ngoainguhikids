// import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from "../allmodule.js";

const divRoot = document.getElementById('root');
divRoot.innerHTML = `

<div class="dv-addquiz">
    <h4 class="dv-title-filter">Edit Quiz</h4>
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
                <button type="button" class="btn btn-primary" id="btn-update">Update</button>
            </div>
        </form>
    </div>
</div>

`;

// variable global

const urlParams = new URLSearchParams(window.location.search);
const idCourse = parseInt(urlParams.get('course'));
const idLesson = parseInt(urlParams.get('lesson'));
const idQuiz = parseInt(urlParams.get('quiz'));

const currentId = {
    idCourse: idCourse,
    idLesson: idLesson,
    idQuiz: idQuiz
}

if (isNaN(idCourse) || isNaN(idLesson) || isNaN(idQuiz)) {
    window.location.href = 'admin/quizzes';
}


let arridCurrentQuestion = [];

const quizEditPayload = {
    idCourse: idCourse,
    idLesson: idLesson,
    idQuiz: idQuiz,
    quizName: null,
    mediaCMS: null,
    arridQuestionDelete: [],
    questionsCMS: []
};

let questionIdCounter = 1;
let idatmp = 0;



// lấy course và lesson

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
            if (course.id == idCourse) {
                option.selected = true;
                getLesson(course.id);
            }
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
    if (isNaN(e.target.value)) return;
    const idCourse = parseInt(e.target.value);
    quizEditPayload.idCourse = idCourse;
    quizEditPayload.idLesson = null;
    getLesson(idCourse);
}

async function getLesson(idCourse) {
    let divLoading = document.querySelector('.choose-course-lesson');
    const EselectLesson = document.getElementById('id-lesson-filter');
    emptyElement(EselectLesson);
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
            if (lesson.id == idLesson) {
                option.selected = true;
                quizEditPayload.idLesson = idLesson;
            }
            fragment.appendChild(option);
        });
        EselectLesson.appendChild(fragment);
        EselectLesson.addEventListener('change', function (e) {
            if (isNaN(e.target.value)) return;
            quizEditPayload.idLesson = parseInt(e.target.value);
        });
    } catch (error) {
        console.log(error);
    } finally {
        mbLoading(false, divLoading);
    }
}

// lấy quiz cũ

(async () => {
    const url = "admin/quizzes/getQuizEdit";
    try {
        mbLoading(true);
        const data = await mbFetch(url, currentId);
        renderQuiz(data);
    } catch (error) {
        console.log(error);
    } finally {
        mbLoading(false);
    }

})();


function renderQuiz(data) {
    console.log('datarender', data);
    quizEditPayload.idCourse = parseInt(data.idCourse);
    quizEditPayload.idLesson = parseInt(data.idLesson);
    quizEditPayload.arridQuestionDelete = [];
    quizEditPayload.questionsCMS = [];

    const quizName = document.getElementById('quiz-name');
    quizName.value = data.quizName;
    quizEditPayload.quizName = data.quizName;

    // render 
    quizEditPayload.mediaCMS = data.mediaCMS;
    const boxMedia = document.getElementById('box-media');
    emptyElement(boxMedia);
    if (data.mediaCMS !== null) {
        quizEditPayload.mediaCMS.action = null;
        const typeMedia = parseInt(data.mediaCMS.type);
        switch (typeMedia) {
            case 0:
                boxMedia.appendChild(componentMediaAudio(data.mediaCMS));
                break;
            case 1:
                boxMedia.appendChild(componentMediaText(data.mediaCMS));
                break;
            case 2:
                boxMedia.appendChild(compoentMediaAudioDrive(data.mediaCMS));
                break;
            case 3:
                boxMedia.appendChild(compoentMediaVideoYtb(data.mediaCMS));
                break;
        }

        const Eselecttypemedia = document.getElementById('select-type-media');
        Eselecttypemedia.value = typeMedia;
    }

    // render question

    const boxQuestion = document.getElementById('quiz-list-question');
    emptyElement(boxQuestion);
    arridCurrentQuestion = [];
    data.questionsCMS.forEach(question => {
        arridCurrentQuestion.push(parseInt(question.id));
        const typeQuestion = parseInt(question.typeAnswers);
        switch (typeQuestion) {
            case 0:
                const num = question.answersCMS.length;
                const pattern = ['True', 'False'];
                const isTrueFalse = num === 2 && question.answersCMS.every(item => pattern.includes(item.answerName));

                if (num == 2 && isTrueFalse) {
                    boxQuestion.appendChild(componentQuestionTrueFalse(question));
                } else {
                    boxQuestion.appendChild(componentQuestionChoose(question));
                }
                break;
            case 1:
                boxQuestion.appendChild(componentQuestionWrite(question));
                break;
        }
    });

}

// add quizName

(() => {
    const quizName = document.getElementById('quiz-name');
    quizName.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        quizEditPayload.quizName = value || null;
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
            quizEditPayload.mediaCMS = null;
            emptyElement(boxMedia);
            return;
        }
        const media = {
            title: null,
            type: null,
            content: null,
            action: 'create'
        }
        if (typeMedia == 0) {
            media.type = 0;
            if (quizEditPayload.mediaCMS !== null) {
                if (quizEditPayload.mediaCMS.type == 0) {
                    return;
                }
                emptyElement(boxMedia);
            }
            quizEditPayload.mediaCMS = media;
            boxMedia.appendChild(componentMediaAudio());
        } else if (typeMedia == 1) {
            media.type = 1;
            if (quizEditPayload.mediaCMS !== null) {
                if (quizEditPayload.mediaCMS.type == 1) {
                    return;
                }
                emptyElement(boxMedia);
            }
            quizEditPayload.mediaCMS = media;
            boxMedia.appendChild(componentMediaText());
        } else if (typeMedia == 2) {
            media.type = 2;
            if (quizEditPayload.mediaCMS !== null) {
                if (quizEditPayload.mediaCMS.type == 2) {
                    return;
                }
                emptyElement(boxMedia);
            }
            quizEditPayload.mediaCMS = media;
            boxMedia.appendChild(compoentMediaAudioDrive());
        } else if (typeMedia == 3) {
            media.type = 3;
            if (quizEditPayload.mediaCMS !== null) {
                if (quizEditPayload.mediaCMS.type === 3) {
                    return;
                }
                emptyElement(boxMedia);
            }
            quizEditPayload.mediaCMS = media;
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

function eventBorderRed(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('dv-border-red');
    setTimeout(() => {
        document.addEventListener('click', removeBorderRed);
    }, 1);
}

// submit 

const btnUpdate = document.getElementById('btn-update');
btnUpdate.addEventListener('click', async () => {

    // console.log(quizEditPayload);
    // return;

    if (quizEditPayload.idLesson === null) {
        const boxlesson = document.getElementById('box-lesson');
        mbNotification('Warrning', 'Please choose lesson', 3, 2);
        eventBorderRed(boxlesson);
        return;
    }

    if (quizEditPayload.quizName === null) {
        const quizName = document.getElementById('quiz-name');
        mbNotification('Warrning', 'Please enter quiz name', 3, 2);
        eventBorderRed(quizName);
        return;
    }

    if (quizEditPayload.mediaCMS !== null) {
        const typeMedia = quizEditPayload.mediaCMS.type;
        const obmesaage = {
            0: 'Please choose file audio',
            1: 'Please enter content text',
            2: 'Please enter link audio drive',
            3: 'Please enter iframe video youtube'
        }
        const mesaage = obmesaage[typeMedia];
        if (typeMedia == 0) {
            if (quizEditPayload.mediaCMS.content === null && quizEditPayload.mediaCMS.action === 'create') {
                const boxMedia = document.querySelector('#box-media');
                mbNotification('Warrning', mesaage, 3, 2);
                eventBorderRed(boxMedia);
                return;
            }
        } else if (quizEditPayload.mediaCMS.content === null) {
            const boxMedia = document.querySelector('#box-media');
            mbNotification('Warrning', mesaage, 3, 2);
            eventBorderRed(boxMedia);
            return;
        }
    }

    if (quizEditPayload.questionsCMS.length === 0) {
        mbNotification('Warrning', 'Please add question', 3, 2);
        return;
    }

    for (let i = 0; i < quizEditPayload.questionsCMS.length; i++) {
        const question = quizEditPayload.questionsCMS[i];
        const boxQuestion = document.getElementById('box-question-' + question.id);
        if (question.questionName === null) {
            mbNotification('Warrning', 'Please enter question name', 3, 2);
            eventBorderRed(boxQuestion);
            return;
        }

        if (question.typeAnswers == 0) {
            let isCorrect = false;
            for (let j = 0; j < question.answersCMS.length; j++) {
                const answer = question.answersCMS[j];
                if (answer.answerName === null) {
                    mbNotification('Warrning', 'Please enter answer name', 3, 2);
                    eventBorderRed(boxQuestion);
                    return;
                }
                if (answer.isCorrect) {
                    isCorrect = true;
                }
            }
            if (!isCorrect) {
                mbNotification('Warrning', 'Please choose answer correct', 3, 2);
                eventBorderRed(boxQuestion);
                return;
            }
        } else if (question.typeAnswers == 1) {
            if (question.answersCMS.answerName === null) {
                mbNotification('Warrning', 'Please enter answer name', 3, 2);
                eventBorderRed(boxQuestion);
                return;
            }
        }
    }

    // gửi lên server
    // console.log(quizEditPayload);
    // return;

    const confirm = await mbConfirm('Do you want to update quiz?');
    if (!confirm) return;
    const url = 'admin/quizzes/updateQuiz';
    try{
        mbLoading(true);

        const dataReq = {... quizEditPayload};
        dataReq.questionsCMS = quizEditPayload.questionsCMS.filter(q => q.action !== null);
        console.log(dataReq);
        const dataResponse = await mbFetch(url, quizEditPayload);
        if(dataResponse.error){
            mbNotification('Error', dataResponse.error, 2, 3);
            return;
        }
        
        updateUrl();
        mbNotification('Success', 'Update quiz success', 1, 2);
        renderQuiz(dataResponse.data);

    }catch(error){
        console.log(error);
    }finally{
        mbLoading(false);
    }
});

// compoent media

function componentMediaAudio(data = null) {
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

    if (data !== null) {
        const titleAudio = div.querySelector('input[name=title-audio]');
        titleAudio.value = data.title;
        const audioPreview = div.querySelector('.file-audio-preview audio source');
        audioPreview.src = "public/media/" + data.content;
        quizEditPayload.mediaCMS.content = null;
    }

    const titleAudio = div.querySelector('input[name=title-audio]');
    titleAudio.oninput = function (e) {
        const value = e.target.value;
        quizEditPayload.mediaCMS.title = value;
        if (quizEditPayload.mediaCMS.action === null) {
            quizEditPayload.mediaCMS.action = 'update';
        }
    }

    const fileAudio = div.querySelector('input[type=file]');
    fileAudio.onchange = function (e) {
        const file = e.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            const reader = new FileReader();
            // Đọc file dưới dạng base64 (hoặc có thể là binary)
            reader.onload = function (event) {
                // Gán nội dung file vào object Quizzes
                quizEditPayload.mediaCMS.content = event.target.result;
                if (quizEditPayload.mediaCMS.action === null) {
                    quizEditPayload.mediaCMS.action = 'update';
                }
                // Hiển thị file âm thanh đã chọn (tùy chọn)
                const audioPreview = div.querySelector('.file-audio-preview audio source');
                audioPreview.src = URL.createObjectURL(file);
                audioPreview.parentElement.load(); // Tải lại để phát tệp mới
            };
            reader.readAsDataURL(file);
        } else {
            mbNotification('Warrning', 'Not Type MP3', 3, 2);
            quizEditPayload.mediaCMS.content = null;
        }
    };
    return div;
}

function componentMediaText(data = null) {

    const textContent = data === null ? '' : data.content;

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
                    <div id="contentmedia" class="editor">${textContent}</div>
                    </div>
                </div>
    `;
    div.innerHTML = html;

    if (data !== null) {
        const titleText = div.querySelector('input[name=titletext]');
        titleText.value = data.title;
        quizEditPayload.mediaCMS.action = null;
    }

    const titleText = div.querySelector('input[name=titletext]');
    titleText.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        quizEditPayload.mediaCMS.title = value;
        if (quizEditPayload.mediaCMS.action === null) {
            quizEditPayload.mediaCMS.action = 'update';
        }
    }

    const callback = (value) => {
      quizEditPayload.mediaCMS.content = value || null;
      if (quizEditPayload.mediaCMS.action === null) {
        quizEditPayload.mediaCMS.action = "update";
      }
    };
    initQuillDeboun("#contentmedia",'Nhập nội dung bài viết...', callback, 350);

    return div;
}

function compoentMediaAudioDrive(data = null) {
    const div = document.createElement('div');
    div.classList.add('dv-media-audio-drive');
    div.innerHTML = `
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

    if (data !== null) {
        const title = div.querySelector('input[name=titleaudiodrive]');
        title.value = data.title;
        const content = div.querySelector('input[name=contentdrive]');
        content.value = data.content;
        const iframe = document.createElement('iframe');
        iframe.src = data.content;
        iframe.allow = "autoplay";  // Cho phép phát tự động nếu cần
        iframe.frameBorder = "0";
        preview.appendChild(iframe);  // Thêm iframe vào div
        quizEditPayload.mediaCMS.action = null;
    }

    const title = div.querySelector('input[name=titleaudiodrive]');
    title.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        quizEditPayload.mediaCMS.title = value || null;
        if (quizEditPayload.mediaCMS.action === null) {
            quizEditPayload.mediaCMS.action = 'update';
        }
    }

    const content = div.querySelector('input[name=contentdrive]');

    content.oninput = function (e) {
        const link = e.target.value;
        const regex = /\/d\/(.+?)\//;
        const match = link.match(regex);
        if(quizEditPayload.mediaCMS.action === null){
            quizEditPayload.mediaCMS.action = 'update';
        }
        if (match && match[1]) {
            const fileId = match[1];
            // Tạo URL nhúng cho iframe
            const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
            quizEditPayload.mediaCMS.content = embedUrl;
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
            quizEditPayload.mediaCMS.content = null;
        }
    }

    return div;
}

function compoentMediaVideoYtb(data = null) {
    const div = document.createElement('div');
    div.classList.add('dv-media-video-ytb');
    div.innerHTML = `
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

    if (data !== null) {
        title.value = data.title;
        const content = div.querySelector('input[name=contentytb]');
        content.value = data.content;
        const preview = div.querySelector('.preview');
        const preview1 = document.createElement('div');
        preview1.classList.add('preview1');
        preview1.innerHTML = data.content;
        preview.appendChild(preview1);
        quizEditPayload.mediaCMS.action = null;
    }

    title.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        quizEditPayload.mediaCMS.title = value || null;
        if (quizEditPayload.mediaCMS.action === null) {
            quizEditPayload.mediaCMS.action = 'update';
        }
    }

    const content = div.querySelector('input[name=contentytb]');
    content.oninput = function (e) {
        if (quizEditPayload.mediaCMS.action === null) {
            quizEditPayload.mediaCMS.action = 'update';
        }
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
            quizEditPayload.mediaCMS.content = null;
            return;
        }
        quizEditPayload.mediaCMS.content = stringIframe;
        emptyElement(preview);
        const preview1 = document.createElement('div');
        preview1.classList.add('preview1');
        preview1.innerHTML = stringIframe;
        preview.appendChild(preview1);
    }
    return div;
}

// component question

function componentQuestionChoose(data = null) {

    const stt = getOdinal();

    if (data !== null) {
        data.id = parseInt(data.id);
    }
    const currentId = data?.id ?? generateQuestionId();

    const question = {
        id: currentId,
        questionName: null,
        typeAnswers: 0,
        action: null,
        answersCMS: [],
        arridAnswerDelete: [],
        note: null
    };

    if (data !== null) {
        question.questionName = data.questionName;
        question.typeAnswers = data.typeAnswers;
        question.note = data.note;
        // question.answersCMS = data.answersCMS;
    } else {
        question.action = 'create';
    }

    quizEditPayload.questionsCMS.push(question);

    const textQuestion = data === null ? '' : data.questionName;
    const note = data?.note ?? '';

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
            <div id="questionEditor${currentId}" class="editor">${textQuestion}</div>
            </div>
        <div class="answers">

        </div>
        <div class="dv-add-answer">
            <button type="button" >+</button>
        </div>
        <div class="dv-note">
            <div id="dvnote_${currentId}">${note}</div>
        </div>
`;
    div.innerHTML = html;

    const callBackInputQuestion = (value) => {
      const indexQuestion = getIndexQuestion(currentId);
      if (indexQuestion === -1) return;
      quizEditPayload.questionsCMS[indexQuestion].questionName = value || null;
      const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
      if (checkAction === null) {
        quizEditPayload.questionsCMS[indexQuestion].action = "update";
      }
    };
    initQuillDeboun(`#questionEditor${currentId}`, 'Nhập câu hỏi ở đây...', callBackInputQuestion, 350);

    const callBackInputNote = (value) => {
      const indexQuestion = getIndexQuestion(currentId);
      if (indexQuestion === -1) return;
      quizEditPayload.questionsCMS[indexQuestion].note = value || null;
      const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
      if (checkAction === null) {
        quizEditPayload.questionsCMS[indexQuestion].action = "update";
      }
    };
    initQuillDeboun(`#dvnote_${currentId}`, 'Nhập ghi chú ở đây...', callBackInputNote, 350);


    if (data !== null) {
        data.answersCMS.forEach((ans, index) => {
            div.querySelector('.answers').appendChild(boxAnswer(currentId, idatmp++, ans));
        });
    }else{
        for (let i = 0; i < 4; i++) {
            div.querySelector('.answers').appendChild(boxAnswer(currentId, idatmp++));
        }
    }

    const btnAddAnswer = div.querySelector('.dv-add-answer button');
    btnAddAnswer.onclick = function (e) {
        div.querySelector('.answers').appendChild(boxAnswer(currentId, idatmp++));
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
        if (checkAction === null) {
            quizEditPayload.questionsCMS[indexQuestion].action = 'update';
        }
    }


    function boxAnswer(currentId,idatmp, oldAnswer = null) {
        const answer = {
            id: null,
            answerName: null,
            isCorrect: false,
            idatmp: idatmp
        };

        if(oldAnswer !== null){
            answer.id = oldAnswer.id;
            answer.answerName = oldAnswer.answerName;
            answer.isCorrect = oldAnswer.isCorrect;
        }

        question.answersCMS.push(answer);

        const textAnswer = oldAnswer === null ? '' : oldAnswer.answerName;

        const div = document.createElement('div');
        div.classList.add('group-answer');
        let html = `
            <input type="radio" name="answer_${currentId}" id="">
                <div class="box-editor">
                <div id="answerEditor${idatmp}" class="editor">${textAnswer}</div>
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
            const indexAnswer = getIndexAnswer(currentId,idatmp);
            if(indexAnswer === -1) return;
            quizEditPayload.questionsCMS[indexQuestion].answersCMS[indexAnswer].answerName = value || null;
            const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
            if (checkAction === null) {
                quizEditPayload.questionsCMS[indexQuestion].action = 'update';
            }
        }
        initQuillDeboun(`#answerEditor${idatmp}`, 'Nhập câu trả lời ở đây...', callBackInputAnswer, 350);

        const inputradio = div.querySelector('input[type=radio]');
        inputradio.onchange = function (e) {
            const indexQuestion = getIndexQuestion(currentId);
            if(indexQuestion === -1) return;
            const indexAnswer = getIndexAnswer(currentId,idatmp);
            if(indexAnswer === -1) return;
            quizEditPayload.questionsCMS[indexQuestion].answersCMS.forEach((ans, i) => {
                ans.isCorrect = i === indexAnswer;
            });
        }

        const btnDel = div.querySelector('button.del-answer');
        btnDel.onclick = function (e) {

            const total = question.answersCMS.length;
            if (total <= 2) {
                mbNotification('Warrning', 'Min 2 answer', 3, 2);
                return;
            }

            const indexQuestion = getIndexQuestion(currentId);
            if(indexQuestion === -1) return;
            const indexAnswer = getIndexAnswer(currentId,idatmp);
            if(indexAnswer === -1) return;
            // let indexold = question.answersCMS.findIndex(ans => ans.idatmp === idatmp);
            const checkIsCorrect = quizEditPayload.questionsCMS[indexQuestion].answersCMS[indexAnswer].isCorrect;
            if(checkIsCorrect){
                mbNotification('Warrning', 'Can not delete answer correct', 3, 2);
                return;
            }

            const checkIdAnswer = quizEditPayload.questionsCMS[indexQuestion].answersCMS[indexAnswer].id;

            if(arridCurrentQuestion.includes(currentId) && checkIdAnswer !== null){
                const idAnswerDelete = quizEditPayload.questionsCMS[indexQuestion].answersCMS[indexAnswer].id;
                quizEditPayload.questionsCMS[indexQuestion].arridAnswerDelete.push(idAnswerDelete);
                const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
                if(checkAction === null){
                    quizEditPayload.questionsCMS[indexQuestion].action = 'update';
                }
            }
            quizEditPayload.questionsCMS[indexQuestion].answersCMS.splice(indexAnswer, 1);
            div.remove();
        }

        return div;
    }

    if (data !== null) {
        data.answersCMS.forEach((ans, index) => {
            const inputradio = div.querySelectorAll('.answers input[type=radio]');
            inputradio[index].checked = ans.isCorrect;
        });
    }

    const inputradio = div.querySelectorAll('.answers input[type=radio]');
    inputradio.forEach((radio, index) => {
        radio.onchange = function (e) {
            const indexQuestion = getIndexQuestion(currentId);
            if(indexQuestion === -1) return;
            quizEditPayload.questionsCMS[indexQuestion].answersCMS.forEach((ans, i) => {
                ans.isCorrect = i === index;
            });
            const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
            if (checkAction === null) {
                quizEditPayload.questionsCMS[indexQuestion].action = 'update';
            }
        }
    });

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = async function (e) {
        const check = await mbConfirm(`Delete question <span class="cl-red">${question.questionName}</span> ?`);
        if (!check) return;
        quizEditPayload.questionsCMS = quizEditPayload.questionsCMS.filter(q => parseInt(q.id) !== currentId);
        if (arridCurrentQuestion.includes(currentId)) {
            quizEditPayload.arridQuestionDelete.push(currentId);
        }
        div.remove();
    }

    return div;
}

function componentQuestionTrueFalse(data = null) {

    const stt = getOdinal();

    if (data !== null) {
        data.id = parseInt(data.id);
    }
    const currentId = data?.id ?? generateQuestionId();

    const question = {
        id: currentId,
        questionName: null,
        typeAnswers: 0,
        action: null,
        answersCMS: [
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

    if (data !== null) {
        question.questionName = data.questionName;
        question.typeAnswers = data.typeAnswers;
        question.answersCMS = data.answersCMS;
        question.note = data.note;
    } else {
        question.action = 'create';
    }

    quizEditPayload.questionsCMS.push(question);

    const textQuestion = data === null ? '' : data.questionName;
    const note = data?.note ?? '';

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
            <div id="questionEditor${currentId}" class="editor">${textQuestion}</div>
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
            <div id="dvnote_${currentId}">${note}</div>
        </div>
`;
    div.innerHTML = html;

    const callBackInputQuestion = (value) => {
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        quizEditPayload.questionsCMS[indexQuestion].questionName = value || null;
        const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
        if (checkAction === null) {
            quizEditPayload.questionsCMS[indexQuestion].action = 'update';
        }
    }
    initQuillDeboun(`#questionEditor${currentId}`, 'Nhập câu hỏi ở đây...', callBackInputQuestion, 350);

    const callBackInputNote = (value) => {
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        quizEditPayload.questionsCMS[indexQuestion].note = value || null;
        const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
        if (checkAction === null) {
            quizEditPayload.questionsCMS[indexQuestion].action = 'update';
        }
    }
    initQuillDeboun(`#dvnote_${currentId}`, 'Nhập ghi chú ở đây...', callBackInputNote, 350);

    if (data !== null) {
        data.answersCMS.forEach((ans, index) => {
            const inputradio = div.querySelectorAll('.answers input[type=radio]');
            inputradio[index].checked = ans.isCorrect;
        });
    }

    const inputradio = div.querySelectorAll('input[type=radio]');
    inputradio.forEach((radio, index) => {
        radio.onchange = function (e) {
            const indexQuestion = getIndexQuestion(currentId);
            if(indexQuestion === -1) return;
            quizEditPayload.questionsCMS[indexQuestion].answersCMS.forEach((ans, i) => {
                ans.isCorrect = i === index;
            });
            const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
            if (checkAction === null) {
                quizEditPayload.questionsCMS[indexQuestion].action = 'update';
            }
        }
    });

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = async function (e) {
        const check = await mbConfirm(`Delete question <span class="cl-red">${question.questionName}</span> ?`);
        if (!check) return;
        quizEditPayload.questionsCMS = quizEditPayload.questionsCMS.filter(q => parseInt(q.id) !== currentId);
        if (arridCurrentQuestion.includes(currentId)) {
            quizEditPayload.arridQuestionDelete.push(currentId);
        }
        div.remove();
    }
    return div;
}

function componentQuestionWrite(data = null) {
    const stt = getOdinal();
    if (data !== null) {
        data.id = parseInt(data.id);
    }
    const currentId = data?.id ?? generateQuestionId();

    const question = {
        id: currentId,
        questionName: null,
        typeAnswers: 1,
        action: null,
        answersCMS:
        {
            answerName: null,
            isCorrect: true
        },
        note: null
    }

    if (data !== null) {
        question.questionName = data.questionName;
        question.typeAnswers = data.typeAnswers;
        question.answersCMS = data.answersCMS;
        question.note = data.note;
    } else {
        question.action = 'create';
    }

    quizEditPayload.questionsCMS.push(question);

    const textQuestion = data === null ? '' : data.questionName;
    const note = data?.note ?? '';

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
                <div id="questionEditor${currentId}" class="editor">${textQuestion}</div>
                </div>
                <input type="text" placeholder="Answer" name="answer">
                <div class="dv-note">
                    <div id="dvnote_${currentId}">${note}</div>
                </div>
    `;
    div.innerHTML = html;

    const callBackInputQuestion = (value) => {
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        quizEditPayload.questionsCMS[indexQuestion].questionName = value || null;
        const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
        if (checkAction === null) {
            quizEditPayload.questionsCMS[indexQuestion].action = 'update';
        }
    }
    initQuillDeboun(`#questionEditor${currentId}`, 'Nhập câu hỏi ở đây...', callBackInputQuestion, 350);

    const callBackInputNote = (value) => {
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        quizEditPayload.questionsCMS[indexQuestion].note = value || null;
        const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
        if (checkAction === null) {
            quizEditPayload.questionsCMS[indexQuestion].action = 'update';
        }
    }
    initQuillDeboun(`#dvnote_${currentId}`, 'Nhập ghi chú ở đây...', callBackInputNote, 350);

    if (data !== null) {
        const answer = div.querySelector('input[name=answer]');
        answer.value = data.answersCMS.answerName;
    }

    const answer = div.querySelector('input[name=answer]');
    answer.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        const indexQuestion = getIndexQuestion(currentId);
        if(indexQuestion === -1) return;
        quizEditPayload.questionsCMS[indexQuestion].answersCMS.answerName = value || null;
        const checkAction = quizEditPayload.questionsCMS[indexQuestion].action;
        if (checkAction === null) {
            quizEditPayload.questionsCMS[indexQuestion].action = 'update';
        }
    }

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = async function (e) {
        const check = await mbConfirm(`Delete question <span class="cl-red">${question.questionName}</span> ?`);
        if (!check) return;
        quizEditPayload.questionsCMS = quizEditPayload.questionsCMS.filter(q => parseInt(q.id) !== currentId);
        if (arridCurrentQuestion.includes(currentId)) {
            quizEditPayload.arridQuestionDelete.push(currentId);
        }
        div.remove();
    }

    return div;
}

function updateUrl(){
    const idCourse = quizEditPayload.idCourse;
    const idLesson = quizEditPayload.idLesson;
    const idQuiz = quizEditPayload.idQuiz;
    const baseUrl = document.querySelector('base').href;
    const url = baseUrl + `admin/quizzes/edit?course=${idCourse}&lesson=${idLesson}&quiz=${idQuiz}`;
    window.history.replaceState(null, null, url);
    return url;
}

function generateQuestionId() {
    while (true) {
        const id = ++questionIdCounter;
        if (!arridCurrentQuestion.includes(id)) {
            return id;
        }
    }
}

function getOdinal(){
    let total = quizEditPayload.questionsCMS.length;
    return total + 1;
}


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

function mbConfirm(title = '',okName = 'OK', cancelName = 'Cancel'){
    return new Promise(resolve =>{
        let mbConfirm1 = document.querySelector('.mbConfirm1');
        if(!mbConfirm1){
            mbConfirm1 = document.createElement('div');
            mbConfirm1.classList.add('mbConfirm1');
            document.body.appendChild(mbConfirm1);
        }else{
            while(mbConfirm1.firstChild){
                mbConfirm1.removeChild(mbConfirm1.firstChild);
            }
        }
        const divTemp = document.createElement('div');
        divTemp.innerHTML = `
                <div class="confirm-fixed fixed inset-0 grid place-items-center">
                <div class="confirm-box min-w-[200px] md:min-w-[300px]">
                    <p class="px-[20px] py-[25px] text-center">${title}</p>
                    <div class="flex justify-center items-center">
                    <button class="btnno flex-1 py-[10px] border-t-[1px] hover:bg-red-500">${cancelName}</button>
                        <button class="btnyes flex-1 py-[10px] border-t-[1px] border-l-[1px] hover:bg-green-500">${okName}</button>
                    </div>
                </div>
            </div>
        `;

        const btnOK = divTemp.querySelector('.btnyes');
        const btnCancel = divTemp.querySelector('.btnno');
        const confirmfixed = divTemp.querySelector('.confirm-fixed');
        const confirmbox = divTemp.querySelector('.confirm-box');
        btnOK.onclick = function(){
            resolve(true);
            mbConfirm1.remove();
        }
        btnCancel.onclick = function(){
            resolve(false);
            mbConfirm1.remove();
        }
        confirmfixed.onclick = function(e){
          if(e.target.contains(confirmbox)){
            resolve(false);
            mbConfirm1.remove();
          }
        }
        mbConfirm1.appendChild(divTemp);
    });
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
    return quizEditPayload.questionsCMS.findIndex(q => q.id === idtmp);
}

function getIndexAnswer(idtmp,idatmp){
    const indexQuestion = getIndexQuestion(idtmp);
    if(indexQuestion === -1) return -1;
    return quizEditPayload.questionsCMS[indexQuestion].answersCMS.findIndex(ans => ans.idatmp === idatmp);
}