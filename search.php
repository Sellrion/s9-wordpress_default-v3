<?php get_header(); ?>

	<body onResize="onBodyResize();">
		<div id="content_1-layer-container">
            <div id="sidebar_10-layer_placeholder"></div>
            <?php locate_template('content_1-layer.php', true, true); ?>
		</div>
		<div id="content_2-layer-container" style="display: none;">
            <?php locate_template('content_2-layer_header.php', true, true); ?>
            <div class="type-searchpage">
				<?php if(have_posts()): ?>
                    Результатов: <?php echo $wp_query->found_posts; ?>
                    <div class="searchresults">
                        <?php while(have_posts()): ?>
                            <?php the_post(); ?>
                            <section id="searchresult-<?php the_ID(); ?>" class="searchresult">
                                <?php $permalink = get_permalink(); ?>
                                <h3><a href="<?php echo $permalink; ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h3>
                                <a href="<?php echo $permalink; ?>" title=""><?php echo $permalink; ?></a>
                            </section>
                        <?php endwhile; ?>
                    </div>
                    <div class="pagenav"><?php posts_nav_link(' | ', '<< Предыдущие результаты', 'Еще результаты >>'); ?></div>
                <?php else : ?>
                    <div class="page" style="text-align:center;">По вашему запросу ничего не найдено.</div>
                <?php endif; ?>
            </div>
        </div>
        
        <?php locate_template('content_3-layer.php', true, true); ?>
        
        <?php locate_template('content_4-layer.php', true, true); ?>
        
        <?php locate_template('content_5-layer.php', true, true); ?>
        
        <?php get_sidebar(); ?>
            
		<?php locate_template('mainmenu.php', true, true); ?>
	        
<?php get_footer(); ?>