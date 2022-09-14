<figure style="width:<?php echo $f_width; ?>px;">
    <?php if($srctype == 0) : ?>
        <?php if(!$nomagnify) : ?>
            <a class="imagelink_single" href="<?php echo $src; ?>" title="<?php echo $content; ?>"><img src="<?php echo $thumb; ?>" width="<?php echo $f_width; ?>" height="<?php echo $f_height; ?>" alt="<?php echo $content; ?>" /></a>
            <div class="figcaption">
                <div class="figcaption-name"><figcaption><?php echo $content; ?></figcaption></div>
                <div class="figcaption-magnify"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 17 11" enable-background="new 0 0 17 11" xml:space="preserve" class="svg-fill"><g><polygon stroke-miterlimit="10" points="4.5,5.5 4.5,0.5 15.5,0.5 15.5,8.5 7.4,8.5 7.4,10.5 1.5,10.5 1.5,5.5 "/><polyline stroke-miterlimit="10" points="7.4,8.5 7.4,5.5 4.5,5.5 "/></g></svg></div>
            </div>
        <?php else : ?>
            <img src="<?php echo $thumb; ?>" width="<?php echo $f_width; ?>" height="<?php echo $f_height; ?>" alt="<?php echo $content; ?>" />
            <figcaption><?php echo $content; ?></figcaption>
        <?php endif; ?>
    <?php elseif($srctype == 1 || $srctype == 2) : ?>
        <?php if(file_exists($_SERVER['DOCUMENT_ROOT'] . $src)) : ?>
            <?php if(!$nomagnify) : ?>
                <a class="imagelink_single" href="<?php echo $src; ?>" title="<?php echo $content; ?>"><img src="<?php echo $thumb; ?>" width="<?php echo $f_width; ?>" height="<?php echo $f_height; ?>" alt="<?php echo $content; ?>" /></a>
                <div class="figcaption">
                    <div class="figcaption-name"><figcaption><?php echo $content; ?></figcaption></div>
                    <div class="figcaption-magnify"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 17 11" enable-background="new 0 0 17 11" xml:space="preserve" class="svg-fill"><g><polygon stroke-miterlimit="10" points="4.5,5.5 4.5,0.5 15.5,0.5 15.5,8.5 7.4,8.5 7.4,10.5 1.5,10.5 1.5,5.5 "/><polyline stroke-miterlimit="10" points="7.4,8.5 7.4,5.5 4.5,5.5 "/></g></svg></div>
                </div>
            <?php else : ?>
                <img src="<?php echo $thumb; ?>" width="<?php echo $f_width; ?>" height="<?php echo $f_height; ?>" alt="<?php echo $content; ?>" />
                <figcaption><?php echo $content; ?></figcaption>
            <?php endif; ?>
        <?php else : ?>
            <img src="<?php echo LAYOUTURI_RELATIVE; ?>/base/graphs/noimage.png" alt="Нет изображения" /><br />
            <figcaption>Изображение отсутствует на сервере</figcaption>
        <?php endif; ?>
    <?php endif; ?>
</figure>