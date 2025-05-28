<?php

namespace Models;
class DashboardModel
{
    private $table = 'classes';
    public function getCountClass()
    {
        $sql = "select COUNT(*) as total_rows from $this->table";
        $stmt = BaseModel::getInstance()->query($sql);
        $total = $stmt->fetch_assoc();
        return [
            'total' => $total['total_rows'],
            'fullName' => $_SESSION['fullName']
        ];
    }
    public function getCountStatus()
    {
        $sql = "SELECT statuss, COUNT(*) AS total_rows
                FROM classes
                WHERE statuss IN (0, 1)
                GROUP BY statuss";
        $stmt = BaseModel::getInstance()->query($sql);
        $totals = $stmt->fetch_all(MYSQLI_ASSOC);
        $result = [];
        foreach ($totals as $row) {
            $result[] = [
                'statuss' => $row['statuss'],
                'total' => $row['total_rows'],
            ];
        }
        return $result;
    }
// student count
    public function getClassStudent(){
        $idAccount = $_SESSION['id'];
        $sql = "SELECT COUNT(*) as total_rows FROM accounts_classes WHERE idAccounts = '$idAccount' AND statuss = 1";
        $stmt = BaseModel::getInstance()->query($sql);
        $total = $stmt->fetch_assoc();
        return [
            'idAccount' => $idAccount,
            'fullName' => $_SESSION['fullName'],
            'total' => $total['total_rows'],
        ];
    }
    public function getCountStudentStatus()
    {
        $idAccount = $_SESSION['id'];
        $sql = "SELECT statuss, COUNT(*) AS total_rows
                FROM accounts_classes
                WHERE statuss IN (0, 1) and idAccounts = '$idAccount'
                GROUP BY statuss";
        $stmt = BaseModel::getInstance()->query($sql);
        $totals = $stmt->fetch_all(MYSQLI_ASSOC);
        $result = [];
        foreach ($totals as $row) {
            $result[] = [
                'statuss' => $row['statuss'],
                'total' => $row['total_rows'],
            ];
        }
        return $result;
    }

}
