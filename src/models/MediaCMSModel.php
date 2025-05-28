<?php

namespace Models;

class MediaCMSModel
{
    private $table = 'mediaCMS';
    private $conn = null;
    private $audioPath = 'public/media/';
    function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function addMedia($idQuizCMS, $dataRow)
    {
        $title = $dataRow['title'];
        $type = $dataRow['type'];
        $content = $dataRow['content'];

        try {
            if ($type == 0) {
                $saveMedia = $this->addAudioByBase64($content);
                if (isset($saveMedia['error'])) {
                    throw new \Exception($saveMedia['error']);
                } else {
                    $content = $saveMedia;
                }
            }

            $title = $this->conn->real_escape_string($title);
            $content = $this->conn->real_escape_string($content);

            $sql = "INSERT INTO $this->table (title, idQuizzesCMS, type, content) VALUES ('$title', $idQuizCMS, $type, '$content')";
            $this->conn->query($sql);
            return $this->audioPath . $content;
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    function getMediaByIdQuiz($idQuizCMS)
    {
        $sql = "SELECT * FROM $this->table WHERE idQuizzesCMS = $idQuizCMS";
        $result = $this->conn->query($sql);
        $data = null;
        if ($result->num_rows > 0) {
            $data = $result->fetch_assoc();
        }
        return $data;
    }

    function updateMedia($idQuizCMS, $dataRow)
    {

        if ($dataRow === null) {
            $this->delMediaByIdQuiz($idQuizCMS);
            return true;
        }

        $action = $dataRow['action'];

        if ($action === null) {
            return true;
        }

        if ($action === 'create') {
            $this->delMediaByIdQuiz($idQuizCMS);
            $check = $this->addMedia($idQuizCMS, $dataRow);
            if (isset($check['error'])) {
                throw new \Exception($check['error']);
            }
            return true;
        }

        if ($dataRow['action'] == 'update') {
            $id = $dataRow['id'];
            $title = $this->conn->real_escape_string($dataRow['title']);
            $type = $dataRow['type'];
            $content = $dataRow['content'];

            if ($type == 0) {
                if ($content !== null) {
                    $row = $this->getMediaByIdQuiz($idQuizCMS);
                    $oldContent = $row['content'];
                    $fileName = $this->addAudioByBase64($content);
                    if (isset($fileName['error'])) {
                        throw new \Exception($fileName['error']);
                    }
                    $sql = "UPDATE $this->table SET title = '$title', content = '$fileName' WHERE id = $id";
                    $check = $this->conn->query($sql);
                    if (!$check) {
                        throw new \Exception("Failed to update media: " . $this->conn->error);
                    }
                    $this->unlinkAudio($oldContent);
                    return true;
                }
                $sql = "UPDATE $this->table SET title = '$title' WHERE id = $id";
                $check = $this->conn->query($sql);
                if (!$check) {
                    throw new \Exception("Failed to update media: " . $this->conn->error);
                }
                return true;
            }

            $content = $this->conn->real_escape_string($content);

            $sql = "UPDATE $this->table SET title = '$title', content = '$content' WHERE id = $id";
            $check = $this->conn->query($sql);
            if (!$check) {
                throw new \Exception("Failed to update media: " . $this->conn->error);
            }
            return true;
        }
    }

    function delMediaByIdQuiz($idQuizCMS)
    {
        $row = $this->getMediaByIdQuiz($idQuizCMS);
        if ($row !== null) {
            $id = $row['id'];
            $type = $row['type'];
            $this->deleteMedia($id);
            if ($type == 0) {
                $this->unlinkAudio($row['content']);
            }
        }
    }

    function deleteMedia($idMedia)
    {
        $sql = "DELETE FROM $this->table WHERE id = $idMedia";
        $check = $this->conn->query($sql);
        if (!$check) {
            throw new \Exception("Failed to delete media: " . $this->conn->error);
        }
    }

    private function addAudioByBase64($base64)
    {
        try {
            // Kiểm tra và tách chuỗi Base64 nếu có tiền tố 'data:audio/...'
            if (preg_match('/^data:audio\/(\w+);base64,/', $base64, $type)) {
                // Tách bỏ phần tiền tố để lấy dữ liệu Base64 thực sự
                $base64 = substr($base64, strpos($base64, ',') + 1);
                $fileExtension = strtolower($type[1]); // Lấy loại tệp: mp3, wav, v.v.
                // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                if ($fileExtension === 'mpeg' || $fileExtension === 'mp3') {
                    $fileExtension = 'mp3';
                } else {
                    // Nếu kiểu không hợp lệ, trả về lỗi
                    throw new \Exception('Unsupported audio format');
                }
                $audioData = base64_decode($base64);
                // Kiểm tra xem quá trình giải mã có thành công không
                if ($audioData === false) {
                    return ['error' => 'fail']; // Nếu giải mã thất bại, trả về null
                }
                // Tạo tên tệp ngẫu nhiên, ví dụ: audio_uniqid.mp3
                $fileName = "audio_" . uniqid() . '.' . $fileExtension;
                // Đường dẫn thư mục lưu tệp (có thể thay đổi tùy theo cấu trúc dự án của bạn)
                $filePath = $this->audioPath . $fileName;
                // Kiểm tra xem thư mục có tồn tại không, nếu không thì tạo thư mục
                if (!is_dir($this->audioPath)) {
                    mkdir($this->audioPath, 0777, true);
                }

                // Kiểm tra không gian đĩa trước khi lưu
                $freeSpace = disk_free_space(dirname($filePath));
                $audioSize = strlen($audioData);

                if ($freeSpace < $audioSize) {
                    return ['error' => 'Not enough disk space'];
                }

                // Tắt cảnh báo và lưu dữ liệu nhị phân vào tệp
                if (@file_put_contents($filePath, $audioData) === false) {
                    // Nếu có lỗi trong khi lưu tệp, trả về null
                    return ['error' => 'fail'];
                }

                return $fileName;
            } else {
                // Nếu chuỗi Base64 không hợp lệ, trả về null
                return ['error' => 'Not a valid audio file'];
            }
        } catch (\Exception $e) {
            // Nếu có lỗi, trả về null
            return ['error' => $e->getMessage()];
        }
    }

    function unlinkAudio($fileName)
    {
        $filePath = $this->audioPath . $fileName;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
}
