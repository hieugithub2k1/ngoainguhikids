<?php
namespace Controllers;

class DashboardController{
    private $classModel;
    private $pathcss = 'public/css/Users/';
    private $pathjs = 'public/js/Users/';
    function __construct()
    {
        $this->classModel = new \Models\DashboardModel();
    }
    function index(){
        $dashboard = new \Views\ViewLayout(); 
        $dashboard->setTitle('Dashboard - Anh Ngữ BM');
        $dashboard->setActivePage(1);
        $dashboard->addCSS('public/css/Admin/dashboardAdmin.css');
        $dashboard->addJS($this->pathjs . 'dashboard.js');
        $dashboard->render();
    }
    function getCountStudentStatus(){
        $count = $this->classModel->getCountStudentStatus();
        echo json_encode($count);
    }
    function getStudentClass(){
        $count = $this->classModel->getClassStudent();
        echo json_encode($count);
    }

}