
// tite:, mess: nội dung thong báo, type: 1 thành thành công, 2 thất bại, 3 cảnh báo, 4 info
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

export {mbNotification};


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

export {mbConfirm};


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

export {mbLoading};


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

export {mbFetch};



// truyền vào trang hiện tại, và tổng trang được lấy từ trên server về, số nút hiển thị mặc định là 5,
// chỉ cần tạo trước một thẻ div, và appendChild vào nó, vì hàm này return về 1 DOM ul
function mbPagination(currentPage, totalPages, maxbutton = 5){
    const ul = document.createElement('ul');
    ul.classList.add('mb-pagination');
    let startPage, endPage;
    if(totalPages <= maxbutton){
        startPage = 1;
        endPage = totalPages;
    }else{
        const halfRange = Math.floor(maxbutton / 2);
        if(currentPage <= halfRange + 1){
            startPage = 1;
            endPage = maxbutton;
        }
        else if(currentPage + halfRange >= totalPages){
            startPage = totalPages - maxbutton + 1;
            endPage = totalPages;
        }else{
            startPage = currentPage - halfRange;
            endPage = currentPage + halfRange;
        }
    }
    if (startPage > 1) {
        // Tạo phần tử <li> cho trang đầu tiên với giá trị 1
        ul.innerHTML += `<li><a href="#" data-page="1">1</a></li>`;
        
        // Nếu trang hiện tại cách xa trang đầu tiên, thêm dấu "..." để biểu thị khoảng cách
        if (startPage > 2) {
            ul.innerHTML += `<li>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
                <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                </svg>
                </li>`;
        }
    }
    for (let i = startPage; i <= endPage; i++) {
        // Thêm các trang vào <ul> và đánh dấu trang hiện tại (active) nếu đúng với currentPage
        ul.innerHTML += `<li><a href="#" data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</a></li>`;
    }
    if (endPage < totalPages) {
        // Nếu trang hiện tại cách xa trang cuối, thêm dấu "..." để biểu thị khoảng cách
        if (endPage < totalPages - 1) {
            ul.innerHTML += `<li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
            <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
            </svg>
            </li>`;
        }
        // Tạo phần tử <li> cho trang cuối cùng với giá trị của totalPages
        ul.innerHTML += `<li><a href="#" data-page="${totalPages}">${totalPages}</a></li>`;
    }
    return ul;
}

export {mbPagination};


// ví dụ khi muốn dùng, đó là lấy DOM truyền vào => const form = document.querySelector('.form-course');
function mbFormData(form) {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    return formObject;
}

export {mbFormData};

function getDateFromTimestamp(timestamp) {
    // return timestamp.split(" ")[0];
    const [year, month, day] = timestamp.split(" ")[0].split("-");
    return `${day}/${month}/${year.slice(2)}`; // Chuyển thành DD/MM/YY
}

export {getDateFromTimestamp};