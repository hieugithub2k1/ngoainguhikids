import { mbNotification, mbFetch, mbFormData } from '../allmodule.js';
const divRoot = document.getElementById("root");
const addClassTemplate = `
    <div class="dv-content">
        <div class="addClass show">
            <button class="btn btn-primary btn-addClass">Add Class</button>
            <div class="addClass-box">
                <form action="" class="addClass-form">
        <div class="fromGroup">
            <label for="className" class="formLabel">Class Name</label>
            <input type="text" id="className" name="className" class="formInput" placeholder="Enter lesson name">
        </div>
        <div class="fromGroup">
            <label for="courseId" class="formLabel">Courses</label>
            <select id="courseId" name="courseId" class="formInput">
                <option value="">Select Course ID</option>
            </select>
        </div>
        <div>
            <button class="btn btn-primary">Add</button>
        </div>
    </form>
                <button class="addClass-box-btn-close">⬆️</button>
            </div>
        </div>
        
        </div>
    </div>
    <div class="dv-edit-class-container"></div>
        `;

divRoot.innerHTML = addClassTemplate;
const EaddClass = document.querySelector(".addClass");
const btnaddClass = document.querySelector(".btn-addClass");
const closeboxaddClass = document.querySelector(".addClass-box-btn-close");
btnaddClass.addEventListener("click", () => {
  EaddClass.classList.add("show");
});
closeboxaddClass.addEventListener("click", () => {
  EaddClass.classList.remove("show");
});

document.addEventListener("DOMContentLoaded", function () {
    const addClassForm = document.querySelector(".addClass-form");

    async function fetchCourses() {
        const url = "admin/courses/getallcourses";
        try {
            const courses = await mbFetch(url);
            const courseSelect = document.getElementById("courseId");

            courses.forEach((course) => {
                const option = document.createElement("option");
                option.value = course.id;
                option.textContent = course.courseName;
                courseSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    }

    fetchCourses();

    addClassForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = {
            courseId: document.getElementById("courseId").value,
            className: document.getElementById("className").value,
        };

        if (!formData.courseId || !formData.className) {
            mbNotification("Error", "Please enter all required fields", 3);
            return;
        }

        const url = "admin/classes/addClass";
        try {
            const data = await mbFetch(url, formData);

            if (data.error) {
                console.log(data.error);
                mbNotification("Error", data.error, 2, 2);
            } else {
                mbNotification("Success", "Add class success", 1, 2);
                addClassForm.reset();
            }
        } catch (err) {
            console.log(err);
            mbNotification("Error", "An error occurred while adding the lesson", 3);
        }
    });
});
