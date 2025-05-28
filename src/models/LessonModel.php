<?php

namespace Models;

class LessonModel
{
    private $conn = null;
    private $table = 'lessons';

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function getLessons($itemsPerPage, $currentPage, $idCourse = null)
    {
        $offset = ($currentPage - 1) * $itemsPerPage;
        $sql = "select SQL_CALC_FOUND_ROWS co.courseName, co.id as idCourse, le.*, count(qui.id) as totalQuiz from $this->table as le
        inner join courses as co on co.id = le.idCourses
        left join quizzesCMS as qui on qui.idLessons = le.id";
        if($idCourse !== null){
            $sql .= " WHERE le.idCourses = $idCourse";
        }
        $sql .= " group by le.id ORDER BY le.id DESC LIMIT $itemsPerPage OFFSET $offset";
        $stmt = $this->conn->query($sql);
        $totalRow = $this->conn->query("SELECT FOUND_ROWS() as total")->fetch_assoc()['total'];
        $totalPages = ceil($totalRow / $itemsPerPage);
        $lessons = $stmt->fetch_all(MYSQLI_ASSOC);
        return [
            'lessons' => $lessons,
            'totalPages' => $totalPages
        ];
    }
    public function getLessonsById($lessonId)
    {
        $sql = "SELECT * FROM $this->table WHERE id = $lessonId";
        $stmt = $this->conn->query($sql);
        $course = $stmt->fetch_assoc();
        return $course;
    }

    public function gettotalLessons()
    {
        $totalItemsQuery = $this->conn->query("SELECT COUNT(*) as total FROM $this->table");
        $totalItems = $totalItemsQuery->fetch_assoc();
        return $totalItems['total'];
    }

    public function addLesson($dataRow)
    {
        $lessonName = $dataRow['lessonName'];
        $idCourses = $dataRow['courseId'];
        $sql = "INSERT INTO $this->table (lessonName, idCourses) VALUES ('$lessonName', '$idCourses')";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newLessonId = $this->conn->insert_id;
            $newLesson = $this->getLessonsById($newLessonId);
            $this->conn->commit();
            return $newLesson;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function editLesson($dataRow)
    {
        $lessonId = $dataRow['id'];
        $lessonName = $dataRow['lessonName'];
        $courseId = $dataRow['courseId'];
        $sql = "UPDATE $this->table SET lessonName = '$lessonName', idCourses = '$courseId'  WHERE id = $lessonId";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newCourse = $this->getLessonsById($lessonId);
            $this->conn->commit();
            return $newCourse;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function deleteLesson($dataRow)
    {
        $lessonId = $dataRow['id'];
        $sql = "DELETE FROM $this->table WHERE id = $lessonId";
        try {
            $this->conn->begin_transaction();
            $check = $this->conn->query($sql);
            if(!$check){
                throw new \Exception('Unable to delete this unit. Please delete all quizzes associated with this unit first');
            }
            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollback();

            if($e->getCode() === 1451){
                return [
                    'error' => 'This unit is being used by other data'
                ];
            }

            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function getLessonByCourseId($idCourse){
        $sql = "SELECT * FROM $this->table WHERE idCourses = $idCourse";
        $stmt = $this->conn->query($sql);
        $lessons = $stmt->fetch_all(MYSQLI_ASSOC);
        return $lessons;
    }

    public function getLessonByIdCourse($idUser,$iClass){
        $sql = "select le.lessonName, le.id as idLesson from lessons as le
        inner join courses as co on co.id = le.idCourses
        inner join classes as cl on co.id = cl.idCourses
        inner join accounts_classes as ac on cl.id = ac.idClasses
        where ac.idAccounts = $idUser and ac.statuss = 1 and cl.id = $iClass";
        $stmt = $this->conn->query($sql);
        $lessons = $stmt->fetch_all(MYSQLI_ASSOC);
        return $lessons;
    }
}
