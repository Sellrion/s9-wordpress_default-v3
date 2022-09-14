<!DOCTYPE html>
<html lang="ru" xml:lang="ru" xmlns="http://www.w3.org/1999/xhtml">
	<head>
        <meta charset="<?php echo bloginfo('charset'); ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2f57d3" />
        <title><?php global $page, $paged;
		wp_title('|', true, 'right');
        bloginfo('name');
        if ($paged >= 2 || $page >= 2) echo ' | ' . sprintf(__('Page %s'), max($paged, $page));
        ?></title>
        <meta name="description" content="<?php echo get_bloginfo('description', 'display'); ?>" />
        <link rel="stylesheet" type="text/css" href="<?php echo LAYOUTURI_RELATIVE ?>/style.css?build=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . LAYOUTURI_RELATIVE . '/style.css'); ?>" />
		<link rel="stylesheet" type="text/css" href="<?php echo LAYOUTURI_RELATIVE ?>/makeup.css?build=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . LAYOUTURI_RELATIVE . '/makeup.css'); ?>" />
        <script type="text/javascript" src="<?php echo LAYOUTURI_RELATIVE . '/clientscript.js?build=' . CLSCRIPT_BUILD; ?>"></script>
        <script type="text/javascript">
			//Google analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-30697394-1']);
			_gaq.push(['_setDomainName', 'school9-nt.ru']);
			_gaq.push(['_trackPageview']);
			(function() {
					  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
					  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
					  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
					  })();
        </script>
		<link rel="shortcut icon" href="<?php echo home_url(); ?>/favicon.ico" type="image/x-icon" />
        <style>
            <?php
            global $TAGCLOUD_MINFONTSIZE, $TAGCLOUD_MAXFONTSIZE, $TAGCLOUD_GRADIENT;
            $fl = $TAGCLOUD_MAXFONTSIZE - $TAGCLOUD_MINFONTSIZE;
            $rl = abs($TAGCLOUD_GRADIENT['R2'] - $TAGCLOUD_GRADIENT['R1']);
            $gl = abs($TAGCLOUD_GRADIENT['G2'] - $TAGCLOUD_GRADIENT['G1']);
            $bl = abs($TAGCLOUD_GRADIENT['B2'] - $TAGCLOUD_GRADIENT['B1']);
            $rstep = round($rl / $fl);
            $gstep = round($gl / $fl);
            $bstep = round($bl / $fl);
            $red = $TAGCLOUD_GRADIENT['R1'] + $rstep * 4;
            $green = $TAGCLOUD_GRADIENT['G1'] + $gstep * 4;
            $blue = $TAGCLOUD_GRADIENT['B1'] + $bstep * 4;
            for($i = $TAGCLOUD_MINFONTSIZE; $i <= $TAGCLOUD_MAXFONTSIZE; $i++){
                if($i == $TAGCLOUD_MAXFONTSIZE){
                    $red = $TAGCLOUD_GRADIENT['R2'];
                    $green = $TAGCLOUD_GRADIENT['G2'];
                    $blue = $TAGCLOUD_GRADIENT['B2'];
                } else {
                    $red += $rstep;
                    $green += $gstep;
                    $blue += $bstep;
                }
            ?>
                .tagcloud-link_color-<?php echo $i; ?>:link{ color: rgb(<?php echo $red . ', ' . $green . ', ' . $blue; ?>); } .tagcloud-link_color-<?php echo $i; ?>:visited{ color: rgb(<?php echo $red . ', ' . $green . ', ' . $blue; ?>); } .tagcloud-link_color-<?php echo $i; ?>:hover{ color: rgb(<?php echo $red . ', ' . $green . ', ' . $blue; ?>); } .tagcloud-link_color-<?php echo $i; ?>:active{ color: var(--color-main-emphasis); }
            <?php } ?>
        </style>
    </head>