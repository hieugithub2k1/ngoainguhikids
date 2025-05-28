
import { mbConfirm } from '../allmodule.js';
const idlogout = document.getElementById('mblogout');
idlogout.onclick = async (e) => {
    e.preventDefault();
    const check = await mbConfirm('Are you sure you want to log out?');
    if(check) window.location.href = idlogout.href;
}
