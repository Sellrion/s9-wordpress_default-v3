<?php get_header(); ?>

	<body onResize="onBodyResize();">
		<div id="content_1-layer-container">
            <div id="sidebar_10-layer_placeholder"></div>
            <?php locate_template('content_1-layer.php', true, true); ?>
		</div>
		<div id="content_404-layer-container" style="display: none;"></div>
        
        <?php locate_template('content_3-layer.php', true, true); ?>
        
        <?php locate_template('content_4-layer.php', true, true); ?>
        
        <?php locate_template('content_5-layer.php', true, true); ?>
        
        <?php get_sidebar(); ?>
            
		<?php locate_template('mainmenu.php', true, true); ?>
	        
<?php get_footer(); ?>