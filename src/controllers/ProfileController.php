<?php
namespace Controllers;
use Views\ViewLayout;

class ProfileController
{
    private $profileModel;

    function __construct()
    {
        $this->profileModel = new \Models\ProfileModel();
    }

    function index()
    {
        $profile = new ViewLayout();
        $profile->setTitle('Profile - Anh Ngữ MB');
        $profile->setActivePage(4);
        $profile->addCSS('public/css/Admin/profileAdmin.css');
        $profile->addJS('public/js/Admin/ProfileAdmin.js');
        $profile->render();
    }
    public function getAccount()
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
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $account = $this->profileModel->changepassword($datareq);
            echo json_encode($account);
        }
    }

}
