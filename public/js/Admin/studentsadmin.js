import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

const divRoot = document.getElementById('root');
divRoot.innerHTML = `
<section class="section1">

    <h2 class="title">Student management</h2>

    <div class="btn-add-student">
        <button class="btn btn-primary" id="btn-show-form">Add new student</button>
        <button class="btn btn-primary">Export Excel</button>
    </div>

    <div class="div-form-add">
        <form action="" method="post">
            <div class="form-group fullname">
                <label for="fullname">Fullname</label>
                <input type="text" name="fullname" id="fullname" class="form-control">
            </div>
            <div class="form-group email">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control">
            </div>
            <div class="form-group phone">
                <label for="phone">Phone</label>
                <input type="text" name="phone" id="phone" class="form-control">
            </div>
            <div class="form-group address">
                <label for="address">Address</label>
                <input type="text" name="address" id="address" class="form-control">
            </div>
            <div class="form-group note">
                <label for="address">Note</label>
                <!-- <input type="text" name="note" id="note" class="form-control"> -->
                <textarea name="" id=""></textarea>
            </div>
            <div class="form-group add">
                <button class="btn btn-primary">Add</button>
            </div>
        </form>
    </div>

    <div class="div-form-search">
        <input type="text" placeholder="Search by name" class="input-search">
    </div>

    <div class="list-student">
        <table>
            <thead>
                <tr>
                    <th>Fullname</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Created At</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Nguyễn Văn A</td>
                    <td> nguyenvana@gmail.com </td>
                    <td> 0123456789 </td>
                    <td> 123 Đường 3/2, Quận 10, TP.HCM </td>
                    <td> 2021-09-01 </td>
                    <td>
                      <div class="td-action">
                        <button class="btn btn-primary">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                      </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="6"><span class="note-lable">Note: </span><span>ban nay ok</span></td>
                </tr>

                <tr>
                    <td>Nguyễn Văn A</td>
                    <td> nguyenvana@gmail.com </td>
                    <td> 0123456789 </td>
                    <td> 123 Đường 3/2, Quận 10, TP.HCM </td>
                    <td> 2021-09-01 </td>
                    <td>
                      <div class="td-action">
                        <button class="btn btn-primary">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                      </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="6"><span class="note-lable">Note: </span><span>ban nay ok</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</section>

<section class="section2">
    <div class="div-form-edit">
        <form action="" method="post">
            <div class="form-group fullname">
                <label for="fullname">Fullname</label>
                <input type="text" name="fullname" id="fullname" class="form-control">
            </div>
            <div class="form-group email">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control">
            </div>
            <div class="form-group phone">
                <label for="phone">Phone</label>
                <input type="text" name="phone" id="phone" class="form-control">
            </div>
            <div class="form-group address">
                <label for="address">Address</label>
                <input type="text" name="address" id="address" class="form-control">
            </div>
            <div class="form-group note">
                <label for="address">Note</label>
                <!-- <input type="text" name="note" id="note" class="form-control"> -->
                <textarea name="" id=""></textarea>
            </div>
            <div class="form-group add">
                <button class="btn btn-primary">Add</button>
            </div>
        </form>
    </div>
</section>

`;
    
const btnShowForm = document.getElementById('btn-show-form');
const divFormAdd = document.querySelector('.div-form-add');
btnShowForm.addEventListener('click', () => {
    divFormAdd.classList.toggle('active');
});

const section2 = document.querySelector('.section2');
const divFormEdit = document.querySelector('.div-form-edit');

// setTimeout(() => {
//     section2.classList.add('active');
// }, 1000);


section2.addEventListener('click', (e) => {
   if(divFormEdit.contains(e.target)) {
       return;
   }
    section2.classList.remove('active');
    // setTimeout(() => {
    //     section2.classList.add('active');
    // }, 1000);
});
