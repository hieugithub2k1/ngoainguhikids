<?php
namespace AdminControllers;

class DashboardControllerAdmin{
    private $classModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';
    function __construct()
    {
        $this->classModel = new \Models\DashboardModel();
    }
    function index(){
        $dashboard = new \Views\ViewLayout(); 
        $dashboard->setTitle('dashboard - Admin');
        $dashboard->setActivePage(1);
        $dashboard->addCSS( $this->pathcss . 'dashboardAdmin.css');
        $dashboard->addJS( $this->pathjs . 'dashBoardAdmin.js');
        $dashboard->render();
    }


    function getCountClass(){
        $count = $this->classModel->getCountClass();
        echo json_encode($count);
    }
    function getCountStatus(){
        $count = $this->classModel->getCountStatus();
        echo json_encode($count);
    }
}