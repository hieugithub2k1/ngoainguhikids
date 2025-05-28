<?php

namespace Models;

class ClassDetailModel
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
    public function getClassDetails($classId)
    {
        $classId = $this->conn->real_escape_string($classId);
        $sql = "select ac.idClasses, c.className, a.id as idStudent, a.fullName, a.createdAt from accounts_classes as ac 
        inner join classes as c on c.id = ac.idClasses
        inner join accounts as a on a.id = ac.idAccounts
        where ac.idClasses = $classId AND ac.statuss = 1";
        $stmt = $this->conn->query($sql);
        $result = $stmt->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $result;
    }


    public function getClassesById($classId)
    {
        $classId = $this->conn->real_escape_string($classId);
        $sql = "SELECT * FROM $this->table WHERE id = $classId";
        $stmt = $this->conn->query($sql);
        $course = $stmt->fetch_assoc();
        return $course;
    }

    public function getTotalClasses()
    {
        $totalItemsQuery = $this->conn->query("SELECT COUNT(*) as total FROM $this->table");
        $totalItems = $totalItemsQuery->fetch_assoc();
        return $totalItems['total'];
    }

    public function addClass($dataRow)
    {
        $className = $dataRow['className'];
        $idCourses = $dataRow['courseId'];
        $className = $this->conn->real_escape_string($className);
        $idCourses = $this->conn->real_escape_string($idCourses);
        $sql = "INSERT INTO $this->table (className, statuss, idCourses) VALUES ('$className', 1,'$idCourses')";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newClassId = $this->conn->insert_id;
            $newClass = $this->getClassesById($newClassId);
            $this->conn->commit();
            return $newClass;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function deletedetailClass($dataRow)
    {
        $classDetailId = $dataRow['idStudent'];
        $idClass = $dataRow['idClass'];
        $sql = "DELETE FROM $this->table WHERE idAccounts = $classDetailId AND idClasses = $idClass";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }


    function getClassByCourseAndClass($idUser, $idCourse)
    {
        if($idCourse !== null){
            $idCourse = $this->conn->real_escape_string($idCourse);
        }

        $sql = "select co.courseName, cl.className, cl.id as idClass, ac.* from classes as cl
        inner join courses as co on co.id = cl.idCourses
        left join accounts_classes as ac on cl.id = ac.idClasses
        where cl.statuss = 1";

        if($idCourse !== null){
            $sql.= " and co.id = $idCourse";
        }

        $sql .= " ORDER BY cl.id DESC";

        // if($idCourse === null){
        //     $sql .= " limit 10";
        // }

        $stmt = $this->conn->query($sql);
        $result = $stmt->fetch_all(MYSQLI_ASSOC);

        $dataRes = [];

        foreach ($result as $key => $value) {
            $idClass = $value['idClass'];
            if(!isset($dataRes[$idClass])){
                $dataRes[$idClass] = [
                    'idClass' => $idClass,
                    'className' => $value['className'],
                    'courseName' => $value['courseName'],
                    'quantityStudent' => 0,
                    'statusUser' => null
                ];
            }

            if($value['idAccounts'] !== null){
                if($value['statuss'] == 1){
                    $dataRes[$idClass]['quantityStudent']++;
                }
                if($value['idAccounts'] == $idUser){
                    $dataRes[$idClass]['statusUser'] = $value['statuss'];
                }
            }
        }
        // return $sql;
        return array_values($dataRes);
    }

    function joinClass($idUser, $row)
    {
        $idClass = $row['idClass'];
        $idClass = $this->conn->real_escape_string($idClass);

        $sql = "select * from accounts_classes as ac 
        where ac.idAccounts = $idUser and ac.idClasses = $idClass";
        $stmt = $this->conn->query($sql);
        $result = $stmt->fetch_all(MYSQLI_ASSOC);
        if(count($result) > 0){
            return [
                'error' => 'You have already joined this class'
            ];
        }

        $sql = "INSERT INTO $this->table (idAccounts, idClasses, statuss) VALUES ($idUser, $idClass, 0)";

        try{
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $this->conn->commit();
            return true;
        }catch(\Exception $e){
            return [
                'error' => $e->getMessage()
            ];
        }
        echo json_encode($sql);
        die();
    }

    function cancelJoinClass($idUser,$row){

        $idClass = $row['idClass'];
        $idClass = $this->conn->real_escape_string($idClass);

        $sql = "delete from $this->table as ac
        where ac.idAccounts = $idUser and ac.idClasses = $idClass and ac.statuss = 0";

        try{
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $this->conn->commit();
            return true;
        }catch(\Exception $e){
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    function countMemberByClass($idClass){
        $idClass = $this->conn->real_escape_string($idClass);
        $sql = "select count(ac.idAccounts) as total from $this->table as ac
        where ac.idClasses = $idClass and ac.statuss = 1";
        $stmt = $this->conn->query($sql);
        $result = $stmt->fetch_assoc();
        return $result['total'];
    }

}
