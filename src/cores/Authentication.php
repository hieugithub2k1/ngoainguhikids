<?php
namespace Cores;
use Google\Client;
use \Models\AccountModel;

class Authentication{
    private $id;
    private $name;
    private $role;
    private $priveKey = "123fdjfjdfdjfdjf";
    private $IdClient = "865532873608-aik1oar7v5gimbu4m84dcl2aj8me92ih.apps.googleusercontent.com";

    static function setAccountSession($arrAccount){
        $_SESSION['acc'] = $arrAccount;
        // return [
        //     'id' => $row['id'],
        //     'fullName' => $row['fullName'],
        //     'roles' => $row['roles']
        // ];
    }

    static function isLoginSession() {
        return isset($_SESSION['acc']) ? true : false;
    }

    static function isLoginCookie() {
        if(isset($_COOKIE['user_token_mb'])){
            $token = $_COOKIE['user_token_mb'];
            $userData = self::decryption($token);
            if($userData){
                $accountModel = new AccountModel();
                $account = $accountModel->getAccountById($userData['id']);
                if(!$account){
                  return false;
                }
                if($account['statuss'] == 0 || $account['statuss'] == 2){
                  return false;
                }
                $userData['roles'] = $account['roles'];
                $userData['fullName'] = $account['fullName'];
                self::setAccountSession($userData);
                return true;
            }
            return false;
        }
        return false;
    }

    static function getId(){
        return isset($_SESSION['acc']['id']) ? $_SESSION['acc']['id'] : null;
    }

    static function getRole(){
        return isset($_SESSION['acc']['roles']) ? $_SESSION['acc']['roles'] : null;
    }

    static function getFullName(){
        return isset($_SESSION['acc']['fullName']) ? $_SESSION['acc']['fullName'] : null;
    }

    static function logout(){
        session_destroy();
        setcookie('user_token_mb', '', time() - 3600, '/');
    }


    function getInfoByIdTokenGoogle($idToken){

        $client = new Client([ $idToken => $this->IdClient]); // Thay bằng client ID của bạn
        $payload = $client->verifyIdToken($idToken);
        if ($payload) {
            // ID Token hợp lệ, xử lý thông tin người dùng
            $email = $payload['email']; // Email của người dùng
            $nameGoogle = $payload['name']; // Tên người dùng
            $avatar = $payload['picture']; // Ảnh đại diện
            return [
                'email' => $email,
                'fullName' => $nameGoogle,
                'avatar' => $avatar
            ];
        } else {
            // ID Token không hợp lệ
            return [
                'error' => 'ID Token không hợp lệ'
            ];
        }

    }

    static function getAvatar() {
        $linkimgdefault = 'public/img/default_profile.jpg';
        $id = self::getId();
        if(!$id){
            return $linkimgdefault;
        }
        $accountModel = new \Models\AccountModel();
        $linkimg = $accountModel->getLinkImgModel($id);
        if(!$linkimg){
            return $linkimgdefault;
        }
        $headers = @get_headers($linkimg);
        if($headers && strpos($headers[0], '200')) {
            return $linkimg;
        } else {
            return $linkimgdefault;
        }
    }

    static function encryption($arrAccount){
        $serialized = serialize($arrAccount);
        return base64_encode($serialized);
    }
    
    static function decryption($stringAccount) {
        $decoded = base64_decode($stringAccount, true); // true để trả về false nếu chuỗi không hợp lệ
        if ($decoded === false) {
            return false; // Nếu không thể giải mã base64, trả về false
        }
        // Giải nén từ serialized
        $unserialized = @unserialize($decoded); // Dùng @ để ngăn thông báo lỗi
        if ($unserialized === false && $decoded !== 'b:0;') { // Kiểm tra nếu unserialize không thành công
            return false; // Nếu không thể giải nén, trả về false
        }
        return $unserialized; // Trả về mảng đã giải nén
    }


}