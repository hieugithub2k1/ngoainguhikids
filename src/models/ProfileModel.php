<?php

namespace Models;

class ProfileModel
{

    private $conn = null;
    private $table = 'accounts';

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function getAccount()
    {
        $idUser = \Cores\Authentication::getId();
        if ($idUser !== null) {
            $user_id = $idUser;
            $sql = "SELECT * FROM $this->table WHERE id = $user_id AND statuss = 1";
            try {
                $this->conn->query($sql);
                $result = $this->conn->query($sql);
                if($result->num_rows == 0){
                    throw new \Exception("Account not found");
                }
                $row = $result->fetch_assoc();
                unset($row['pass']);
                return $row;
            } catch (\Exception $e) {
                return [
                    'error' => $e->getMessage()
                ];
            }
        } else {
            return [
                'error' => 'Account not found'
            ];
        }
    }


    public function updateAccount($dataRow)
    {
        $user_id = $dataRow['id'];
        $fullName = $dataRow['name'];
        $fullName = $this->conn->real_escape_string($fullName);
        $sql = "UPDATE $this->table SET fullName = '$fullName' WHERE id = $user_id";
        try {
            $this->conn->begin_transaction();
            $check = $this->conn->query($sql);
            if (!$check) {
                throw new \Exception("Update failed.");
            }
            $newClass = $this->getAccountById($user_id);
            $this->conn->commit();
            unset($newClass['pass']);
            $_SESSION['acc']['fullName'] = $newClass['fullName'];
            return $newClass;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function getAccountById($accountId)
    {
        $sql = "SELECT * FROM $this->table WHERE id = $accountId";
        $stmt = $this->conn->query($sql);
        $account = $stmt->fetch_assoc();
        return $account;
    }

    public function changepassword($datareq)
    {
        $id = $datareq['accountId'];
        $currenPassword = $datareq['currentPassword'];
        $newPassword = $datareq['newPassword'];
        $account = $this->getAccountById($id);
        if($account === null){
            return [
                'error' => 'Account not found'
            ];
        }
        if($account['pass'] !== $currenPassword){
            return [
                'error' => 'Current password is incorrect'
            ];
        }

        try{
            $newPassword = $this->conn->real_escape_string($newPassword);
            $this->conn->begin_transaction();
            $sql = "UPDATE $this->table SET pass = '$newPassword' where id = $id";
            $stmt = $this->conn->query($sql);
            if(!$stmt){
                throw new \Exception('Update password failed');
            }
            $this->conn->commit();
            return [
                'success' => 'Password updated'
            ];
        }catch(\Exception $e){
            return [
                'error' => $e->getMessage()
            ];
        }
    }
}
