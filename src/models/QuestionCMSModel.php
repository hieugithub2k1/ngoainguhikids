<?php

namespace Models;

class QuestionCMSModel
{
    private $table = 'questionsCMS';
    private $conn = null;
    function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function addQuestion($idQuizCMS, $dataRow)
    {
        $questionName = $dataRow['questionName'];
        $typeAnswer = $dataRow['typeAnswers'];
        $answers = $dataRow['answers'];
        $note = $dataRow['note']; // note có thể null 

        $questionName = $this->conn->real_escape_string($questionName);
        $noteValue = "NULL";
        if ($note !== null && trim($note) !== '') {
            $noteEscaped = $this->conn->real_escape_string($note);
            $noteValue = "'$noteEscaped'";
        }

        $sql = "INSERT INTO $this->table (questionName, typeAnswers, idQuizzesCMS,note) VALUES ('$questionName', $typeAnswer, $idQuizCMS, $noteValue)";
        try {

            if (!$this->conn->query($sql)) {
                throw new \Exception("Failed to insert question: " . $this->conn->error);
            }

            $newQuestionId = $this->conn->insert_id;
            $answerModel = new AnswersCMSModel();
            if ($typeAnswer == 0) {
                foreach ($answers as $answer) {
                    $saveAnswer = $answerModel->addAnswer($newQuestionId, $answer);
                    if (isset($saveAnswer['error'])) {
                        throw new \Exception($saveAnswer['error']);
                    }
                }
            } else if ($typeAnswer == 1) {
                $saveAnswer = $answerModel->addAnswer($newQuestionId, $answers);
                if (isset($saveAnswer['error'])) {
                    throw new \Exception($saveAnswer['error']);
                }
            }
            return ['message' => 'Add question success'];
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage()
            ];
        }
    }


    function getQuestionByIdQuiz($idQuizCMS)
    {
        $sql = "select que.id as idQuestion,
        que.questionName,
        que.typeAnswers as type,
        que.note,
        ans.id as idAnswer,
        ans.answerName,
        ans.isCorrect
        from questionsCMS as que
        inner join answersCMS as ans on ans.idQuestionsCMS = que.id
        where que.idQuizzesCMS = $idQuizCMS";
        $stmt = $this->conn->query($sql);
        $questions = $stmt->fetch_all(MYSQLI_ASSOC);

        $result = [];

        foreach ($questions as $item) {

            $idQuestion = $item['idQuestion'];

            // Kiểm tra xem câu hỏi đã tồn tại trong kết quả chưa
            if (!isset($result[$idQuestion])) {
                $result[$idQuestion] = [
                    'id' => $idQuestion,
                    'questionName' => $item['questionName'],
                    'typeAnswers' => $item['type'],
                    'answersCMS' => [],
                    'note' => $item['note'] // Thêm trường note vào kết quả
                ];
            }

            // Thêm đáp án vào câu hỏi
            if ($item['type'] == 0) {
                // Nếu type = 0, thêm mảng 2 chiều
                $result[$idQuestion]['answersCMS'][] = [
                    'id' => $item['idAnswer'],
                    'isCorrect' => $item['isCorrect'] == 1 ? true : false,
                    'answerName' => $item['answerName']
                ];
            } else {
                // Nếu type = 1, thêm đáp án duy nhất
                $result[$idQuestion]['answersCMS'] = [
                    'id' => $item['idAnswer'],
                    'isCorrect' => $item['isCorrect'] == 1 ? true : false,
                    'answerName' => $item['answerName']
                ];
            }
        }

        // Chuyển đổi mảng kết quả thành mảng chỉ số (index array)
        $result = array_values($result);

        return $result;
    }

    function updateQuestion($idQuiz, $arrQuestion, $arrDel)
    {
        $questionModel = new QuestionCMSModel();
        $this->deleteQuestion($arrDel);

        $arrIdQuestionUpdate = [];
        $updateQuestionName = [];
        $arrIdAnswerUpdate = [];
        $updateAnswer = [
            'answerName' => [],
            'isCorrect' => []
        ];

        $arridAnswerDelete = [];

        for ($i = 0; $i < count($arrQuestion); $i++) {
            $question = $arrQuestion[$i];
            $idQuestion = $question['id'];
            $action = $question['action'];


            if ($action === null) {
                continue;
            }

            if ($action === 'create') {
                $question['answers'] = $question['answersCMS'];
                $check = $questionModel->addQuestion($idQuiz, $question);
                if (isset($check['error'])) {
                    throw new \Exception($check['error']);
                }
                continue;
            }

            if($action === 'update'){
                $note = $question['note']; // note có thể null 
                $noteValue = "NULL";
                if ($note !== null && trim($note) !== '') {
                    $noteEscaped = $this->conn->real_escape_string($note);
                    $noteValue = "'$noteEscaped'";
                }
                $type = $question['typeAnswers'];
                $id = $question['id'];
                $questionName = $this->conn->real_escape_string($question['questionName']);
                $updateQuestionName[] = "WHEN id = $id THEN '$questionName'";
                $updateNote[] = "WHEN id = $id THEN $noteValue";
                $arrIdQuestionUpdate[] = $id;
                
                $answers = $question['answersCMS'];

                if(isset($question['arridAnswerDelete'])){
                    $arridAnswerDelete = array_merge($arridAnswerDelete, $question['arridAnswerDelete']);
                }

                if($type == 0){
                    for($j = 0; $j < count($answers); $j++){
                        $answer = $answers[$j];
                        $idAnswer = $answer['id'];

                        if($idAnswer === null){
                            $answerModel = new AnswersCMSModel();
                            $check = $answerModel->addAnswer($idQuestion, $answer);
                            if (isset($check['error'])) {
                                throw new \Exception($check['error']);
                            }
                            continue;
                        }

                        $answerName = $this->conn->real_escape_string($answer['answerName']);
                        $isCorrect = $answer['isCorrect'] ? 1 : 0;
                        $updateAnswer['answerName'][] = "WHEN id = $idAnswer THEN '$answerName'";
                        $updateAnswer['isCorrect'][] = "WHEN id = $idAnswer THEN $isCorrect";
                        $arrIdAnswerUpdate[] = $idAnswer;
                    }
                } else if ($type == 1){
                    $answer = $answers;
                    $idAnswer = $answer['id'];
                    $answerName = $this->conn->real_escape_string($answer['answerName']);
                    $isCorrect = $answer['isCorrect'] ? 1 : 0;
                    $updateAnswer['answerName'][] = "WHEN id = $idAnswer THEN '$answerName'";
                    $updateAnswer['isCorrect'][] = "WHEN id = $idAnswer THEN $isCorrect";
                    $arrIdAnswerUpdate[] = $idAnswer;
                }
            }
        }

        if(count($arrIdQuestionUpdate) > 0){
            $sql = "UPDATE $this->table SET questionName = CASE " . implode(' ', $updateQuestionName) . " END, note = CASE ". implode(' ', $updateNote) . " END WHERE id IN (" . implode(',', $arrIdQuestionUpdate) . ")";
            
            $check = $this->conn->query($sql);
            if (!$check) {
                throw new \Exception("Failed to update question: " . $this->conn->error);
            }
        }

        if(count($arrIdAnswerUpdate) > 0){
            $sql = "UPDATE answersCMS SET answerName = CASE " . implode(' ', $updateAnswer['answerName']) . " END, isCorrect = CASE " . implode(' ', $updateAnswer['isCorrect']) . " END WHERE id IN (" . implode(',', $arrIdAnswerUpdate) . ")";
            
            $check = $this->conn->query($sql);
            if (!$check) {
                throw new \Exception("Failed to update answer: " . $this->conn->error);
            }
        }

        // Xóa đáp án
        $answerModel = new AnswersCMSModel();
        $answerModel->deleteAnswer($arridAnswerDelete);
    }

    function deleteQuestion($arrIdQuestion)
    {
        if (count($arrIdQuestion) == 0) {
            return;
        }
        $sql = "DELETE FROM $this->table WHERE id IN (" . implode(',', $arrIdQuestion) . ")";
        $check = $this->conn->query($sql);
        if (!$check) {
            throw new \Exception("Failed to delete question: " . $this->conn->error);
        }
    }
}
