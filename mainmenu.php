        <div id="mainmenu-button-items" class="menucanvas mainmenu-controls">
            <div class="menuheader">
                <div class="menulogo"><img src="<?php echo LAYOUTURI_RELATIVE . '/base/graphs/s9logo-small.webp'; ?>" alt="" /></div>
                <div class="menu-schoolname"><h1><?php echo SCHOOL_FULLNAME; ?></h1></div>
                <div class="menuicons">
                    <a href="https://edu.gov.ru/" title="Министерство просвещения Российской Федерации" target="_blank">
                        <img src="<?php echo LAYOUTURI_RELATIVE . '/base/graphs/edugovru.webp'; ?>" alt="" /><br />
                        <span style="font-size: var(--fontsize-small);">Министерство просвещения Российской Федерации</span>
                    </a>
                </div>
                <div class="menuicons" style="margin-left: 10px;">
                    <a href="https://minobraz.egov66.ru/" title="Министерство образования Свердловской области" target="_blank">
                        <img src="<?php echo LAYOUTURI_RELATIVE . '/base/graphs/minobraz.webp'; ?>" alt="" /><br />
                        <span style="font-size: var(--fontsize-small);">Министерство образования Свердловской области</span>
                    </a>
                </div>
            </div>
            <div class="mainmenu-items">
                <div class="menu-column">
                    <span class="mainmenu-header">Документы</span><br /><br />
                    <?php wp_nav_menu(array(
                                            'menu' => 'official', 
                                            'container' => 'nav', 
                                            'container_class' => 'menu-container'
                                          )
                                    ); 
                    ?>
                </div>
                <div class="menu-column">
                    <span class="mainmenu-header">О школе</span><br /><br />
                    <?php wp_nav_menu(array(
                                            'menu' => 'schoolataglance', 
                                            'container' => 'nav', 
                                            'container_class' => 'menu-container'
                                          )
                                    ); 
                    ?>
                </div>
                <div class="menu-column">
                    <span class="mainmenu-header">Педагогам, родителям, ученикам</span><br /><br />
                    <?php wp_nav_menu(array(
                                            'menu' => 'for_participants', 
                                            'container' => 'nav', 
                                            'container_class' => 'menu-container'
                                          )
                                    ); 
                    ?>
                </div>
            </div>
            <div class="mainmenu-items_lowres">
                <div class="menu-column_lowres">
                    <span class="mainmenu-header">Документы</span><br /><br />
                    <?php wp_nav_menu(array(
                                            'menu' => 'official', 
                                            'container' => 'nav', 
                                            'container_class' => 'menu-container', 
                                            'depth' => 1
                                          )
                                    ); 
                    ?>
                    <br /><br />
                    <span class="mainmenu-header">О школе</span><br /><br />
                    <?php wp_nav_menu(array(
                                            'menu' => 'schoolataglance', 
                                            'container' => 'nav', 
                                            'container_class' => 'menu-container', 
                                            'depth' => 1
                                          )
                                    ); 
                    ?>
                    <br /><br />
                    <span class="mainmenu-header">Педагогам, родителям, ученикам</span><br /><br />
                    <?php wp_nav_menu(array(
                                            'menu' => 'for_participants', 
                                            'container' => 'nav', 
                                            'container_class' => 'menu-container', 
                                            'depth' => 1
                                          )
                                    ); 
                    ?>
                </div>
            </div>
            <div class="mainmenu-addition-block">
                <span class="mainmenu-header">Баннеры и полезные ссылки</span><br /><br />
                <?php wp_nav_menu(array(
                                        'menu' => 'banners', 
                                        'container' => 'nav', 
                                        'container_class' => 'menu-container'
                                        )
                                ); 
                ?>
                <a href="/faq/helplines/" title="Телефоны доверия">Телефоны доверия</a>
            </div>
            <div class="mainmenu-addition-block">
                <span class="mainmenu-header">&copy; 1935-<?php echo date("Y"); ?> <?php echo SCHOOL_SHORTNAME; ?></span><br /><br />
                <strong>Внимание!</strong> Использование материалов сайта, кроме материалов, подлежащих обязательному размещению на официальном сайте МАОУ СОШ №9, возможно только с письменного разрешения администрации <?php echo SCHOOL_SHORTNAME; ?>. В противном случае любая перепечатка материалов сайта (даже с установленной ссылкой на оригинал) является нарушением законодательства Российской Федераци об авторских и смежных правах и может повлечь за собой судебное преследование в соответствии с действующим законодательством Российской Федерации. (<a href="http://school9-nt.ru/faq/privacy-policy-disclaimer/" title="Политика конфиденциальности">Политика конфиденциальности</a>)<br /><br />
                <strong>Версия сайта:</strong> <?php echo SITEVERSION; ?><br />
                <strong>Работает на:</strong> <a href="http://wordpress.org/" title="" >WordPress</a> <?php echo $wp_version; ?><br />
                <strong>Дизайн, кодирование и поддержка:</strong> <?php echo SCHOOL_SHORTNAME; ?><br />
                <strong>EXEC/SQL/MEM:</strong> <?php timer_stop(1, 3); ?> / <?php echo get_num_queries(); ?> / <?php echo round(memory_get_usage(true) / 1048576, 3); ?>
            </div>
        </div>