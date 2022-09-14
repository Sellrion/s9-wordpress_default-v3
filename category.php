<?php get_header(); ?>

	<body onResize="onBodyResize();">
		<div id="content_1-layer-container">
            <div id="sidebar_10-layer_placeholder"></div>
            <?php locate_template('content_1-layer.php', true, true); ?>
		</div>
		<div id="content_2-layer-container" style="display: none;">
            <?php locate_template('content_2-layer_header.php', true, true); 
            $pagetag = get_queried_object(); ?>
            <?php if(have_posts()): while(have_posts()): ?>
                <?php the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>    
                    <div class="post-leftside">
                        <span class="day"><?php echo get_the_date('d'); ?></span><br />
                        <?php echo get_the_date('F'); ?><br />
                        <?php echo get_the_date('Y'); ?>
                    </div>
                    <div class="post-rightside">
                        <span class="postdate"><?php echo get_the_date('d F Y'); ?><br /></span>
                        <span class="posttitle"><a href="<?php the_permalink(); ?>" title="Просмотреть новость &quot;<?php the_title(); ?>&quot;" rel="bookmark"><h3><?php the_title(); ?></h3></a></span>
                        <br /><br />
                        <?php the_content(__('Читать далее...', 'school9_v3')); ?>
                        <?php $categories_list = wp_get_post_categories($post->ID, ['fields' => 'all']); ?>
                        <ul class="postlegend" style="padding-left:0;">
                            <li class="postcat postcatcolor-<?php echo $categories_list[0]->slug; ?>" onClick="document.location.href='/news/<?php echo $categories_list[0]->slug; ?>/'"><?php echo $categories_list[0]->name; ?></li>
                            <?php 
                                $posttags = wp_get_post_tags($post->ID);
                                for($i = 0; $i < count($posttags); $i++){
                                    if($posttags[$i]->slug != $pagetag->slug):
                            ?>
                            <li class="posttag" onClick="document.location.href='/newstags/<?php echo $posttags[$i]->slug; ?>/'"><?php echo $posttags[$i]->name; ?></li>
                                    <?php endif; ?>
                            <?php } ?>
                        </ul>
                    </div>
                </article>
                <?php endwhile; ?>
                <div class="pagenav"><?php posts_nav_link(' | ', '<< Следующие новости', 'Предыдущие новости >>'); ?>&nbsp;</div>
            <?php else : ?>
                <div class="post" style="text-align:center;">Нет новостей для отображения.</div>
            <?php endif; ?>
        </div>
        <?php locate_template('content_3-layer.php', true, true); ?>
        
        <?php locate_template('content_4-layer.php', true, true); ?>
        
        <?php locate_template('content_5-layer.php', true, true); ?>
        
        <?php get_sidebar(); ?>
            
		<?php locate_template('mainmenu.php', true, true); ?>
	        
<?php get_footer(); ?>