<?php
namespace AdminControllers;
use Views\ViewLayout;
class CoursesControllerAdmin {
    private $courseModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';
    function __construct()
    {
        $this->courseModel = new \Models\CourseModel();
    }

    function index(){
        $course = new ViewLayout();
        $course->setTitle('Danh sách khóa học');
        $course->setActivePage(6);
        $course->addCSS( $this->pathcss . 'courseAdmin.css');
        $course->addJS( $this->pathjs . 'courseadmin.js');
        $course->render();
    }

    // Các phương thức dành cho ajax

    public function getcourses($currentPage = 1, $itemsPerPage = 20) {
        $courses = $this->courseModel->getCourses($itemsPerPage, $currentPage);
        echo json_encode($courses);
    }
    public function getallcourses() {
      $courses = $this->courseModel->getAllCourses();
      echo json_encode($courses);
  }

    public function addCourse() {
      if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $datareq = json_decode(file_get_contents('php://input'), true);
        $course = $this->courseModel->addCourse($datareq);
        echo json_encode($course);
      }
    }

    public function editCourse() {
      if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $datareq = json_decode(file_get_contents('php://input'), true);
        $course = $this->courseModel->editCourse($datareq);
        echo json_encode($course);
      }
    }

    public function deleteCourse() {
      if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $datareq = json_decode(file_get_contents('php://input'), true);
        $course = $this->courseModel->deleteCourse($datareq);
        echo json_encode($course);
      }
    }
}