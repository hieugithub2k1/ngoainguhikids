<?php
namespace Cores;

class App{
    function __construct($controller,$action,$params = [],$role)
    {
        $controller = ucfirst($controller).'Controller';
        $nameSpace = '';
        if($role == 1 || $role == 2){
            $nameSpace = 'AdminControllers\\'.$controller . 'Admin';
        }else{
            $nameSpace = 'Controllers\\'.$controller;
        }
        $this->run($nameSpace,$action,$params);
    }

    function run($nameSpace,$action,$params = []){
        try{
            if(!class_exists($nameSpace)){
                throw new \Exception('Không tìm thấy class');
            }
            if(!method_exists($nameSpace,$action)){
                throw new \Exception('Không tìm thấy action');
            }
            call_user_func_array([new $nameSpace, $action], $params);
        }catch(\Exception $e){
            // echo "<h1 style = 'text-align: center; color: red; margin-top: 30px'>Lỗi chưa xác định, vui lòng liên hệ admin</h1>";
            // echo "<h3 style = 'text-align: center; color: blue; margin-top: 30px'>".$e->getMessage()."</h3>";
            $url = \Config\Routers::URL404;
            include_once $url;
        }
    }
}