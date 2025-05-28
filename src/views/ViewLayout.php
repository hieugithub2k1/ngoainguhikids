<?php

namespace Views;

use Cores\Authentication;

class ViewLayout extends ViewsBase
{
    private $userName = '';
    private $roleName = 'Error No Role';
    private $role = 0;
    private $idParentPage;
    private $idChildPage = null;
    private $linkImg = null;
    public $templatehtml = '';

    function __construct()
    {
        $this->role = Authentication::getRole();
        $this->userName = Authentication::getFullName();
        $this->linkImg = Authentication::getAvatar();
        $this->setRoleName();
        $this->addCSS('public/css/style1.css');
        if ($this->role == 1 || $this->role == 2) {
            $this->addJS('public/js/Admin/mainAdmin.js');
        } else {
            $this->addJS('public/js/Users/mainUsers.js');
        }
    }

    function setTitle($title)
    {
        $this->title = $title;
    }

    function setActivePage($idParentPage, $idChildPage = null)
    {
        $this->idParentPage = $idParentPage;
        $this->idChildPage = $idChildPage;
    }

    function setLinkImg($linkImg)
    {
        if ($linkImg) {
            $this->linkImg = $linkImg;
        }
    }

    function addCSS($css)
    {
        $this->arrCSS[] = $css;
    }

    function addJS($js)
    {
        $this->arrJS[] = $js;
    }

    function addNoModuleJS($js)
    {
        $this->arrNoModuleJS[] = $js;
    }


    // Duoiws đây là phần mặc định của layout, không cần gọi ra

    private function menuStudent()
    {
        return [
            [
                'id' => 1,
                'name' => 'Dashboard',
                'svg' => file_get_contents("public/svgs/dashboard.svg"),
                'link' => '',
                'submenu' => null
            ],
            [
                'id' => 4,
                'name' => 'IPA',
                'svg' => file_get_contents("public/svgs/ipa.svg"),
                'link' => 'ipa',
                'submenu' => null
            ],
            [
                'id' => 2,
                'name' => 'Classes',
                'svg' => file_get_contents("public/svgs/class.svg"),
                'link' => 'classes',
                'submenu' => [
                    [
                        'id' => 2,
                        'name' => 'Find Classes',
                        'link' => 'classes'
                    ],
                    [
                        'id' => 2.1,
                        'name' => 'My Classes',
                        'link' => 'classes/myclass'
                    ]
                ]
            ],
            [
                'id' => 5,
                'name' => 'Quizzes',
                'svg' => file_get_contents("public/svgs/quiz.svg"),
                'link' => 'quizzes',
                'submenu' => null
            ],
            [
                'id' => 3,
                'name' => 'My Profile',
                'svg' => file_get_contents("public/svgs/person.svg"),
                'link' => 'profile',
                'submenu' => null
            ],
            [
                'id' => 15,
                'name' => 'Log Out',
                'svg' => file_get_contents("public/svgs/logout.svg"),
                'link' => 'logout',
                'submenu' => null
            ]
        ];
    }

    private function menuAdmin()
    {
        return [
            [
                'id' => 1,
                'name' => 'Dashboard',
                'svg' => file_get_contents("public/svgs/dashboard.svg"),
                'link' => 'admin/',
                'submenu' => null
            ],
            [
                'id' => 6,
                'name' => 'Courses',
                'svg' => file_get_contents("public/svgs/course.svg"),
                'link' => 'admin/courses',
                'submenu' => null
            ],
            [
                'id' => 7,
                'name' => 'Lessons',
                'svg' => file_get_contents("public/svgs/lesson.svg"),
                'link' => 'admin/lessons',
                'submenu' => null
            ],
            [
                'id' => 9,
                'name' => 'Quizzes',
                'svg' => file_get_contents("public/svgs/quiz.svg"),
                'link' => 'admin/quizzes',
                'submenu' => [
                    [
                        'id' => 9,
                        'name' => 'Quizzes',
                        'link' => 'admin/quizzes'
                    ],
                    [
                        'id' => 9.1,
                        'name' => 'Add Quiz',
                        'link' => 'admin/quizzes/add'
                    ]
                ]
            ],
            [
                'id' => 2,
                'name' => 'Classes',
                'svg' => file_get_contents("public/svgs/class.svg"),
                'link' => 'admin/classes',
                'submenu' => [
                    [
                        'id' => 2,
                        'name' => 'Classes',
                        'link' => 'admin/classes'
                    ],
                    [
                        'id' => 2.1,
                        'name' => 'Add Class',
                        'link' => 'admin/classes/addClassAdmin'
                    ],
                    [
                        'id' => 2.3,
                        'name' => 'Access Class',
                        'link' => 'admin/accessclass'
                    ]
                ]
            ],
            // [
            //     'id' => 10,
            //     'name' => 'Students',
            //     'svg' => file_get_contents("public/svgs/students.svg"),
            //     'link' => 'admin/students',
            //     'submenu' => null
            // ],
            [
                'id' => 8,
                'name' => 'Accounts',
                'svg' => file_get_contents("public/svgs/accounts.svg"),
                'link' => 'admin/accounts',
                'submenu' => null
            ],
            [
                'id' => 4,
                'name' => 'My Profile',
                'svg' => file_get_contents("public/svgs/person.svg"),
                'link' => 'admin/Profile',
                'submenu' => null
            ],
            [
                'id' => 15,
                'name' => 'Log Out',
                'svg' => file_get_contents("public/svgs/logout.svg"),
                'link' => 'logout',
                'submenu' => null
            ]
        ];
    }

