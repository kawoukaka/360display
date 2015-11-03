<?php

ini_set('max_execution_time', 300);
$t = 0;
		$array =array();
		for($j=0;$j<1;$j++)
		{
			for($i=1;$i<50;$i++)
			{
				$source_photo = 'images/'.$j.'_'.$i.'.jpg';
				$dest_photo = 'resizeImages/'.$j.'_'.$i.'.jpg';
				if (!file_exists($dest_photo)) {
					$t++;
					$result = compress_image($source_photo, $dest_photo, 70);
				}
				//array_push($array,$randomFileName); 
				
			}
		}


		if($t==49)
		{
			//echo json_encode($array);
			echo $t+1;
			
		}
		else
		{
			echo "skip";
		}




function compress_image($source_url, $destination_url, $quality) {
	$info = getimagesize($source_url);
 
	if ($info['mime'] == 'image/jpeg') $image = imagecreatefromjpeg($source_url);
	elseif ($info['mime'] == 'image/gif') $image = imagecreatefromgif($source_url);
	elseif ($info['mime'] == 'image/png') $image = imagecreatefrompng($source_url);
 
	return imagejpeg($image, $destination_url, $quality);
}
?>
