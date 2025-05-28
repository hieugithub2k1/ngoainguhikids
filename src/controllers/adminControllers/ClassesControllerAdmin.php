<?php

namespace AdminControllers;

use Views\ViewLayout;

class ClassesControllerAdmin
{
    private $classModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';
    function __construct()
    {
        $this->classModel = new \Models\ClassModel();
    }

    function index()
    {
        $class = new ViewLayout();
        $class->setTitle('Danh sách khóa học');
        $class->setActivePage(2,2);
        $class->addCSS( $this->pathcss . 'classAdmin.css');
        $class->addJS( $this->pathjs . 'listClassAdmin.js');
        
        $class->render();
    }

    function addClassAdmin()
    {
        $class = new ViewLayout();
        $class->setTitle('Add class');
        $class->setActivePage(2,2.1);
        $class->addCSS( $this->pathcss . 'classAdmin.css');
        $class->addJS( $this->pathjs . 'addClassAdmin.js');
        $class->render();
    }

    function progress(){
        $class = new ViewLayout();
        $class->setTitle('Progress');
        $class->setActivePage(2);
        $class->addCSS( $this->pathcss . 'progressclass.css');
        $class->addJS( $this->pathjs . 'progressclass.js');
        $class->render();
    }

    public function getclasses()
    {
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->getClasses($datareq);
            echo json_encode($class);
        }
    }
    public function addClass()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->addClass($datareq);
            echo json_encode($class);
        }
    }
    public function editCLass()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->editCLass($datareq);
            echo json_encode($class);
        }
    }

    public function deleteClass()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->deleteClass($datareq);
            echo json_encode($class);
        }
    }
    public function updateStatus()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->updateStatus($datareq);
            echo json_encode($class);
        }
    }

    public function getprogress($idClass){
        $class = $this->classModel->getProgressAllByClass($idClass);
        echo json_encode($class);
    }

    public function getprogressdetail($idUser,$idClass){
        $class = $this->classModel->getProgressByClass($idUser,$idClass);
        echo json_encode($class);
    }
}
