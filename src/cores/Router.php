<?php

namespace Cores;

use Config\Routers;
use Cores\Authentication;
class Router
{
    private $auth = null;
    private $controler = 'dashboard';
    private $action = 'index';
    private $params = [];
    private $isLogin = false;

    function __construct()
    {
        $this->auth = new Authentication();

        $arrUrl = $this->UrlProcess();
        $this->handlUrl($arrUrl);
        if($this->controler == 'logout'){
            $this->auth->logout();
            header('Location:' . WEB_ROOT);
            die();
        }
        $this->isLogin = $this->auth->isLoginSession();
        if(!$this->isLogin){
            $this->isLogin = $this->auth->isLoginCookie();
        }
        if(!$this->isLogin){
            new \Controllers\LoginController();
            die();
        }
        $roleLogin = $this->auth->getRole();
        if($roleLogin == 1 || $roleLogin == 2){
            $this->hanldAdmin();
        }else{
            $this->handlUser();
        }
    }


    function handlUrl($arrUrl){
        if (isset($arrUrl[0]) && $arrUrl[0] == 'admin') {
            $this->controler = isset($arrUrl[1]) ? $arrUrl[1] : $this->controler;
            $this->action = isset($arrUrl[2]) ? $arrUrl[2] : $this->action;
            $this->params = $this->handlParams($arrUrl, 3);
        } else {
            $this->controler = isset($arrUrl[0]) ? $arrUrl[0] : $this->controler;
            $this->action = isset($arrUrl[1]) ? $arrUrl[1] : $this->action;
            $this->params = $this->handlParams($arrUrl, 2);
        }
    }


    function handlUser() {
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            new \Cores\App($this->controler, $this->action, $this->params, 0);
            die();
        }
        // if(!$this->isRouters()) {
        //     header('Location:' . WEB_ROOT);
        //     die();
        // }
        new \Cores\App($this->controler, $this->action, $this->params, 0);
    }

    function hanldAdmin()
    {
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            new \Cores\App($this->controler, $this->action, $this->params, 1);
            die();
        }
        // if(!$this->isRouters()) {
        //     header('Location:' . WEB_ROOT . 'admin');
        //     die();
        // }
        new \Cores\App($this->controler, $this->action, $this->params, 1);
    }

    function handlParams($arrUrl, $num)
    {
        if (!isset($arrUrl[$num])) {
            return [];
        }
        $respon = [];
        foreach ($arrUrl as $index => $item) {
            if ($index < $num) {
                unset($arrUrl[$index]);
            } else {
                array_push($respon, $item);
            }
        }
        return $respon;
    }

    function render404()
    {
        include_once Routers::URL404;
        die();
    }

    function isRouters($isAdmin = false)
    {
        $routers = $isAdmin ? Routers::routersAdmin() : Routers::routersUser();
        if (array_key_exists($this->controler, $routers)) {
            if (in_array($this->action, $routers[$this->controler])) {
                return true;
            }
            return false;
        }
        return false;
    }

    function UrlProcess()
    {
        if (isset($_GET['url'])) {
            $url = strtolower($_GET['url']);

            $arr = explode("/", trim(trim($url, " "), "/"));
            return $arr;
        }
    }
}
