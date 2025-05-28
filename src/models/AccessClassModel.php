<?php

namespace Models;

class AccessClassModel
{

    private $conn = null;
    private $table = 'accounts_classes';

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }
    public function getAccountName($idAccounts)
    {
        $sql = "SELECT * FROM accounts where id = $idAccounts";
        $stmt = $this->conn->query($sql);
        $class = $stmt->fetch_all(MYSQLI_ASSOC);
        return $class;
    }
    public function getAccessStatuss($currentClass)
    {
        if ($currentClass !== null && isset($currentClass['classId'])) {
            $classId = $currentClass['classId'];
        } else {
            $classId = null;
        }
        $conditions = [];
        if($classId !== null){
            $conditions[] = "ac.idClasses = $classId";
        }
        $sql = "select ac.idClasses, c.className, a.id as idStudent, a.fullName, a.createdAt from $this->table as ac 
            inner join classes as c on c.id = ac.idClasses
            inner join accounts as a on a.id = ac.idAccounts
            where ac.statuss = 0 ";
            if (count($conditions) > 0) {
                $sql .= "AND " . implode(  $conditions);
            }else{
                $sql .= "ORDER BY ac.createdAt DESC";
            };
        $stmt = $this->conn->query($sql);
        $result = $stmt->fetch_all(MYSQLI_ASSOC);
        return [
            'student' => $result,
            'sql' => $sql
        ];
    }


    public function getTotalClasses()
    {
        $totalItemsQuery = $this->conn->query("SELECT COUNT(*) as total FROM $this->table");
        $totalItems = $totalItemsQuery->fetch_assoc();
        return $totalItems['total'];
    }


    public function deleteAccessStatus($dataRow)
    {
        $classDetailId = $dataRow['idStudent'];
        $classId = $dataRow['idClass'];
        $sql = "DELETE FROM $this->table WHERE idAccounts = $classDetailId and idClasses = $classId";
        try {
            $this->conn->begin_transaction();
            $check = $this->conn->query($sql);
            if (!$check) {
                throw new \Exception($this->conn->error);
            }
            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }
    public function subaccessStatus($dataRow)
    {
        try {
            $this->conn->begin_transaction();
            foreach ($dataRow as $item) {
                $idUser = $item['idUser'];
                $idClass = $item['idClass'];
                $sql = "UPDATE $this->table SET statuss = 1 WHERE idAccounts = $idUser and idClasses = $idClass";
                $check = $this->conn->query($sql);
                if (!$check) {
                    throw new \Exception($this->conn->error);
                }
            }
            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }
}
