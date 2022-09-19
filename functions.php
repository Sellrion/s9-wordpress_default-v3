<?php
//Define important constants
define("PROTOCOL", (!is_ssl()) ? 'http://' : 'https://');
define("LAYOUTURI", get_template_directory_uri());
define("LAYOUTURI_ABSOLUTE", get_template_directory());
define("LAYOUTURI_RELATIVE", str_replace($_SERVER['DOCUMENT_ROOT'], '', LAYOUTURI_ABSOLUTE));
define("CLSCRIPT_BUILD", filemtime($_SERVER['DOCUMENT_ROOT'] . '/' . LAYOUTURI_RELATIVE . '/clientscript.js'));
define("SCORE_BUILD", filemtime($_SERVER['DOCUMENT_ROOT'] . '/' . LAYOUTURI_RELATIVE . '/functions.php'));
define("REMOTE_GALLERY_DATASTORE_URL", PROTOCOL . 'data.school9-nt.ru/publicgallery/');
define("BACKGROUNDMOSAIC_CACHE_TIMOUT", 43200);

define("SCHOOL_FULLNAME", 'Муниципальное автономное образовательное учреждение средняя общеобразовательная школа № 9 города Нижнего Тагила Свердловской области.');
define("SCHOOL_FRIENDLY_NAME", 'Средняя общеобразовательная школа 9');
define("SCHOOL_SHORTNAME", 'МАОУ СОШ № 9');
define("VICTORYDATE", isVictoryAnniversaryDate());
define("WHENIGONE", isTheDayWhenIgone());
define("SITEVERSION", '3.4.0.' . max(CLSCRIPT_BUILD, SCORE_BUILD));

//Add menus support
if(function_exists('add_theme_support')) add_theme_support('menus');

//Some NGGallery settings
define('NGG_SKIP_LOAD_SCRIPTS', true);

//Tags cloud settings
$TAGCLOUD_MINFONTSIZE = 12;
$TAGCLOUD_MAXFONTSIZE = 48;
$TAGCLOUD_GRADIENT = array(
                            'R1' => 26,
                            'G1' => 82,
                            'B1' => 130,
                            'R2' => 255,
                            'G2' => 255,
                            'B2' => 255
                        );

