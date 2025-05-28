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
            <meta name="description" content="Take fun and interactive English quizzes on our Hi Kids e-learning platform. Perfect for young learners at all levels to build their English skills in a fun and effective way.">
            <!-- Facebook Meta Tags -->
            <meta property="og:url" content="https://ngoainguhikids.id.vn/">
            <meta property="og:type" content="website">
            <meta property="og:title" content="English Quiz - Improve Your Language Skills | ngoainguhikids.id.vn">
            <meta property="og:description" content="Join fun and engaging English quizzes on ngoainguhikids.id.vn, where you can enhance your language skills with diverse and interesting questions. Suitable for learners at all levels, from beginner to advanced.">
            <meta property="og:image" content="https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/470669823_473782249083659_4770257057640427429_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=nUaDAKd7f9sQ7kNvwGBoQmS&_nc_oc=AdkHVAW5PE3y9t052NR8Hz3udaglYK1Zae3uYTxW2MWWy_sw_GjP06vP0faTici6R7P0gBaYYnPwY7Ll0q-6HSFS&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=JdIsuBfFBKyJPFbau_LxXw&oh=00_AfKKnYxg04bw9RlVhzdlpMT1KGkY-vX3lbIreP-sjOzmdg&oe=683C79C7">

            <!-- Twitter Meta Tags -->
            <meta name="twitter:card" content="summary_large_image">
            <meta property="twitter:domain" content="ngoainguhikids.id.vn">
            <meta property="twitter:url" content="https://elearning.anhngumb.com/">
            <meta name="twitter:title" content="English Quiz - Improve Your Language Skills | ngoainguhikids.id.vn">
            <meta name="twitter:description" content="Join fun and engaging English quizzes at ngoainguhikids.id.vn — the official platform of Hi Kids English Center. Enhance your language skills through a variety of interactive and level-based questions, suitable for learners from beginner to advanced.">
            <meta name="twitter:image" content="https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/470669823_473782249083659_4770257057640427429_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=nUaDAKd7f9sQ7kNvwGBoQmS&_nc_oc=AdkHVAW5PE3y9t052NR8Hz3udaglYK1Zae3uYTxW2MWWy_sw_GjP06vP0faTici6R7P0gBaYYnPwY7Ll0q-6HSFS&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=JdIsuBfFBKyJPFbau_LxXw&oh=00_AfKKnYxg04bw9RlVhzdlpMT1KGkY-vX3lbIreP-sjOzmdg&oe=683C79C7">

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