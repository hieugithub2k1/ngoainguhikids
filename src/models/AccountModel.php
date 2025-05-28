<?php

namespace Models;

class AccountModel
{
    private $conn = null;
    private $table = 'accounts';

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function getLinkImgModel($id){
        $sql = "SELECT avatar FROM $this->table WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 0) {
            return null;
        }
        $row = $result->fetch_assoc();
        return $row['avatar'];
    }

    public function getAccountById($id){
        $sql = "SELECT * FROM $this->table WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 0) {
            return null;
        }
        $row = $result->fetch_assoc();
        return [
            'id' => $row['id'],
            'fullName' => $row['fullName'],
            'email' => $row['email'],
            'roles' => $row['roles'],
            'statuss' => $row['statuss'],
            'avatar' => $row['avatar']
        ];
    }

    public function getAccountByEmail($email){
        $sql = "SELECT * FROM $this->table WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        // kiểm tra xem tài khoản có tồn tại hay Không
        if ($result->num_rows == 0) {
            return null;
        }
        $row = $result->fetch_assoc();
        $status = $row['statuss'];
        if ($status == 2) {
            return [
                'error' => 'Account is locked'
            ];
        }
        if ($status == 0) {
            return [
                'error' => 'Account is not activated'
            ];
        }
        return [
            'id' => $row['id'],
            'fullName' => $row['fullName'],
            'roles' => $row['roles'],
            'statuss' => $row['statuss']
        ];
    }

    public function signinGoogleModel($dataRow){
        $emaiReq = $dataRow['email'];
        $infoAccount = $this->getAccountByEmail($emaiReq);
        if($infoAccount){
            return $infoAccount;
        }
        $passGenerate = $this->generatePassword();
        $dataRow['password'] = $passGenerate;
        $addAcount = $this->addAccount($dataRow);
        if(isset($addAcount['error'])){
            return $addAcount;
        }
        $infoAccount = $this->getAccountByEmail($emaiReq);
        return $infoAccount;
    }

    public function signinModel($data)
    {
        $email = $data['email'];
        $pass = $data['password'];
        $sql = "SELECT * FROM $this->table WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 0) {
            return [
                'error' => 'Email does not exist'
            ];
        }
        $row = $result->fetch_assoc();
        if ($row['pass'] != $pass) {
            return [
                'error' => 'Password is incorrect'
            ];
        }
        $status = $row['statuss'];
        if ($status == 2) {
            return [
                'error' => 'Account is locked'
            ];
        }
        if ($status == 0) {
            return [
                'error' => 'Account is not activated'
            ];
        }
        $_SESSION['id'] = $row['id'];
        $_SESSION['fullName'] = $row['fullName'];
        $_SESSION['roles'] = $row['roles'];
        return [
            'id' => $row['id'],
            'fullName' => $row['fullName'],
            'roles' => $row['roles']
        ];
    }


    public function addAccount($dataRow)
    {
        $fullName = $dataRow['fullName'];
        $email = $dataRow['email'];
        $pass = $dataRow['password'];
        $avatar = isset($dataRow['avatar']) ? $dataRow['avatar'] : null; 
        $roles = 0;
        $statuss = 1;
        $sql = "INSERT INTO $this->table (fullName, email, pass, roles, statuss, avatar) VALUES (?, ?, ?, ?, ?, ?)";
        try {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            $this->conn->begin_transaction();
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('sssiis', $fullName, $email, $pass, $roles, $statuss, $avatar);
            $stmt->execute();
            $this->conn->commit();
            return [
                'message' => 'Account registration successful'
            ];
        } catch (\Exception $e) {
            $this->conn->rollback();
            if ($e->getCode() == 1062) {  // 1062 là mã lỗi MySQL cho Duplicate entry
                return [
                    'error' => 'Email already exists'
                ];
            } else {
                return [
                    'error' => 'Database error: ' . $e->getMessage()
                ];
            }
        }
    }

    public function generatePassword($length = 8)
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function getAccountsFilter($dataRow){

        $idClass = isset($dataRow['idClass']) ? $dataRow['idClass'] : null;
        $role = isset($dataRow['role']) ? $dataRow['role'] : null;
        $status = isset($dataRow['status']) ? $dataRow['status'] : null;
        $currentPage = $dataRow['currentPage'];
        $limit = $dataRow['limit'];
        $offset = ($currentPage - 1) * $limit;
        // viết câu lệnh truy vấn dựa trên các điều kiện trên
        $sql = "select acc.id, acc.fullName, acc.email, acc.roles, acc.statuss, acc.createdAt,  acc.avatar, GROUP_CONCAT(CASE WHEN cl.statuss = 1 AND accl.statuss = 1 THEN cl.className END SEPARATOR ', ') AS className from accounts as acc
        left join accounts_classes as accl on acc.id = accl.idAccounts
        left join classes cl on cl.id = accl.idClasses";

        $conditions = [];

        if ($idClass !== null) {
            $conditions[] = "cl.id = $idClass";
        }
        
        if ($role !== null) {
            $conditions[] = "acc.roles = $role";
        }
        
        if ($status !== null) {
            $conditions[] = "acc.statuss = $status";
        }

        if (count($conditions) > 0) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $sql .= " GROUP BY acc.id ORDER BY id DESC LIMIT $limit OFFSET $offset";


        $stmt = $this->conn->query($sql);
        $accounts = $stmt->fetch_all(MYSQLI_ASSOC);

        $sqlTotalRows = "select count(*) as total from accounts as acc left join accounts_classes as accl on acc.id = accl.idAccounts left join classes cl on cl.id = accl.idClasses";
        if (count($conditions) > 0) {
            $sqlTotalRows .= " WHERE " . implode(" AND ", $conditions);
        }
        $stmtTotalRows = $this->conn->query($sqlTotalRows);
        $totalRows = $stmtTotalRows->fetch_assoc()['total'];
        $totalPages = ceil($totalRows / $limit);

        return [
            'accounts' => $accounts,
            'totalPages' => $totalPages
        ];
    }

    function updateRoleAndStatus($dataRow){
        $conditionRole = isset($dataRow['role']) ? $dataRow['role'] : null;
        $conditionStatus = isset($dataRow['status']) ? $dataRow['status'] : null;
        $arrId = $dataRow['arrid'];

        $sql = "UPDATE $this->table SET ";
        $setConditions = [];

        if ($conditionRole !== null) {
            $setConditions[] = "roles = $conditionRole"; // Gán trực tiếp giá trị
        }

        if ($conditionStatus !== null) {
            $setConditions[] = "statuss = $conditionStatus"; // Gán trực tiếp giá trị
        }
        
        if (empty($setConditions)) {
            return [
                'error' => 'No data to update'
            ];
        }
        $sql .= implode(", ", $setConditions);
        $sql .= " WHERE id IN (" . implode(",", $arrId) . ")";

        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $this->conn->commit();
            return [
                'message' => 'Update successful'
            ];
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => 'Database error'
            ];
        }
    }
    // function getAccountsByEmail($dataRow){
    //     $email = $dataRow['email'];
    //     $sql = "select acc.id, acc.fullName, acc.email, acc.roles, acc.statuss, acc.createdAt,  acc.avatar, GROUP_CONCAT(CASE WHEN cl.statuss = 1 THEN cl.className END SEPARATOR ', ') AS className from accounts as acc
    //     left join accounts_classes as accl on acc.id = accl.idAccounts
    //     left join classes cl on cl.id = accl.idClasses
    //     where email like '%$email%' or fullName like '%$email%'
    //     group by acc.id order by id desc";
    //     $stmt = $this->conn->query($sql);
    //     $accounts = $stmt->fetch_all(MYSQLI_ASSOC);
    //     return $accounts;
    // }

    function getAccountsByEmail($dataRow) {
        $email = $dataRow['email'];
        $sql = "
        SELECT 
            acc.id, acc.fullName, acc.email, acc.roles, acc.statuss, acc.createdAt, acc.avatar, 
            GROUP_CONCAT(CASE WHEN cl.statuss = 1 THEN cl.className END SEPARATOR ', ') AS className,
            (LENGTH(acc.email) - LENGTH(REPLACE(acc.email, '$email', ''))) / LENGTH('$email') AS email_match_score,
            (LENGTH(acc.fullName) - LENGTH(REPLACE(acc.fullName, '$email', ''))) / LENGTH('$email') AS fullName_match_score
        FROM accounts AS acc
        LEFT JOIN accounts_classes AS accl ON acc.id = accl.idAccounts
        LEFT JOIN classes cl ON cl.id = accl.idClasses
        WHERE acc.email LIKE '%$email%' OR acc.fullName LIKE '%$email%'
        GROUP BY acc.id
        ORDER BY email_match_score DESC, fullName_match_score DESC, acc.id DESC limit 10";
        
        $stmt = $this->conn->query($sql);
        $accounts = $stmt->fetch_all(MYSQLI_ASSOC);
        return $accounts;
    }

    function getNameAndEmailById($id){
        $sql = "SELECT fullName, email FROM $this->table WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 0) {
            return null;
        }
        $row = $result->fetch_assoc();
        return [
            'fullName' => $row['fullName'],
            'email' => $row['email']
        ];
    }
}