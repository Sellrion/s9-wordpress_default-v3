<div class="file">
    <div><img src="<?php echo LAYOUTURI_RELATIVE; ?>/base/graphs/<?php echo $file['icon_filename']; ?>" alt="<?php echo $file['icon_alt']; ?>" data-fileicon /></div>
    <div>
        <?php if($file['src']): ?>
            <a href="<?php if($file['lastupdated']) echo $file['src'] . '?touch=' . $file['lastupdated']; else echo $file['src']; ?>" title="Скачать файл &quot;<?php echo $content; ?>&quot;"<?php if($file['filetype'] == 'PDF') : ?> target="_blank"<?php endif; ?>><?php if($content) echo $content; else echo $file['src']; ?></a><br />
            <?php if($file['filesize'] || $file['lastupdated']): ?>
                <span style="font-size: var(--fontsize-small);"><?php if($file['filesize']) echo $file['filesize']; else echo 'N/A'; ?>, <?php if($file['lastupdated']) echo date('d.m.Y', $file['lastupdated']); else echo 'N/A'; ?></span>
            <?php endif; ?>
        <?php else : ?>
            <?php if($content) : ?>
                <span style="font-style:italic;"><?php echo $content; ?></span>
            <?php else : ?>
                <span style="font-style:italic;">N/A</span>
            <?php endif; ?>
            <br />Файл отсутствует на сервере
        <?php endif; ?>
    </div>
</div>