    private function menuTeacher()
    {
        $menuAdmin = $this->menuAdmin();
        foreach ($menuAdmin as $key => $menu) {
            if ($menu['id'] == 8) {
                unset($menuAdmin[$key]);
            }
        }
        return $menuAdmin;
    }

    // 0: student; 1: teacher; 2: admin
    private function renderMenu()
    {
        $menus = [];
        if ($this->role == 0) {
            $menus = $this->menuStudent();
        } else if ($this->role == 1) {
            $menus = $this->menuTeacher();
        } else if ($this->role == 2) {
            $menus = $this->menuAdmin();
        } else {
            $menus = [];
        }

        foreach ($menus as $key => $menu) {
            $submenu = $menu['submenu'];
?>
            <li class="<?= $this->idParentPage == $menu['id'] ? 'active' : '' ?> <?= $submenu == null ? '' : 'hassubmenu' ?>">
                <?php if ($submenu): ?>
                    <input type="checkbox" hidden class="list-ul-input-check-submenu" id="submenu_<?= $key ?>" <?= $this->idParentPage == $menu['id'] && $this->idChildPage != null ? 'checked' : '' ?>>
                <?php endif; ?>
                <div class="list-ul-primary-menu">

                    <?php if ($submenu): ?>
                            <label for="submenu_<?= $key ?>"  class="<?= $this->idParentPage == $menu['id'] && $this->idChildPage == null ? 'active' : '' ?>">
                                <span> <?= $menu['svg'] ?> </span>
                                <span><?= $menu['name'] ?></span>
                            </label>
                    <?php else : ?>
                        <a class="<?= $this->idParentPage == $menu['id'] && $this->idChildPage == null ? 'active' : '' ?>" <?= $submenu ? 'onclick="return false"' : '' ?> href="<?= $menu['link'] ?>" id="<?= $menu['id'] === 15 ? 'mblogout' : '' ?>">
                            <span> <?= $menu['svg'] ?> </span>
                            <span><?= $menu['name'] ?></span>
                        </a>
                    <?php endif; ?>

                    <?php if ($submenu): ?>
                        <label for="submenu_<?= $key ?>" class="label-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </label>
                    <?php endif; ?>
                </div>
                <?php if ($submenu): ?>
                    <div class="list-ul-submenu">
                        <ul class="list-ul-submenu-ul">
                            <?php foreach ($submenu as $item): ?>
                                <li><a class="<?= $this->idChildPage != null && $this->idChildPage == $item['id'] ? 'active' : '' ?>" href="<?= $item['link'] ?>"> <?= $item['name'] ?> </a></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
            </li>
        <?php
        }
    }

    function renderModuleJS()
    {
        ?>
        <script type="module" src="public/js/allmodule.js"></script>
    <?php
    }


    private function setRoleName()
    {
        if ($this->role == 0) {
            $this->roleName = 'Student';
        } else if ($this->role == 1) {
            $this->roleName = 'Teacher';
        } else if ($this->role == 2) {
            $this->roleName = 'Admin';
        }
    }

    function renderBody()
    {
    ?>

        <header class="w-full h-[50px] fixed top-0 left-0 right-0 border-b-[1px] bg-white z-[2]">
            <div class="max-w-[100%] mx-auto h-full px-[10px] lg:px-[25px]">
                <div class="flex h-full justify-between">
                    <a href="" class="py-[2px]"><img class="h-full" src="public/img/LogoMrBien-_banner@2x-1.png" alt=""></a>
                    <label for="check-notif" class="header_notif flex items-center" id="notification">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                        <div class="header_quantity-notif"> <span id="notifCount">0</span></div>
                        <input type="checkbox" class="check-notif" id="check-notif" hidden>
                        <label for="check-notif" class="overllay-notif"></label>
                        <div class="header_notif_contents">
                            <ul id="notifList">

                            </ul>
                        </div>
                    </label>
                </div>
            </div>
        </header>

        <div class="mt-[50px] max-w-[100%] mx-auto">
            <div class="flex flex-col md:flex-row min-h-[calc(100dvh-50px)] md:min-h-max">
                <aside
                    class="aside header_aside lg:w-[250px] md:w-[200px] p-[10px] md:p-[0px] flex justify-between items-center md:items-stretch">
                    <div class="md:w-full">
                        <div class="flex md:flex-col justify-center items-center gap-[15px] md:gap-0 md:mt-[15px]">
                            <img class="w-[47px] md:w-[128px] aspect-square object-cover overflow-hidden rounded-[50%]" src="<?= $this->linkImg ?>" alt="">
                            <div class="flex flex-col justify-center items-center">
                                <h3 class="font-bold md:mt-[5px]" id="userNameGlobal"><?= $this->userName ?></h3>
                                <span class="text-[12px]"> <?= $this->roleName ?> </span>
                            </div>
                        </div>
                        <input class="check-menu" id="check-menu" type="checkbox" hidden>
                        <label for="check-menu" class="overllay"></label>
                        <div class="menu">
                            <label for="check-menu" class="md:hidden close">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="size-8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </label>
                            <p class="block md:hidden text-center m-0 p-[8px] text-[20px] font-medium">MENU</p>
                            <ul class="list-ul"> <?= $this->renderMenu() ?> </ul>
                        </div>
                    </div>
                    <label for="check-menu" class="block md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-8">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </label>
                </aside>
                <main class="main flex-1 py-0 px-[0px] md:p-[0px]">
                    <div id="root"> <?= $this->templatehtml ?> </div>
                </main>
            </div>
        </div>

<?Php

    }
}
