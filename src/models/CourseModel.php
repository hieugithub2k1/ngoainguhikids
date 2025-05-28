<?php
namespace Models;
class CourseModel{

    private $conn = null;
    private $table = 'courses';

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function getAllCourses(){
        $sql = "SELECT * FROM $this->table ORDER BY id DESC";
        $stmt = $this->conn->query($sql);
        $courses = $stmt->fetch_all(MYSQLI_ASSOC);
        return $courses;
    }

    public function getCourses($itemsPerPage, $currentPage)
    {
        $offset = ($currentPage - 1) * $itemsPerPage;
        $totalCourses = $this->getTotalCourses();
        $totalPages = ceil($totalCourses / $itemsPerPage);
        $sql = "SELECT cou.*, COUNT(les.id) AS totalLesson 
        FROM $this->table as cou
        LEFT JOIN lessons as les ON les.idCourses = cou.id 
        GROUP BY cou.id
        ORDER BY cou.id DESC
        LIMIT $itemsPerPage OFFSET $offset";

        $stmt = $this->conn->query($sql);
        $courses = $stmt->fetch_all(MYSQLI_ASSOC);
        return [
            'courses' => $courses,
            'totalPages' => $totalPages
        ];
    }

    public function getCoursesById($courseId){
        $sql = "SELECT * FROM $this->table WHERE id = $courseId";
        $stmt = $this->conn->query($sql);
        $course = $stmt->fetch_assoc();
        return $course;
    }

    public function getTotalCourses(){
        $totalItemsQuery = $this->conn->query("SELECT COUNT(*) as total FROM $this->table");
        $totalItems = $totalItemsQuery->fetch_assoc();
        return $totalItems['total'];
    }

    public function addCourse($dataRow){
        $courseName = $dataRow['courseName'];
        $sql = "INSERT INTO $this->table (courseName) VALUES ('$courseName')";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newCourseId = $this->conn->insert_id;
            $newCourse = $this->getCoursesById($newCourseId);
            $this->conn->commit();
            return $newCourse;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function editCourse($dataRow){
        $courseId = $dataRow['id'];
        $courseName = $dataRow['courseName'];
        $sql = "UPDATE $this->table SET courseName = '$courseName'  WHERE id = $courseId";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newCourse = $this->getCoursesById($courseId);
            $this->conn->commit();
            return $newCourse;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function deleteCourse($dataRow){
        $courseId = $dataRow['id'];
        $sql = "DELETE FROM $this->table WHERE id = $courseId";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollback();

            if($e->getCode() == 1451){
                return [
                    'error' => 'This course is being used by other data'
                ];
            }

            return [
                'error' => $e->getMessage()
            ];
        }
    }
}