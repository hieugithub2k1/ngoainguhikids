<?php

namespace Models;

class ResultCMSModel
{
    private $conn = null;
    private $table = 'resultsCMS';
    private $tableDetail = 'results_details_CMS';

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    function submitQuiz($idUser, $request)
    {
        $idClass = $request['idClasses'];
        $idQuiz = $request['idQuizzesCMS'];
        $idLesson = $request['idLesson'];
        $score = $request['score'];
        $answers = $request['answers'];

        $idResult = $this->getIdResult($idUser, $idClass, $idQuiz);
        try {
            $this->conn->begin_transaction();
            if ($idResult === null) {
                $this->inserResult($idUser, $idClass, $idQuiz, $score, $answers);
            } else {
                $this->updateRusult($idResult, $score, $answers);
            }
            $quizModel = new QuizzesCMSModel();
            $scoreUnit = $quizModel->getPercentScoreLesson($idUser, $idClass, $idLesson);
            $this->conn->commit();
            return ['success' => 'success', 'scoreUnit' => $scoreUnit];
        } catch (\Exception $e) {
            $this->conn->rollback();
            return ['error' => $e->getMessage()];
        }
    }

    function getIdResult($idUser, $idClass, $idQuiz, $getScore = false)
    {
        $sql = "select re.id, re.score from $this->table as re
        where re.idAccounts = $idUser and re.idClasses = $idClass and re.idQuizzesCMS = $idQuiz";
        $result = $this->conn->query($sql);
        $row = $result->fetch_assoc();
        if ($row) {
            if($getScore){
                return $row;
            }
            return $row['id'];
        }
        return null;
    }

    function inserResult($idUser, $idClass, $idQuiz, $score, $arrAnswer)
    {
        $sql = "insert into $this->table(idAccounts,idClasses,idQuizzesCMS,score) values($idUser,$idClass,$idQuiz,$score)";
        $check = $this->conn->query($sql);
        if (!$check) {
            throw new \Exception($this->conn->error);
        }
        $idResult = $this->conn->insert_id;
        return $this->inserResultDetail($idResult, $arrAnswer);
    }

    function inserResultDetail($idResult, $arrAnswer)
    {

        $sql = "insert into $this->tableDetail(idResultsCMS,idQuestionsCMS,idAnswersCMS,userAnswer,isCorrect) values";
        $values = [];
        foreach ($arrAnswer as $row) {
            $type = $row['type'];
            $idQuestion = $row['idQuestion'];
            $idAnswer = $row['idAnswer'];
            $isCorrect = $row['isCorrect'] ? 1 : 0;
            $answer = $row['answer'];
            if($idAnswer === null){
                continue;
            }
            if($answer !== null){
                $answer = $this->conn->real_escape_string($answer);
                $answer = "'$answer'";
                if($type == 0){
                    $answer = null;
                }
            }
        
            $values[] = "($idResult,$idQuestion,$idAnswer,". ($answer === null ? "NULL" : $answer) .",$isCorrect)";
        }

        if(count($values) === 0){
            return true;
        }

        $sql .= implode(',', $values);

        $check = $this->conn->query($sql);
        if (!$check) {
            throw new \Exception($this->conn->error);
        }
        return true;
    }

    function updateRusult($idResult, $score, $arrAnswer)
    {
        $sql = "update $this->table set score = $score where id = $idResult";
        $check = $this->conn->query($sql);
        if (!$check) {
            throw new \Exception($this->conn->error);
        }
        return $this->updateResultDetail($idResult, $arrAnswer);
    }

    function updateResultDetail($idResult, $arrAnswer)
    {
        $oldDetail = $this->getResultDetailByIdResult($idResult);

        $sql = "update $this->tableDetail set";

        $arrNewDetail = [];

        $arrIdDetail = [];
        $arrColumnIdAnswer = [];
        $arrColumnAnswer = [];
        $arrColumnIsCorrect = [];

        $checkQuery = false;

        for ($i = 0; $i < count($arrAnswer); $i++) {
            $row = $arrAnswer[$i];
            $idQuestion = $row['idQuestion'];
            $idAnswer = $row['idAnswer'];
            $answer = $row['answer'];
            $isCorrect = $row['isCorrect'] ? 1 : 0;
            $type = $row['type'];

            if($idAnswer === null){
                continue;
            }

            if (!isset($oldDetail[$idQuestion])) {
                $arrNewDetail[] = $row;
                continue;
            }

            $idDetail = $oldDetail[$idQuestion]['id'];

            if ($answer !== null) {
                $answer = $this->conn->real_escape_string($answer);
                $answer = "'$answer'";
                if ($type == 0) {
                    $answer = null;
                }
            }

            $checkQuery = true;
            $arrIdDetail[] = $idDetail;
            $arrColumnIdAnswer[] = "when id = $idDetail then $idAnswer";
            $arrColumnAnswer[] = "when id = $idDetail then " . ($answer === null ? "NULL" : $answer);
            $arrColumnIsCorrect[] = "when id = $idDetail then $isCorrect";
        }

        if(count($arrNewDetail) > 0){
            $this->inserResultDetail($idResult, $arrNewDetail);
        }

        if(!$checkQuery){
            return true;
        }

        $sql .= " idAnswersCMS = case " . implode(' ', $arrColumnIdAnswer) . " end, ";
        $sql .= " userAnswer = case " . implode(' ', $arrColumnAnswer) . " end, ";
        $sql .= " isCorrect = case " . implode(' ', $arrColumnIsCorrect) . " end ";
        $sql .= "where id in (" . implode(',', $arrIdDetail) . ")";

        $check = $this->conn->query($sql);
        if (!$check) {
            throw new \Exception($this->conn->error);
        }
        return true;

    }

    function getResultDetailByIdResult($idResult)
    {
        $sql = "select * from results_details_CMS as red
        where red.idResultsCMS = $idResult";
        $result = $this->conn->query($sql);
        $result = $result->fetch_all(MYSQLI_ASSOC);
        $arr = [];
        foreach ($result as $row) {
            $arr[$row['idQuestionsCMS']] = $row;
        }
        return $arr;
    }
}
