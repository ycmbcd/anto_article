<?php
//开启session
session_start();

$dir = dirname(__FILE__);
require_once($dir."/../pdo/PdoMySQL.class.php");//PDO

//登录验证
if(isset($_POST['u_num'])){
	$u_num = $_POST['u_num'];
	$u_pwd = $_POST['u_pwd'];
	$u_num = addslashes($u_num);   //防止SQL注入
	$u_pwd = addslashes($u_pwd);   
	$db = new PdoMySQL();
	$sql = "SELECT * FROM user_company WHERE u_num='{$u_num}' AND u_pwd='{$u_pwd}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        echo "0";
    }else{
		$_SESSION['u_num'] = $u_num;
		$_SESSION['u_name'] = $res['u_name'];
    	echo "go";
    }
}

//输出u_name
if(isset($_GET['u_name'])){
	@$u_name = $_SESSION['u_name'];
	if($u_name==''){
		echo 'logout';die;
	}
	echo $_SESSION['u_name'];
}

//退出
if(isset($_GET['logout'])){
	session_destroy();
	echo "<script>window.location='/index.html';</script>";
}
?>