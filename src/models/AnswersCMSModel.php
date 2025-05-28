<?php
namespace Models;
class AnswersCMSModel{
    private $table = 'answersCMS';
    private $conn = null;
    function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function addAnswer($idQuestion,$dataRow){

        $answerName = $dataRow['answerName'];
        $isCorrect = $dataRow['isCorrect'];
        $isCorrect = $isCorrect ? 1 : 0;

        $answerName = $this->conn->real_escape_string($answerName);

        $sql = "INSERT INTO $this->table (answerName, isCorrect, idQuestionsCMS) VALUES ('$answerName', $isCorrect, $idQuestion)";
        
        try {
            $this->conn->query($sql);
            return true;
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    function deleteAnswer($arrIdAnswer)
    {
        if (count($arrIdAnswer) == 0) {
            return;
        }
        $sql = "DELETE FROM $this->table WHERE id IN (" . implode(',', $arrIdAnswer) . ")";
        $check = $this->conn->query($sql);
        if (!$check) {
            throw new \Exception("Failed to delete answer: " . $this->conn->error);
        }
    }
}