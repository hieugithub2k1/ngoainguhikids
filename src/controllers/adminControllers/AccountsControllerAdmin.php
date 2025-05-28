<?php
namespace AdminControllers;
class AccountsControllerAdmin
{
    private $classModel;
    private $accountModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';
    function __construct()
    {
        $role = \Cores\Authentication::getRole();
        if($role !== 2){
            header('Location:' . WEB_ROOT );
        }
        $this->classModel = new \Models\ClassModel();
        $this->accountModel = new \Models\AccountModel();
    }

    public function index()
    {
        $accounts = new \Views\ViewLayout();
        $accounts->setTitle('Manage Accounts');
        $accounts->setActivePage(8);
        $accounts->addCSS($this->pathcss . 'accountadmin.css');
        $accounts->addJS($this->pathjs . 'accountadmin.js');
        $accounts->render();
    }
    // Các phương thức dành cho ajax

    public function getClassActive(){
        $dataResponse = $this->classModel->getClassActive();
        echo json_encode($dataResponse);
    }

    public function getAccountsFilter($currentPage = 1, $limit =20){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataReq['currentPage'] = $currentPage;
            $dataReq['limit'] = $limit;
            $dataResponse = $this->accountModel->getAccountsFilter($dataReq);
            echo json_encode($dataResponse);
        }
    }

    public function updateRoleAndStatus(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataResponse = $this->accountModel->updateRoleAndStatus($dataReq);
            echo json_encode($dataResponse);
        }
    }

    function getAccountsByEmail(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataResponse = $this->accountModel->getAccountsByEmail($dataReq);
            echo json_encode($dataResponse);
        }
    }
    

    
}