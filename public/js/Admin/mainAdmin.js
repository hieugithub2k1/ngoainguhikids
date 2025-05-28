
import { mbConfirm, mbFetch } from '../allmodule.js';
const idlogout = document.getElementById('mblogout');
idlogout.onclick = async (e) => {
    e.preventDefault();
    const check = await mbConfirm('Are you sure you want to log out?');
    if(check) window.location.href = idlogout.href;
}
async function Notification(){
    let url = "admin/accessclass/getAccessStatuss/";
    try {
        const response = await mbFetch(url);
        return response;
      } catch (err) {
        console.error("Error fetching Notification:", err);
        return null;
      }
}
async function showNotification() {
    const response = await Notification();
    if (!response || !response.student) {
        console.error("No notifications found");
        return;
    }
    const data = response.student.slice(0, 5);
    const notifList = document.getElementById('notifList');
    notifList.innerHTML = '';
    data.forEach(item => {
        const newNotif = document.createElement('li');
        newNotif.innerHTML = `<a href="admin/accessclass?classId=${item.idClasses}">${item.fullName} <span style="color: red">- Joined class:</span> <strong>${item.className}</strong></a>`;
        notifList.appendChild(newNotif);
    });
    const notifCount = document.getElementById('notifCount');
    notifCount.textContent = response.student.slice(0, 5).length;

    const notifContainer = document.querySelector('.header_notif_contents');
    notifContainer.style.display = 'block';
  }
  showNotification();