<?php
session_start();
define('DIR_ROOT', __DIR__);
date_default_timezone_set('Asia/Ho_Chi_Minh');
$currentDateTime = date('H:i:s d-m-Y');
define("NOW", $currentDateTime);

include_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// dành cho server
define("WEB_ROOT", $_ENV['HTTP_ROOT']);

new Cores\Router();







