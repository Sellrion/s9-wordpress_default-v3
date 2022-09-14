
	<!-- Overlay screen //-->
    <div id="overlay_screen" class="overlay"></div>
    <div id="overlay" class="overlay"></div>
    
    <script type="text/javascript">
		s9clientApp_Init();
		<?php if(is_page('sendmessage')) : ?> initFeedbackMessenger(); <?php endif; ?>
	</script>
	<?php //wp_footer(); ?>
	</body>
</html>