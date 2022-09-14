        <div id="content_3-layer-container" style="display: none;">
            <div id="content_3-layer">
                <div id="searchscreen">
                    <form action="<?php echo home_url(); ?>" method="get">
                        <input id="s" type="text" name="s" class="inputfield" placeholder="Что нужно найти?" />
                    </form>
                </div>
                <div id="tagcloud">
                    <?php
                        global $TAGCLOUD_MINFONTSIZE, $TAGCLOUD_MAXFONTSIZE;
                        wp_tag_cloud(
                                        array(
                                                'smallest'   => $TAGCLOUD_MINFONTSIZE,
                                                'largest'    => $TAGCLOUD_MAXFONTSIZE,
                                                'unit'       => 'px',
                                                'number'     => 18,
                                                'format'     => 'flat',
                                                'separator'  => "\n",
                                                'orderby'    => 'name',
                                                'order'      => 'RAND',
                                                'exclude'    => '',
                                                'include'    => '',
                                                'link'       => 'view',
                                                'taxonomy'   => 'post_tag',
                                                'post_type'  => '',
                                                'echo'       => true,
                                                'show_count' => 0,
                                            )  
                                    ); 
                    ?>
                </div>
            </div>
        </div>