<?php

namespace AdminControllers;

use Views\ViewLayout;

class LessonsControllerAdmin
{
    private $lessonModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';

    function __construct()
    {
        $this->lessonModel = new \Models\LessonModel();
    }

    function index()
    {
        $lesson = new ViewLayout();
        $lesson->setTitle('Danh sách khóa học');
        $lesson->setActivePage(7);
        $lesson->addCSS( $this->pathcss . 'lessonAdmin.css');
        $lesson->addJS( $this->pathjs . 'lessonAdmin.js');
        $lesson->render();
    }

    public function getlessons($currentPage = 1, $itemsPerPage = 20, $idCourse = null)
    {
        $lesson = $this->lessonModel->getLessons($itemsPerPage, $currentPage, $idCourse);
        echo json_encode($lesson);
    }

    public function addLesson()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $lesson = $this->lessonModel->addLesson($datareq);
            echo json_encode($lesson);
        }
    }
    public function editLesson()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $lesson = $this->lessonModel->editLesson($datareq);
            echo json_encode($lesson);
        }
    }

    public function deleteLesson()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $lesson = $this->lessonModel->deleteLesson($datareq);
            echo json_encode($lesson);
        }
    }
}
