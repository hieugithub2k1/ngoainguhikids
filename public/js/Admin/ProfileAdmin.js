import {
  mbNotification,
  mbConfirm,
  mbLoading,
  mbFetch,
  mbPagination,
  mbFormData,
} from "../allmodule.js";
// dùng để hiển thị ra template trước khi gọi tới DOM
const divRoot = document.getElementById("root");
const templateroot = `
      <div class="container1">
        <form class="grid" id="form">
            <!-- Student Information -->
            <div>
                <h2>Student Information</h2>
                <input type="text" value="" hidden name="id_account">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="" name="email" readonly>
                </div>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value="">
                </div>
                <div class="form-group">
                    <label>Date created</label>
                    <input type="text" value="" name="createdat" readonly>
                </div>
            </div>
            <!-- License Information -->
            <div>
                <h2>License Information</h2>
                <div class="form-group">
                    <label>Code</label>
                    <input type="text" value="FPL.SPRING2024.AF8F97339C6D6AF0746FAA7F146932A4" readonly>
                </div>
                <div class="form-group">
                    <label>Book</label>
                    <input type="text" value="American Anh Ngu Mb Level 99+" readonly>
                </div>
                <div class="form-group">
                    <label>Status: <x style="color: green; font-weight: 600;">Active</x></label>
                </div>
                <hr>
            </div>
        </form>
        <hr>
        <div class="btn-bt">
          <button class="btn-change">Change Password</button>
          <button class="btn-save">Save</button>
          <a href="admin/" class="a-link"><button class="btn-cancel">Cancel</button></a>
      </div>

    </div>
        <div class="dv-change-pass-container"></div>
    `;
divRoot.innerHTML = templateroot;


async function fetAccount() {
  const url = "admin/profile/getaccount";
  try {
    const accountData = await mbFetch(url);
    if (accountData.error) {
      console.error("Error fetching account data:", accountData.error);
      mbNotification("Error", "Failed to fetch account data", 3);
    } else {
      // Cập nhật giá trị của các trường input trong giao diện
      document.querySelector('.form-group input[name="name"]').value =
        accountData.fullName;
      document.querySelector('.form-group input[name="email"]').value =
        accountData.email;
      document.querySelector('.form-group input[name="createdat"]').value =
        accountData.createdAt;
      document.querySelector('input[name="id_account"]').value = accountData.id;
    }
  } catch (err) {
    console.error("Error fetching account:", err);
    mbNotification("Error", "Failed to fetch account data", 3);
  }
}
fetAccount();
const saveButton = document.querySelector(".btn-save");

saveButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const nameInput = document.querySelector('.form-group input[name="name"]');
  const accountInput = document.querySelector('input[name="id_account"]');
  const name = nameInput.value;
  const id = accountInput.value;
  const formData = {
    name: name,
    id: id,
  };
  if(!name){
    mbNotification("Warrning", "Please enter all required fields", 3);
    return;
  }
  if(name.length < 3){
    mbNotification("Warrning", "Name must be greater than 3 characters", 3);
    return;
  }
  try {
    const updateResponse = await mbFetch("admin/profile/updateAccount", formData); // Gửi yêu cầu cập nhật
    if (updateResponse.error) {
      mbNotification("Error", updateResponse.error, 2,2);
    } else {
      mbNotification("Success", "Account updated successfully", 1);
      // Cập nhật giao diện
      nameInput.value = updateResponse.fullName;
      // Cập nhật ảnh đại diện nếu người dùng đã chọn ảnh mới
      if (updateResponse.profileImage) {
        const imgPreview = document.querySelector(".form-group img");
        imgPreview.src = updateResponse.profileImage; // Cập nhật ảnh đại diện
      }
      const userNameGlobal = document.getElementById("userNameGlobal");
      userNameGlobal.innerText = updateResponse.fullName;
    }
  } catch (err) {
    console.error("Error updating account:", err);
    mbNotification("Error", "Failed to update account", 3);
  }
});

async function fetChangepass() {
  const url = "admin/profile/getaccount";
  try {
    const response = await mbFetch(url);
    return response; // Trả về dữ liệu tài khoản
  } catch (err) {
    console.error("Error fetching account:", err);
    return null;
  }
}

const changePassButton = document.querySelector(".btn-change");
changePassButton.onclick = async function () {
  const data = await fetChangepass();
  if (data) {
    showChangePasswordForm(data);
  } else {
    mbNotification("Error", "Không có dữ liệu tài khoản", 3);
  }
};

function showChangePasswordForm(account) {
  return new Promise((resolve) => {
    const box = document.querySelector(".dv-change-pass-container");
    const boxcontent = document.createElement("div");
    boxcontent.classList.add("dv-change");
    boxcontent.innerHTML = `
            <form class="formChangePass">
              <input type="text" value="${account.id}" hidden name="id">
              <div class="formGroup">
                <label for="currentPassword" class="formLabel">Current Password</label>
                <input type="password" id="currentPassword" class="formInput" name="oldPass" placeholder="Enter current password">
              </div>
              <div class="formGroup">
                <label for="newPassword" class="formLabel">New Password</label>
                <input type="password" id="newPassword" class="formInput" name="newPass" placeholder="Enter new password">
              </div>
              <div class="formGroup">
                <label for="confirmPassword" class="formLabel">Confirm New Password</label>
                <input type="password" id="confirmPassword" class="formInput" name="confirmPass" placeholder="Confirm new password">
              </div>
              <div>
                <label for="showPass"><input id="showPass" type="checkbox"> Show</label>
              </div>
              <button class="btn btn-green">Change Password</button>
            </form>
        `;

    const formChangePass = boxcontent.querySelector(".formChangePass");

    const showPass = boxcontent.querySelector("#showPass");
    showPass.onchange = function (e) {
      const isCheck = e.target.checked;
      if(isCheck){
        boxcontent.querySelectorAll(".formInput").forEach(input => {
          input.type = "text";
        });
      }else{
        boxcontent.querySelectorAll(".formInput").forEach(input => {
          input.type = "password";
        });
      }
    };

    boxcontent.onclick = function (e) {
      if (!formChangePass.contains(e.target)) {
        boxcontent.remove();
        resolve(null);
      }
    };

    formChangePass.onsubmit = async function (e) {
      e.preventDefault();
      const formData1 = mbFormData(formChangePass);
      const {id, oldPass : currentPassword, newPass : newPassword, confirmPass : confirmPassword } = formData1;
      if (!currentPassword || !newPassword || !confirmPassword) {
        mbNotification("Error", "Please enter all required fields", 3);
        return;
      }
      if (newPassword <= 3) {
        mbNotification("Error", "New password must be greater than 3 characters", 3);
        return;
      }
      if (newPassword !== confirmPassword) {
        mbNotification("Error", "New passwords do not match", 3);
        return;
      }

      const formData = {
        accountId: id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
 
      const urlChangePass = "admin/profile/changepassword";
      const data = await mbFetch(urlChangePass, formData);
      boxcontent.remove();
      if (data.error) {
        mbNotification("Error", data.error, 2, 2);
        resolve(null);
      } else {
        mbNotification("Success", "Password changed successfully", 1);
        resolve(data);
      }
    };

    box.appendChild(boxcontent);
  });
}
