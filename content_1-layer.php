            <?php if(!is_404()) : ?>
                <div id="content_1-layer">
                    <div id="backgroundMosaic-container">
                        <div id="backgroundMosaic-loading" class="centredboxframe">
                            <div class="loading">Загрузка...<br /><img src="<?php echo LAYOUTURI_RELATIVE . '/base/graphs/loadanimation.gif' ?>" alt="" /></div>
                        </div>
                        <div id="backgroundMosaic" style="display: none;">
                            <?php echo getBackgroundMosaicMap(); ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>