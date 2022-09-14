<div class="singlevideo_container">
    <div class="singlevideo_cover" <?php echo $cv_style; ?>>
        <div class="singlevideo_playbutton" style="padding-top: 50px;">
            <?php if($templatedata['embeddable']) : ?>
                <a class="videolink_single" href="<?php echo $templatedata['ytlink']; ?>" target="_blank" title="<?php echo $templatedata['title']; ?>">
            <?php else : ?>
                <a href="<?php echo $templatedata['ytlink']; ?>" target="_blank" title="<?php echo $templatedata['title']; ?>">
            <?php endif; ?>
                    <img src="<?php echo LAYOUTURI_RELATIVE . '/base/graphs/' . $icon; ?>" alt="<?php echo $iconalt; ?>" />
                </a>
        </div>
    </div>
    <div class="singlevideo_caption">
        <div class="singlevideo_caption-info">
            <?php echo $templatedata['title']; ?>
            <?php if($templatedata['needextendedinfo']) : ?>
                <br /><span style="font-size: var(--fontsize-small);"><?php echo $templatedata['description']; ?></span>
        </div>
            <?php else : ?>
        </div>        
            <?php endif; ?>
        <div class="singlevideo_caption-duration"><strong><?php echo $templatedata['duration']; ?></strong></div>
    </div>
</div>