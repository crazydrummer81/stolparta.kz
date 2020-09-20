<?php
	$date = date('ymd-gis');
	header('Content-Type: application/json');
	$data = $_POST;
	$log = '';
	if (is_array($data)) {
		file_put_contents('order-'.$date.'.log', json_encode($data,JSON_PRETTY_PRINT));
		echo json_encode(['success'=> true]);
	}
	else {
		echo json_encode(['success'=> false]);
	}