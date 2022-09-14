<?php get_header(); ?>

	<body onResize="onBodyResize();">
		<div id="content_1-layer-container">
            <div id="sidebar_10-layer_placeholder"></div>
            <?php locate_template('content_1-layer.php', true, true); ?>
		</div>
		<div id="content_2-layer-container" style="display: none;">
            <?php locate_template('content_2-layer_header.php', true, true); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <h3><?php the_title(); ?></h3>
                <br />
                <div class="pagecontent">
                    <?php the_content(); ?>
                </div>
                <?php
                $children = wp_list_pages(array(
                                                'depth' => 1,
                                                'child_of' => get_the_ID(),
                                                'title_li' => '',
                                                 'echo' => 0,
                                                 'sort_colums' => 'menu_order',
                                                 'link_before' => '<h4>',
                                                 'link_after' => '</h4>'
                                                 )
                                        );
                if($children) echo '<div class="page-subnav"><ul>' . $children . '</ul>';
                ?>
            </article>
            <?php 
                if($post->post_parent == 1686){
                    $children = wp_list_pages(array(
                                                    'depth' => 1,
                                                    'child_of' => 1686,
                                                    'title_li' => '',
                                                    'echo' => 0,
                                                    'sort_colums' => 'menu_order'
                                                    )
                                            );
                    echo '<br /><br /><ul class="schoolinfo-navlinks">' . $children . '</ul>';
                }
            ?>
            <br /><br />
        </div>
        <?php locate_template('content_3-layer.php', true, true); ?>
        
        <?php locate_template('content_4-layer.php', true, true); ?>
        
        <?php locate_template('content_5-layer.php', true, true); ?>
        
        <?php get_sidebar(); ?>
            
		<?php locate_template('mainmenu.php', true, true); ?>
	        
<?php get_footer(); ?>