function fileShortcode_handler($attributes = null, $content = null){
	//We show nothing if source path is't provided
	if(!$attributes || !isset($attributes['src'])) return; elseif(trim($attributes['src']) == '') return;
	
	//Remove the trailing slash from path
	$src = $attributes['src'];
	if($src[strlen($src) - 1] == '/') $src = substr($src, 0, strlen($src) - 2);
	
	$srctype = getURLType($src);
	if($srctype == 1) {
		$src = str_replace(array(PROTOCOL . 'school9-nt.ru', PROTOCOL . 'www.school9-nt.ru'), '', $src);
	} else if($srctype == 2) if($src[0] != '/') $src = '/' . $src;
	
	$file = array(
					'icon_filename' => '',
					'icon_alt' => '',
					'filetype' => false,
					'src' => '',
					'filesize' => null,
					'lastupdated' => null
				);
	
	//Parse path string
	$srcel = explode('/', $src);
	$filename = explode('.', $srcel[count($srcel) - 1]);
	switch(mb_strtolower($filename[count($filename) - 1])){
		case 'pdf':
			$file['icon_filename'] = 'file-pdf.webp';
			$file['icon_alt'] = 'Документ в формате PDF';
			$file['filetype'] = 'PDF';
			break;
		case 'ppt':
			$file['icon_filename'] = 'file-ppt.webp';
			$file['icon_alt'] = 'Презентация Microsoft PowerPoint';
			$file['filetype'] = 'PPT';
			break;
        case 'pptx':
			$file['icon_filename'] = 'file-ppt.webp';
			$file['icon_alt'] = 'Презентация Microsoft PowerPoint';
			$file['filetype'] = 'PPTX';
			break;
		case 'pps':
			$file['icon_filename'] = 'file-ppt.webp';
			$file['icon_alt'] = 'Демонстрация Microsoft PowerPoint';
			$file['filetype'] = 'PPS';
			break;
        case 'ppsx':
			$file['icon_filename'] = 'file-ppt.webp';
			$file['icon_alt'] = 'Демонстрация Microsoft PowerPoint';
			$file['filetype'] = 'PPSX';
			break;
		case 'doc':
			$file['icon_filename'] = 'file-doc.webp';
			$file['icon_alt'] = 'Документ Microsoft Word';
			$file['filetype'] = 'DOC';
			break;
        case 'docx':
			$file['icon_filename'] = 'file-doc.webp';
			$file['icon_alt'] = 'Документ Microsoft Word';
			$file['filetype'] = 'DOCX';
			break;
        case 'xls':
			$file['icon_filename'] = 'file-xls.webp';
			$file['icon_alt'] = 'Книга Microsoft Excel';
			$file['filetype'] = 'XLS';
			break;
        case 'xlsx':
			$file['icon_filename'] = 'file-xls.webp';
			$file['icon_alt'] = 'Книга Microsoft Excel';
			$file['filetype'] = 'XLSX';
			break;
        case 'pub':
			$file['icon_filename'] = 'file-pub.webp';
			$file['icon_alt'] = 'Публикация Microsoft Publisher';
			$file['filetype'] = 'PUB';
			break;
		case 'exe':
			$file['icon_filename'] = 'file-exe.webp';
			$file['icon_alt'] = 'Исполняемый файл';
			$file['filetype'] = 'EXE';
			break;
		case 'zip':
			$file['icon_filename'] = 'file-archive.webp';
			$file['icon_alt'] = 'Архив формата ZIP';
			$file['filetype'] = 'ZIP';
			break;
		case 'rar':
			$file['icon_filename'] = 'file-archive.webp';
			$file['icon_alt'] = 'Архив формата RAR';
			$file['filetype'] = 'RAR';
			break;
		default:
			$file['icon_filename'] = 'file-unknown.webp';
			$file['icon_alt'] = 'Неизвестный тип файла';
			$file['filetype'] = 'UNKNOWN';
			break;
	}
	
	$file['src'] = $attributes['src'];
	if($srctype == 1 || $srctype == 2){
        //Here we need to do some additional checks to fit stupid instructions of our govenment
        //Virtual URL "http://school9-nt.ru/food/[filename].xlsx" is being replacing by real one here
        //Just don't ask why...
        if(preg_match('#^/food/(.*)(.xlsx|.xls)$#i', $src)){
            $src_fullpath = $_SERVER['DOCUMENT_ROOT'] . '/files/official/schoolcanteen-menu/' . $srcel[count($srcel) - 1];
        } else {
            $src_fullpath = $_SERVER['DOCUMENT_ROOT'] . $src;
        }
		if(file_exists($src_fullpath)){
            $fsize = filesize($src_fullpath);
            if($fsize < 1024){
                $file['filesize'] = $fsize . ' байт';
            } elseif($fsize >= 1024 && $fsize < 1048576){
                $file['filesize'] = round($fsize / 1024, 1) . 'Кб';
            } elseif($fsize >= 1048576 && $fsize < 1073741824){
                $file['filesize'] = round($fsize / 1048576, 1) . 'Мб';
            } elseif($fsize >= 1073741824){
                $file['filesize'] = round($fsize / 1073741824, 1) . 'Гб';
            }
            $file['lastupdated'] = filemtime($src_fullpath);
		} else $file['src'] = null;
	}
    
    ob_start();
    
    include('file.php');
	
	return ob_get_clean();
}

