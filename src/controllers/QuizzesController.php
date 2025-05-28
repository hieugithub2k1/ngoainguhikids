<?php

namespace Controllers;

use Views\ViewLayout;

class QuizzesController
{
    private $classModel = null;
    private $lessonModel = null;
    private $quizModel = null;
    private $resultModel = null;
    private $pathcss = 'public/css/Users/';
    private $pathjs = 'public/js/Users/';
    private $pathcssall = 'public/css/';
    function __construct()
    {
        $this->classModel = new \Models\ClassModel();
        $this->lessonModel = new \Models\LessonModel();
        $this->quizModel = new \Models\QuizzesCMSModel();
        $this->resultModel = new \Models\ResultCMSModel();
    }

    function index()
    {
        $quiz = new ViewLayout();
        $quiz->setTitle('Quizzes - Anh Ngữ MB');
        $quiz->setActivePage(5);
        $quiz->addCSS($this->pathcss . 'filterquiz.css');
        $quiz->addJS($this->pathjs . 'filterquiz1.js');
        $quiz->render();
    }

    function startquiz(){
        $quiz = new ViewLayout();
        $quiz->setTitle('Quizzes - Anh Ngữ MB');
        $quiz->setActivePage(5);
        $quiz->addCSS($this->pathcss . 'quiz2.css');
        $quiz->addCSS($this->pathcssall . 'quill.css');
        $quiz->addJS($this->pathjs . 'quiz4.js');
        $quiz->render();
    }

    // Các phương thức dành cho ajax

    function getClassByUser(){
        $idUser = \Cores\Authentication::getId();
        $classes = $this->classModel->getClassesByUser($idUser);
        echo json_encode($classes);
    }

    function getUnitByClass($idClass){
        if ($idClass === '' || !is_numeric($idClass)) {
            echo json_encode([]);
            return;
        }

        $idUser = \Cores\Authentication::getId();
        $units = $this->lessonModel->getLessonByIdCourse( $idUser ,$idClass);
        echo json_encode($units);
    }

    function getQuizByIdLesson($idClass,$idLesson){
        if ($idClass === '' || !is_numeric($idClass)) {
            echo json_encode([]);
            return;
        }
        if ($idLesson === '' || !is_numeric($idLesson)) {
            echo json_encode([]);
            return;
        }

        $idUser = \Cores\Authentication::getId();
        $quizzes = $this->quizModel->getQuizByIdLesson($idUser,$idClass,$idLesson);
        echo json_encode($quizzes);
    }

    function getQuestionByIdQuiz($idClass, $idLesson, $idQuiz){
        $idUser = \Cores\Authentication::getId();
        $quiz = $this->quizModel->getQuestionByIdQuiz($idUser,$idClass, $idLesson, $idQuiz);
        echo json_encode($quiz);
    }

    function submitQuiz(){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $idUser = \Cores\Authentication::getId();
            $data = json_decode(file_get_contents('php://input'), true);
            $result = $this->resultModel->submitQuiz($idUser, $data);
            echo json_encode($result);
        }
    }

}
