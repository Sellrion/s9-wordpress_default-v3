            <div id="mc-header">
                <div class="menulogo"<?php if(is_home()): ?> style="display: none;"<?php endif; ?>><a href="<?php echo site_url(); ?>" title="Вернуться на главную страницу"><img src="<?php echo LAYOUTURI_RELATIVE . '/base/graphs/s9logo-small.png'; ?>" alt=""></a></div>
                <div id="visually-impaired-switch">
                    <a href="/?layout=visually-impaired" title="Версия для слабовидящих" rel="nofollow">Версия для слабовидящих</a>
                    <a href="/?layout=visually-impaired" title="Версия для слабовидящих" rel="nofollow">
                        <svg version="1.1" id="visually-impaired_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1542 843" style="enable-background:new 0 0 1542 843;" xml:space="preserve" height="20px"><g class="svg-fill"><path d="M963.6,401.6c1.1,10.3,5.9,71.6-32.1,128.3c-39.9,59.5-117.1,99-196.4,84.2c-65.4-12.2-107-55.5-121.9-76.2c-53.7-74.2-33.5-159.6-30.4-172.8c49.3,8,97.9,17.3,147.1,25.3c-31.8-35.2-63-71.9-94.8-107.1c9.6-8.7,75-65.6,164.8-52.3c57.9,8.6,94.9,41.8,105.7,52.3C918.6,296,957,336.5,963.6,401.6z"/><path d="M1418.9,291.4c50.1,47.8,90.5,94.2,119,131.5c-38.1,49.6-90.7,106.5-156.5,164.1c-101.3,88.6-193,137.2-225.1,153.5c-46.9,23.8-115.8,58.2-213.7,79.6c-63.9,14-117.1,17.4-150.1,18.2c-29,0.7-119.2,1.4-231.9-28.4C542.8,805,466,784.1,373,735.8c-82.1-42.6-137.3-86-175.1-116c-54.6-43.3-125.6-107-198-195.5c41.2-53.5,102.1-123.1,186.6-192.1c38.3-31.3,102-82.7,196.7-129.6c57-28.2,168.1-81.9,324-93.2c34.5-2.5,153.9-8.9,299,34.1c108.5,32.2,183.8,77.9,230.8,106.9C1270,170.7,1340.9,216.9,1418.9,291.4z M1398.5,423.2c-34.9-37.5-78.2-78.3-130.7-118.2c-92.1-69.9-180.8-116.5-251.6-144c24,22.2,76,80.1,100.4,169c6.2,22.5,26.8,106.1-5.7,205.8c-25.8,79.2-70.5,126-94.7,148.9c54.5-20.8,119-48.2,189.1-94.3C1291,533.8,1354.3,472.8,1398.5,423.2z M1057.4,483.5c21.6-100.8-20.1-181-35.2-206.9c-14.4-24.6-49.4-76.2-116-111.4c-73.5-38.9-142.9-35.6-173.9-31.8C645.1,143.8,590,192,570.2,209.6c-14.8-16.3-30.2-32.7-45-49c-66.1,25.5-151.9,64-239.7,129.6C224.9,335.5,177,382,140,423.2c50.3,54.5,121.9,120.4,218.3,179.6c59.2,36.4,115.5,62.6,164.9,81.8c-18.8-18.3-43.8-46.3-65.9-85.3c-35.1-61.8-43.4-116.7-45.5-131.9c-7.3-54.4,1.8-99.9,9-129.6c22.7,3.8,43.3,7.6,66.1,11.4c-7.1,26.3-16.8,75.8-4.5,135.3c4.5,22.1,24.7,106.9,104.6,169.4c97.2,76.1,207.6,60.3,228.5,56.8c91.7-15.1,148.5-69.2,167.1-88.7C1039.4,562.5,1054.5,497.1,1057.4,483.5z"/></g></svg>
                    </a>
                </div>
                <div id="mc-header-phone">
                    <span class="mc-header-phone"><a href="/contacts" title="Контакты">(3435) 33-55-69</a></span><br />
                    <span style="font-size: 12px;">Пн - Сб с 8:00 до 17:00</span>
                </div>
            </div>
            <?php if(is_home()): ?>
                <div id="dashboard-container"></div>
            <?php endif; ?>
            <nav id="breadcrumbs"<?php if(is_home()): ?> style="display: none;"<?php endif; ?>>
                  <?php
                      $breadcrumbs = buildBreadcrumbs();

                      echo '<a href="' . site_url() . '" title="Вернуться на главную страницу"><strong>' . get_bloginfo('name') . '</strong></a>';

                      $bcount = count($breadcrumbs);
                      for($i = 0; $i < $bcount; $i++){
                          echo '<span class="breadcrumbs-arrow"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 26 30" enable-background="new 0 0 26 30" xml:space="preserve"><polygon class="svg-fill" points="25,15 12,29 1,29 14,15 1,1 11.9,1 "/></svg></span>';
                          echo '<h2><a href="' . $breadcrumbs[$i]['url'] . '" title="Вернуться на страницу &quot;' . $breadcrumbs[$i]['title'] . '&quot;">' . $breadcrumbs[$i]['title'] . '</a></h2>';
                      }
                  ?>
            </nav>
            <?php if(is_home()): ?>
                <div class="stupidnav"><a href="javascript:void(0);" onClick="return showHotline_Information();" title="Телефоны горячей линии">Горячая линия</a>&nbsp;|&nbsp;<a href="/faq" title="">Часто задаваемые вопросы</a></div>
            <?php endif; ?>