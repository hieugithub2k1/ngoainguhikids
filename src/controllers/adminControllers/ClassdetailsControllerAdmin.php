<?php

namespace AdminControllers;

use Views\ViewLayout;

class ClassdetailsControllerAdmin
{
    private $classAccModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';

    function __construct()
    {
        $this->classAccModel = new \Models\ClassDetailModel();
    }

    function index()
    {
        $class = new ViewLayout();
        $class->setTitle('Danh sách học viên');
        $class->setActivePage(2);
        $class->addCSS($this->pathcss . 'classAdmin.css');
        $class->addJS($this->pathjs . 'classDetailsAdmin.js');
        $class->render();
    }
    
    public function getclassdetails() 
    {
        if (isset($_GET['classId'])) {
            $classId = intval($_GET['classId']);
            $students = $this->classAccModel->getClassDetails($classId);
            echo json_encode($students);
        } else {
            echo json_encode(['error' => 'Invalid classId']);
        }
    }
    public function deletedetailClass()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classAccModel->deletedetailClass($datareq);
            echo json_encode($class);
        }
    }

}
