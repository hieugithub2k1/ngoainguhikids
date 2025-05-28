
const btnsignin = document.getElementById('btnsignin');
const btnsignup = document.getElementById('btnsignup');
btnsignin.onclick = function () {
    changeAuth(0);
}
btnsignup.onclick = function () {
    changeAuth(1);
}

// changeAuth(1);

function changeAuth(isLogin = 0) {
    const mainSignin = document.getElementById('main-signin');
    const mainSignup = document.getElementById('main-signup');
    if (isLogin == 0) {
        mainSignin.classList.add('active');
        mainSignup.classList.remove('active');
    } else {
        mainSignin.classList.remove('active');
        mainSignup.classList.add('active');
    }

}

function togglePasswordVisibility(event) {
    const targetInputId = event.currentTarget.getAttribute('data-target');
    const targetInput = document.getElementById(targetInputId);

    if (targetInput.type === 'password') {
        targetInput.type = 'text';
        event.currentTarget.classList.add('active');
    } else {
        targetInput.type = 'password';
        event.currentTarget.classList.remove('active');
    }
}
// Add event listener to all eye icons
document.querySelectorAll('.span_eye').forEach(span => {
    span.addEventListener('click', togglePasswordVisibility);
});


const formSignIn = document.querySelector('#main-signin .form');
const formSignUp = document.querySelector('#main-signup .form');

// sử lí đăng nhập thường

formSignIn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = mbFormData(formSignIn);
    if (!validateEmail(formData.email)) {
        showNotif('Warning', 'Invalid email', 1);
        return;
    }
    if (!validatePassword(formData.password)) {
        showNotif('Warning', 'Password must be between 3 and 20 characters', 1);
        return;
    }
    for (let key in formData) {
        formData[key] = formData[key].trim();
    }

    try{
        loading(true);
        const datares = await mbFetch('?signin', formData);
        if(datares.error){
            showNotif('Error', datares.error, 2, 3000);
            return;
        }
        formSignIn.reset();
        showNotif('Success', datares.message, 0, 1000);
        setTimeout(() => { window.location.reload() }, 1000);
    }catch(error){
        console.error(error);
        showNotif('Error', 'Sign in fail', 2, 2000);
    }finally{
        loading(false);
    }

});

// sử lí đăng kí

formSignUp.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = mbFormData(formSignUp);

    if (!validatePassword(formData.fullName)) {
        showNotif('Warning', 'FullName must be between 3 and 30 characters', 1);         
        return;
    }

    if (!validateEmail(formData.email)) {
        showNotif('Warning', 'Invalid email', 1);         
        return;
    }
    if (!validatePassword(formData.password)) {
        showNotif('Warning', 'Password must be between 3 and 30 characters', 1);
        return;
    }
    if (formData.password !== formData.confirmpassword) {
        showNotif('Warning', 'Passwords do not match', 1);
        return;
    }

    for (let key in formData) {
        formData[key] = formData[key].trim();
    }

    try {
        loading(true);
        const datares = await mbFetch('?signup', formData);
        if(datares.error){
            showNotif('Error', datares.error, 2, 2000);
            return;
        }
        formSignUp.reset();
        showNotif('Success', datares.message, 0, 2500);
        setTimeout(() => { window.location.reload() }, 1500);
    } catch (error) {
        console.error(error);
        showNotif('Error', 'Sign up fail', 2, 2000);
    }finally{
        loading(false);
    }

});


// tùy chọn nhớ mật khẩu bằng localstorage
const EinputRemember = document.getElementById('remember');
let statusRemember = false;
const statusString = localStorage.getItem('rememberMB');
if(statusString === 'true'){
    statusRemember = true;
}else if(statusString === 'false'){
    statusRemember = false;
}
EinputRemember.checked = statusRemember;
EinputRemember.addEventListener('change',()=>{
    localStorage.setItem('rememberMB',EinputRemember.checked);
});

// sử lí đăng nhập google

const btnGoogle = document.querySelectorAll('.btn.google');
btnGoogle.forEach(btn => {
    btn.addEventListener('click',()=>{
        window.location.href = linkGoogle();
    })
})

getTokenGoogle();
async function getTokenGoogle(){
    const url = new URLSearchParams(window.location.hash.substring(1));
    const id_token = url.get('id_token');
    if(!id_token){
        return;
    }

    try{
        loading(true);
        const remember = document.getElementById('remember').checked;
        const datares = await mbFetch('?signinGoogle',{idToken: id_token, rememberMe: remember});
        if(datares.error){
            showNotif('Error', datares.error, 2, 2000);
            removeTokensFromUrl();
            return;
        }
        showNotif('Success', datares.message, 0, 2000);
        removeTokensFromUrl();
        window.location.reload();
    }catch(error){
        console.error(error);
        showNotif('Error', 'Sign in google fail', 2, 2000);
    }finally{
        loading(false);
    }
}

function removeTokensFromUrl() {
    // Xóa phần hash token trên URL
    window.history.replaceState(null, null, window.location.pathname);
}

function linkGoogle(){
    const clientId = '865532873608-aik1oar7v5gimbu4m84dcl2aj8me92ih.apps.googleusercontent.com';
    const client_Uri = document.querySelector('base').href;
    const scope = 'openid%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile';
    const nonce = Math.random().toString(36).substring(2); // Tạo nonce ngẫu nhiên
    return  `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&response_type=id_token%20token&redirect_uri=${client_Uri}&client_id=${clientId}&nonce=${nonce}`;
}


// library

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    if (password.length >= 3 && password.length <= 30) {
        return true;
    }
    return false;
}


function showNotif(title, mess, indexType, duration = 1500) {
    let main = document.querySelector('.overllay-notification');
    if (!main) {
        main = document.createElement('div');
        main.classList.add('overllay-notification');
        document.body.appendChild(main);
    }
    const ObjectNoti = [
        {
            type: 'success',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>`,
            css: "success",
        },
        {
            type: 'warning',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>`,
            css: "warning",
        },
        {
            type: 'error',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>`,
            css: "error",
        }
    ];
    const { svg, css } = ObjectNoti[indexType];
    const boxNoti = document.createElement('div');
    const autoRemoveId = setTimeout(() => {
        main.removeChild(boxNoti);
    }, duration + 300);
    boxNoti.onclick = function (e) {
        if (e.target.closest(".close")) {
            main.removeChild(boxNoti);
            clearTimeout(autoRemoveId);
        }
    };
    boxNoti.classList.add('box-noti', css);
    boxNoti.style.animation = `fadeInNotification 0.3s linear, fadeOutNotification 0.3s linear ${duration}ms forwards`;
    boxNoti.innerHTML = `
    <div class="icon">
    ${svg}
    </div>
    <div class="contents">
    <p class="title">${title}</p>
    <p class="mess">${mess}</p>
    </div>
    <div class="close">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
    stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
    </div>
    `;
    main.appendChild(boxNoti);
}

function loading(load = false){
    let loading = document.querySelector('.status-loading');
    if(loading){
        if(!load){
            loading.remove();
        }
    }else{
        if(load){
            loading = document.createElement('div');
            loading.classList.add('status-loading');
            loading.innerHTML = `<div class="loader"></div>`;
            document.body.appendChild(loading);
        }
    }
}

function mbFormData(form) {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    return formObject;
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