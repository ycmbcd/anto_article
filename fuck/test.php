<?php 
	$dir = dirname(__FILE__);
	require_once($dir."/../pdo/PdoMySQL.class.php");//PDO
	$db = new PdoMySQL();
	$sql = "SELECT * FROM user_company WHERE u_num='100' AND u_pwd='ycmbcd'";
    $res = $db->getOne($sql);
var_dump($res);
    if(empty($res)){
        echo "0";
    }else{
        // $session = \YII::$app->session; //调一个session
        // $session->open();   //开启session
        echo "go";
		echo $res['u_name'];
	}
 ?>