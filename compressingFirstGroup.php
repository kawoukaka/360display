<?php

ini_set('max_execution_time', 300);
$t = 0;
		$array =array();
		for($j=0;$j<1;$j++)
		{
			for($i=0;$i<50;$i++)
			{
				$source_photo = 'images/'.$j.'_'.$i.'.jpg';
				$randomFileName = substr(md5(uniqid(rand())),0,6).'_'.$j.'_'.$i.'.jpg';
				$dest_photo = 'resizeImages/'.$randomFileName;
				$t++;
				$result = compress_image($source_photo, $dest_photo, 70);
				array_push($array,$randomFileName);
				
			}
		}


		if($t==50)
		{
			echo json_encode($array);
			
			
		}



function compress_image($source_url, $destination_url, $quality) {
	$info = getimagesize($source_url);
 
	if ($info['mime'] == 'image/jpeg') $image = imagecreatefromjpeg($source_url);
	elseif ($info['mime'] == 'image/gif') $image = imagecreatefromgif($source_url);
	elseif ($info['mime'] == 'image/png') $image = imagecreatefrompng($source_url);
 
	return imagejpeg($image, $destination_url, $quality);
}
?>
