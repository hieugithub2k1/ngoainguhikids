<?php

namespace Views;

class ViewsBase
{
    protected $title = "Document";
    protected $arrCSS = [];
    protected $arrJS = [];
    protected $arrNoModuleJS = [];

    protected function renderCSS(){
        foreach($this->arrCSS as $css){
            ?>
            <link rel="stylesheet" href="<?= $css ?>">
            <?php
        }
    }

    protected function renderModuleJS(){

    }

    protected function renderJS(){
        foreach($this->arrJS as $js){
            ?>
            <script type="module" src="<?= $js ?>"></script>
            <?php
        }
    }

    protected function renderNoModuleJS(){
        foreach($this->arrNoModuleJS as $js){
            ?>
            <script src="<?= $js ?>"></script>
            <?php
        }
    }

    function renderBody(){
        
    }

    function render()
    {
?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <base href="<?= WEB_ROOT ?>">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
            <title><?= $this->title ?></title>
            <meta name="description" content="Join fun and engaging English quizzes on elearning.anhngumb.com, where you can enhance your language skills with diverse and interesting questions. Suitable for learners at all levels, from beginner to advanced.">
            <!-- Facebook Meta Tags -->
            <meta property="og:url" content="https://elearning.anhngumb.com/">
            <meta property="og:type" content="website">
            <meta property="og:title" content="English Quiz - Improve Your Language Skills | elearning.anhngumb.com">
            <meta property="og:description" content="Join fun and engaging English quizzes on elearning.anhngumb.com, where you can enhance your language skills with diverse and interesting questions. Suitable for learners at all levels, from beginner to advanced.">
            <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/4fc692b2-946f-4d98-8d68-25f03bab01e4.jpg?token=FKYVeB8c4tDwMDtl22btk6MHn0G3VufHwqTCnQ4nQs8&height=630&width=1200&expires=33266643748">
            <!-- Twitter Meta Tags -->
            <meta name="twitter:card" content="summary_large_image">
            <meta property="twitter:domain" content="elearning.anhngumb.com">
            <meta property="twitter:url" content="https://elearning.anhngumb.com/">
            <meta name="twitter:title" content="English Quiz - Improve Your Language Skills | elearning.anhngumb.com">
            <meta name="twitter:description" content="Join fun and engaging English quizzes on elearning.anhngumb.com, where you can enhance your language skills with diverse and interesting questions. Suitable for learners at all levels, from beginner to advanced.">
            <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/4fc692b2-946f-4d98-8d68-25f03bab01e4.jpg?token=FKYVeB8c4tDwMDtl22btk6MHn0G3VufHwqTCnQ4nQs8&height=630&width=1200&expires=33266643748">

            <link rel="icon" href="public/img/cropped-LogoMrBien_512-300x300.png">
            <?= $this->renderCSS() ?>
            <?= $this->renderModuleJS() ?>
        </head>
        <body>
            <?= $this->renderBody() ?>
            <?= $this->renderJS() ?>
            <?= $this->renderNoModuleJS() ?>
        </body>
        </html>
<?php
    }
}

?>