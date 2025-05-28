<?php
namespace Controllers;

class IpaController{
    private $pathcss = 'public/css/Users/';
    private $pathjs = 'public/js/Users/';

    function index(){
        $ipa = new \Views\ViewLayout(); 
        $ipa->setTitle('IPA - Anh Ngữ BM');
        $ipa->setActivePage(4);
        $ipa->addCSS('public/css/Users/ipa.css');
        $ipa->addJS($this->pathjs . 'ipa.js');
        $ipa->render();
    }


}