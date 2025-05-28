<?php
namespace Config;
class Routers{

    const URL404 = './src/views/file404.php';

    static function routersAdmin(){
        return [
            'dashboard' => ['index','getcourse'],
            'courses' => ['index'],
        ];
    }

    static function routersUser(){
        return [
            'login' => ['index'],
            'dashboard' => ['index'],
        ];
    }

}