<?php
namespace AdminControllers;
use Views\ViewLayout;

class ProfileControllerAdmin
{
    private $profileModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';

    function __construct()
    {
        $this->profileModel = new \Models\ProfileModel();
    }

    function index()
    {
        $profile = new ViewLayout();
        $profile->setTitle('Profile');
        $profile->setActivePage(4);
        $profile->addCSS( $this->pathcss . 'profileAdmin.css');
        $profile->addJS( $this->pathjs . 'ProfileAdmin.js');
        $profile->render();
    }
    public function getaccount()
    {
        $profile = $this->profileModel->getAccount();
        echo json_encode($profile);
    }
    public function updateAccount()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $account = $this->profileModel->updateAccount($datareq);
            echo json_encode($account);
        }
    }
    public function changepassword(){

        echo json_encode('change password in admin');
        die();

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $account = $this->profileModel->changepassword($datareq);
            echo json_encode($account);
        }
    }

}
