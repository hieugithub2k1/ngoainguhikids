<?php

namespace AdminControllers;

use Views\ViewLayout;

class StudentsControllerAdmin
{
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';
    function __construct()
    {

    }

    function index()
    {
        $class = new ViewLayout();
        $class->setTitle('Danh sách học viên');
        $class->setActivePage(10);
        // $class->templatehtml = file_get_contents('public/temphtml/tempadmin/students.html');
        $class->addCSS($this->pathcss . 'studentsadmin.css');
        $class->addJS($this->pathjs . 'studentsadmin.js');
        $class->render();
    }

}