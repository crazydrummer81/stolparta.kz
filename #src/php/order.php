<?php
// Данные Telegram
define('TELEGRAM_TOKEN', '981200830:AAHzT6oERvgX8eFSzIaEYV5UTG1GUQVVMG0');
define('TELEGRAM_CHATID', '-308452019');

//Данные e-mail
$EMAIL = 'mansurmamirov@gmail.com'; //  Ваш e-mail на который будут приходить заявки
$FROM = 'mansurmamirov@gmail.com';  //  e-mail отправителя (иногда требуется указать разрешенный настройками e-mail)
$REPLY = 'mansurmamirov@gmail.com';   //  e-mail для ответа 
$PRIORITY = true;       //  пометить как важное

$date = date('ymd-His');
$data = $_POST;
$log = '';
$RESULT = [];
header('Content-Type: application/json');
if (is_array($data)) {
	file_put_contents('order-'.$date.'.log', json_encode($data,JSON_PRETTY_PRINT));
	// echo json_encode(['success'=> true]);
	$RESULT['success'] = true;
}
else {
	echo json_encode(['success'=> false]);
};

$message = 
	"Имя: ".$data['user_name']."\n".
	"Телефон: ".$data['user_phone']."\n".
	"Столы: x".$data['quantity_table']." = ".$data['cost_table']." тг.\n".
	"Слулья: x".$data['quantity_chair']." = ".$data['cost_chair']." тг.\n".
	"Лампы: x".$data['quantity_lamp']." = ".$data['cost_lamp']." тг.\n".
	"Доставка: ".($data['need_shipping'] ? 'Да' : 'Нет')." = ".$data['shipping_cost']." тг.\n".
	"Итого: ".$data['cost_total']." тг.\n";

sendmail("stol-parta.kz - Новая заявка", $message,$EMAIL,$FROM,$REPLY);
$RESULT['telegram'] = message_to_telegram("stol-parta.kz - Новая заявка\n\n".$message);
echo json_encode($RESULT);
// file_put_contents('log-'.$date.'.log', json_decode($RESULT));

function message_to_telegram($text)
{
	global $date;
	$ch = curl_init();
	curl_setopt_array(
		$ch,
		array(
			CURLOPT_URL => 'https://api.telegram.org/bot' . TELEGRAM_TOKEN . '/sendMessage',
			CURLOPT_POST => TRUE,
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_TIMEOUT => 10,
			CURLOPT_POSTFIELDS => array(
					'chat_id' => TELEGRAM_CHATID,
					'text' => $text,
					'parse_mode' => 'Markdown'
			),
		)
	);
	// $res = curl_exec($ch,CURLOPT_RETURNTRANSFER);
	$res = curl_exec($ch);
	// file_put_contents('order-'.$date.'.log', $res);
	return $res;
};
function sendmail($_sSubject, $_sMessage, $_sEmail, $_sFrom, $_sReply, $_bPriority=false){
	$subject = "=?utf-8?b?" . base64_encode($_sSubject) . "?=";
	$headers  = "From: $_sFrom\r\n";
	$headers .= "Reply-To: $_sReply\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
    if($_bPriority){
        $headers .= "X-Priority: 1 (Highest)\n";
        $headers .= "X-MSMail-Priority: High\n";
        $headers .= "Importance: High\n";
    }
	$headers .= "Content-type: text/html; charset=utf-8\r\n";
	return mail($_sEmail, $subject, $_sMessage, $headers);
};



?>