function singleVideo($attributes, $content = null){
	//Verify nessessary attributes
	if((!isset($attributes['id']) || $attributes['id'] == '')) return;
	
	//Database object
	global $wpdb;
	
	//Request video
	$id = null;
	$wherecond = null;
	if(is_numeric($attributes['id'])){
		$id = (int)$attributes['id'];
		$wherecond = 'id = %d';
	} else {
		$id = $attributes['id'];
		$wherecond = 'ytid = %s';
	}
	
	$video = $wpdb->get_results($wpdb->prepare("SELECT * FROM site_vgcache 
												WHERE " . $wherecond, $id),
								ARRAY_A);
	
	//If no such video in the cache							
	if(count($video) == 0) return;
	
	//Convert duration
	$duration = new DateInterval($video[0]['duration']);
	
	$templatedata = array(
							'needextendedinfo' => isset($attributes['description']),
							'coverimage' => PROTOCOL . 'school9-nt.ru/files/vdatacache/' . $video[0]['ytid'] . '_medium.jpg',
							'ytlink' => 'https://www.youtube.com/watch?v=' . $video[0]['ytid'],
							'title' => $video[0]['title'],
							'description' => getShortString($video[0]['description'], 80, '...'),
							'duration' => ($duration->h > 0) ? $duration->format('%h:%I:%S') : $duration->format('%I:%S'),
							'uploadStatus' => $video[0]['uploadStatus'],
							'privacyStatus' => $video[0]['privacyStatus'],
							'embeddable' => (bool)$video[0]['embeddable']
							);
	
	return singleVideo_HTML($templatedata);						
}

function singleVideo_HTML($templatedata = null){
	if(!$templatedata) return;
	
	//Build video template HTML
	$cv_style = '';
	$icon = '';
	$iconalt = '';
	if($templatedata['privacyStatus'] != 'private'){
		switch($templatedata['uploadStatus']){
			case 'processed':
				$cv_style = ' style="background-image:url(' . $templatedata['coverimage'] . ');"';
				$icon = 'play.png';
				$iconalt = 'Воспроизвести видео';
				break;
			case 'processing':
				$cv_style = '';
				$icon = 'clock.png';
				$iconalt = 'Видео еще обрабатывается';
				break;
			case 'failed':
			case 'rejected':
				$cv_style = '';
				$icon = 'exclamation.png';
				$iconalt = 'Невозможно воспроизвести видео';
				break;
		}
	} else {
		$cv_style = '';
		$icon = 'exclamation.png';
		$iconalt = 'Это видео не является публичным';
	}
	
	ob_start();
    
	include('video.php');
    
	return ob_get_clean();
}

//Fifure shortcode
function figureShortcode_Handler($attributes, $content = null){
	//We show nothing if source path is't provided
	if(!$attributes || !isset($attributes['src'])) return; elseif(trim($attributes['src']) == '') return;
	
	//If size of image is not provided, we set the default one
	$f_width = (!isset($attributes['width']) || $attributes['width'] == '') ? '150' : $attributes['width'];
	$f_height = (!isset($attributes['height']) || $attributes['height'] == '') ? '150' : $attributes['height'];
	
	//Strip px
	$f_width = str_replace('px', '', $f_width);
	$f_height = str_replace('px', '', $f_height);
	
	//Set description
	$content = (!$content || $content == '') ? '&nbsp;' : $content;
	
	//User can turn off magnify function
	$nomagnify = isset($attributes['nomagnify']) && $attributes['nomagnify'] == 'nomagnify';
	
	//Prepare source and thumbnail paths
	$src = $attributes['src'];
	if($src[strlen($src) - 1] == '/') $src = substr($src, 0, strlen($src) - 2);
	$srctype = getURLType($src);
	if($srctype == 1){
		$src = str_replace(array(PROTOCOL . 'school9-nt.ru', PROTOCOL . 'www.school9-nt.ru'), '', $src);
	} else if($srctype == 2) if($src[0] != '/') $src = '/' . $src;
	
	$thumb = '';
	$thumbtype = null;
	if(isset($attributes['thumb']) && $attributes['thumb'] != ''){
		$thumb = $attributes['thumb'];
		if($thumb[strlen($thumb) - 1] == '/') $thumb = substr($thumb, 0, strlen($thumb) - 2);
		$thumbtype = getURLType($thumb);
		if($thumbtype == 1){
			$thumb = str_replace(array(PROTOCOL . 'school9-nt.ru', PROTOCOL . 'www.school9-nt.ru'), '', $thumb);
		} else if($thumbtype == 2) if($thumb[0] != '/') $thumb = '/' . $thumb;
		//If no thumbnail, use the original image 
	} else $thumb = $src;
	
    if($thumbtype && ($thumbtype == 1 || $thumbtype == 2)) $thumb = file_exists($_SERVER['DOCUMENT_ROOT'] . $thumb) ? $thumb : $src; 

    ob_start();
    
	include('illustration.php');
    
	return ob_get_clean();
}

$strow_issingle = false;
$strow_dused = false;
$is_inside_strow = false;

function slidertableShortcode_Handler($attributes, $content = null){
	if(!$content) return;
	
	global $strow_issingle, $is_inside_strow;
	static $stID = -1;
	
	$is_inside_strow = ($is_inside_strow) ? false : false;
	
	$stID++;
	$stcount = preg_match_all('#(?:\[row)[\s\S]*?[\]]#i', $content, $matches);
	unset($matches);
	$strow_issingle = $stcount && $stcount == 1;
	return '<div id="slidertable-' . $stID . '">' . do_shortcode($content) . '</div>';
}

function slidertableRowShortcode_Handler($attributes, $content = ''){
	global $strow_issingle, $strow_dused, $is_inside_strow;
	$outhtml = '';
    $headclass = 'slidertable-head';
    $stmclass = 'slidertable-marker';
    if((isset($attributes['default']) && $attributes['default'] == 'default' && !$strow_dused) || $strow_issingle){
        $headclass .= ' sth-openned';
        $bodystyle = ' style="display:block;"';
        $stmclass .= ' stm-expanded';
        $strow_dused = true;
    } else {
        $bodystyle = ' style="display:none;"';
        $stmclass .= ' stm-collapsed';
    }

    $stimg = '<div class="' . $stmclass . '"></div>';

    //Build anchor
    $anchor = (isset($attributes['anchor']) && $attributes['anchor'] != '') ? '<a id="' . $attributes['anchor'] . '"></a>' : '';

    //Output
    $is_inside_strow = true;
    $header_level = (!is_page()) ? '4' : '5';
    $outhtml = $anchor . '<div class="' . $headclass . '"><div class="slidertable-header"><h' . $header_level . '>' . $attributes['name'] . '</h' . $header_level . '></div>' . $stimg . '</div><div class="slidertable-body"' . $bodystyle. '>' . do_shortcode($content) . '</div>';
    $is_inside_strow = false;
	
	return $outhtml;
}

function photoalbumShortcode_Handler($attributes, $content = ''){
    if((!isset($attributes['id']) || $attributes['id'] == '')) return;
    
    return '<div id="photopuzzle-' . $attributes['id'] . '" class="photopuzzle" data-galleryid="' . $attributes['id'] . '"></div>';
}

function getBackgroundMosaicMap(){
    //Check cache
    if(!file_exists(LAYOUTURI_ABSOLUTE . '/base/graphs/_backgroundMosaic.webp') || (time() - filemtime(LAYOUTURI_ABSOLUTE . '/base/graphs/_backgroundMosaic.webp') > BACKGROUNDMOSAIC_CACHE_TIMOUT)){
        generateBackgroundMosaicMap();
    }
    
    return file_get_contents(LAYOUTURI_ABSOLUTE . '/base/cache/_backgroundMosaic.map');
}

function generateBackgroundMosaicMap(){
    global $wpdb;
    
    $MOSAIC_WIDTH = 1920;
    $MOSAIC_HEIGHT = 2160;
    
    $MAPGRID_CELL_WIDTH = 120;
    $MAPGRID_CELL_HEIGHT = 90;
    
    $MAPGRID_COLUMNS = ceil($MOSAIC_WIDTH / $MAPGRID_CELL_WIDTH);
    $MAPGRID_ROWS = ceil($MOSAIC_HEIGHT / $MAPGRID_CELL_HEIGHT);
    
    $N_MAX_IMAGES = $MAPGRID_COLUMNS * $MAPGRID_ROWS;
    
    $MOSAICMAP = array();
    
    $IMAGE_TEMPLATES = array(
                                'a' => array(
                                                'width' => 1, 
                                                'height' => 1, 
                                            ),
                                'b' => array(
                                                'width' => 2, 
                                                'height' => 1, 
                                            ),
                                'c' => array(
                                                'width' => 3, 
                                                'height' => 1, 
                                            ),
                                'd' => array(
                                                'width' => 1, 
                                                'height' => 2, 
                                            ),
                                'e' => array(
                                                'width' => 1, 
                                                'height' => 3, 
                                            ), 
                                'f' => array(
                                                'width' => 2, 
                                                'height' => 2, 
                                            ), 
                                'g' => array(
                                                'width' => 3, 
                                                'height' => 2, 
                                            ), 
                                'h' => array(
                                                'width' => 2, 
                                                'height' => 3, 
                                            ), 
                                'i' => array(
                                                'width' => 3, 
                                                'height' => 3, 
                                            )
                            );
    
    $imageids = $wpdb->get_results($wpdb->prepare("SELECT pid FROM site_ngg_pictures"), ARRAY_A);
    
    $imageids_count = count($imageids);
    $randomimagesids = $imageids[mt_rand(0, $imageids_count - 1)]['pid'];
    
    for($i = 1; $i < $N_MAX_IMAGES; $i++){
        $randomimagesids .= ',' . $imageids[mt_rand(0, $imageids_count - 1)]['pid'];
    }
    
    $excludedgalleriesids = "";
    $nggoptions = $wpdb->get_results($wpdb->prepare("SELECT * FROM site_ngg_options"), ARRAY_A);
    for($i = 0; $i < count($nggoptions); $i++){
        if($nggoptions[$i]['name'] == 'backgroundMosaic_exluded_galleryids'){
            $excludedgalleriesids = $nggoptions[$i]['value'];
            break;
        }
    }
    
    $randimages = $wpdb->get_results($wpdb->prepare("SELECT gallery.gid, gallery.name, gallery.path, gallery.title, image.pid, image.galleryid, image.filename, image.alttext 
                                                    FROM site_ngg_pictures AS image 
                                                    LEFT JOIN site_ngg_gallery AS gallery ON(image.galleryid = gallery.gid) 
                                                    WHERE image.pid IN (" . $randomimagesids . ") AND image.galleryid NOT IN (" . $excludedgalleriesids . ")"),
								    ARRAY_A);
    
    $backgroundMosaic = imagecreatetruecolor($MOSAIC_WIDTH, $MOSAIC_HEIGHT);
    $image = false;
    $randomtemplate = 0;
    $imageindex = -1;
    $htmlmap = '<map id="backgroundMosaicMap" name="backgroundMosaicMap" data-cached="' . time() . '">';
    $templates_posible = array();
    
    for($i = 0; $i < $MAPGRID_COLUMNS; $i++){
        for($j = 0; $j < $MAPGRID_ROWS; $j++){
            if(!isset($MOSAICMAP[$i][$j])){
                $templates_posible[] = 'a';
                if(!isset($MOSAICMAP[$i + 1][$j])){
                    $templates_posible[] = 'b';
                    if(!isset($MOSAICMAP[$i + 2][$j])) $templates_posible[] = 'c';
                }
                if(!isset($MOSAICMAP[$i][$j + 1])){
                    $templates_posible[] = 'd';
                    if(!isset($MOSAICMAP[$i][$j + 2])) $templates_posible[] = 'e';
                }
                if(!isset($MOSAICMAP[$i + 1][$j]) && !isset($MOSAICMAP[$i][$j + 1])){
                    if(!isset($MOSAICMAP[$i + 1][$j + 1])) $templates_posible[] = 'f';
                }
                if(in_array('f', $templates_posible) && in_array('c', $templates_posible) && !isset($MOSAICMAP[$i + 2][$j + 1])) $templates_posible[] = 'g';
                if(in_array('f', $templates_posible) && in_array('e', $templates_posible) && !isset($MOSAICMAP[$i + 1][$j + 2])) $templates_posible[] = 'h';
                if(in_array('g', $templates_posible) && in_array('h', $templates_posible) && !isset($MOSAICMAP[$i + 2][$j + 2])) $templates_posible[] = 'i';
                
                $randomtemplate = mt_rand(0, count($templates_posible) - 1);
                
                //Prepare image
                $localpath = '';
                $localpath_full = '';
                while(!$image){
                    $imageindex++;
                    
                    $localpath = ($randimages[$imageindex]['path'][strlen($randimages[$imageindex]['path']) - 1] != '/') ? $randimages[$imageindex]['path'] . '/' : $randimages[$imageindex]['path'];
                    $localpath_full = $_SERVER['DOCUMENT_ROOT'] . '/' . $localpath . 'thumbs/thumbs_' . $randimages[$imageindex]['filename'];
                    switch(exif_imagetype($localpath_full)){
                        case IMAGETYPE_JPEG:
                            $image = imagecreatefromjpeg($localpath_full);
                            break;
                        case IMAGETYPE_PNG:
                            $image = imagecreatefrompng($localpath_full);
                            break;
                        case IMAGETYPE_GIF:
                            $image = imagecreatefromgif($localpath_full);
                            break;
                        case IMAGETYPE_BMP:
                            $image = imagecreatefrombmp($localpath_full);
                            break;
                        default: break;
                    }
                }
                
                if($IMAGE_TEMPLATES[$templates_posible[$randomtemplate]]['width'] == $IMAGE_TEMPLATES[$templates_posible[$randomtemplate]]['height']){
                    $image = imagescale($image, $IMAGE_TEMPLATES[$templates_posible[$randomtemplate]]['width'] * $MAPGRID_CELL_WIDTH, -1, IMG_BICUBIC);
                }
                
                //This filter is applied in a memory of that time, I've sacrificed to the way this site looks like now.
                if(WHENIGONE || VICTORYDATE) imagefilter($image, IMG_FILTER_GRAYSCALE);
                
                $x = $i * $MAPGRID_CELL_WIDTH;
                $y = $j * $MAPGRID_CELL_HEIGHT;
                
                $w = $IMAGE_TEMPLATES[$templates_posible[$randomtemplate]]['width'] * $MAPGRID_CELL_WIDTH;
                $h = $IMAGE_TEMPLATES[$templates_posible[$randomtemplate]]['height'] * $MAPGRID_CELL_HEIGHT;
                
                imagecopyresampled($backgroundMosaic, $image, $x, $y, 0, 0, $w, $h, $w, $h);
                
                //Generate map
                $gallerypath = explode('/', $randimages[$imageindex]['path']);
                $galleryfolder = ($randimages[$imageindex]['path'][strlen($randimages[$imageindex]['path']) - 1] != '/') ? $gallerypath[count($gallerypath) - 1] : $gallerypath[count($gallerypath) - 2];
                $htmlmap .= '<area shape="rect" coords="' . $x . ',' . $y . ',' . $x + $w . ',' . $y + $h . '" href="' . REMOTE_GALLERY_DATASTORE_URL . $galleryfolder . '/' . $randimages[$imageindex]['filename'] . '" alt="' . esc_attr(trim($randimages[$imageindex]['alttext'])) . '" data-pid="' . $randimages[$imageindex]['pid'] . '" data-gid="' . $randimages[$imageindex]['name'] . '" data-gname="' . esc_attr(trim($randimages[$imageindex]['title'])) . '">';
                
                for($k = 0; $k < $IMAGE_TEMPLATES[$templates_posible[$randomtemplate]]['width']; $k++){
                    for($h = 0; $h < $IMAGE_TEMPLATES[$templates_posible[$randomtemplate]]['height']; $h++){
                        $MOSAICMAP[$i + $k][$j + $h] = 'X';
                    }
                }
                
                $templates_posible = array();
                $image = false;
            }
        }
    }
    
    $htmlmap .= '</map>';
    
    //imagejpeg($backgroundMosaic, LAYOUTURI_ABSOLUTE . '/base/graphs/_backgroundMosaic.jpg', 100);
    imagewebp($backgroundMosaic, LAYOUTURI_ABSOLUTE . '/base/graphs/_backgroundMosaic.webp', 100);
    imagedestroy($backgroundMosaic);
    
    file_put_contents(LAYOUTURI_ABSOLUTE . '/base/cache/_backgroundMosaic.map', $htmlmap);
}

function strstrpos($haystack = null, $needle){
	if(!$haystack || $haystack == '') return false;
	
	$haycheck = false;
	if(is_array($needle)){
		for($i = 0;$i < count($needle);$i++){
			$haycheck = strpos($haystack, $needle[$i]);
			if($haycheck !== false && $haycheck == 0) return true;
		}
	} else {
		$haycheck = strpos($haystack, $needle);
		if($haycheck !== false && $haycheck == 0) return true;
	}
	return false;
}

function getURLType($url){
	if(!$url) return 0;
	
	//Determine whatever the given src is a link or not
	$urlCheck = strstrpos($url, array('http://', 'https://', 'ftp://'));
	if($urlCheck){
		//Well it's a link, but is this a native link or external?
		$urlCheck = strstrpos($url, array(PROTOCOL . 'school9-nt.ru/', PROTOCOL . 'www.school9-nt.ru/'));
		if(!$urlCheck) return 0; else return 1;
	} 
    
    return 2;
}

function getShortString($string = '', $length = 0, $trail = ''){
	return (mb_strlen($string) <= $length) ? $string : mb_substr($string, 0, $length) . $trail;
}

function getDiffRandom($exlnumber, $min, $max){
	$rnd = null;
	while(1){
		$rnd = rand($min, $max);
		if($rnd == $exlnumber) continue; else break;
	}
	
	return $rnd;
}

function buildBreadcrumbs(){
	global $post;
    
	$post_id = $post->post_parent;
	$crumbs = array();
	$tmp_page = null;
	while($post_id){
		$tmp_page = get_post($post_id);
		$crumbs[] = array(
							'title' => $tmp_page->post_title,
							'url' => get_permalink($tmp_page->ID)
							);
		$post_id = $tmp_page->post_parent;
	}
	
	return array_reverse($crumbs);
}

function s9tagcloud_filter($tags_data){
    $tc = count($tags_data);
    for($i = 0; $i < $tc; $i++){
        $tags_data[$i]['class'] .= ' tagcloud-link_color-' . round($tags_data[$i]['font_size']);
    }
    
    return $tags_data;
}

function isVictoryAnniversaryDate(){
    $daytoday = (int)date("j");
    $monthtoday = (int)date("n");
    
    return ($monthtoday == 4 && $daytoday > 18) || ($monthtoday == 5 && $daytoday < 12);
}

//From now on, every 31 of august will be celebrated
//as the day when I gone.
function isTheDayWhenIgone(){
    $daytoday = (int)date("j");
    $monthtoday = (int)date("n");
    
    return ($monthtoday == 8 && $daytoday == 31);
}

add_shortcode('file', 'fileShortcode_handler');
add_shortcode('video', 'singleVideo');
add_shortcode('img', 'figureShortcode_Handler');
add_shortcode('slidertable', 'slidertableShortcode_Handler');
add_shortcode('row', 'slidertableRowShortcode_Handler');
add_shortcode('nggallery', 'photoalbumShortcode_Handler');
add_filter('use_block_editor_for_post', '__return_false');
add_filter('wp_generate_tag_cloud_data', 's9tagcloud_filter');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
?>