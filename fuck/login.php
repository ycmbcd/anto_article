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

//修改密码
if(isset($_POST['change_pwd'])){
	$old_pwd = $_POST['change_pwd'];
	$new_pwd = $_POST['new_pwd'];
	$re_pwd = $_POST['re_pwd'];
	$old_pwd = addslashes($old_pwd);   //防止SQL注入
	$new_pwd = addslashes($new_pwd);   
	$re_pwd = addslashes($re_pwd);   
	if($new_pwd!==$re_pwd){
		echo "error";
		return false;
	}
	$user = $_SESSION['u_num'];
	$db = new PdoMySQL();
	$sql = "SELECT * FROM user_company WHERE u_num = $user AND u_pwd='{$old_pwd}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        echo "0";
    }else{
    	//修改
    	$sql = "UPDATE user_company SET u_pwd='{$new_pwd}' WHERE u_num = $user";
    	$res = $db->execute($sql);
    	echo "ok";
    }
}

//退出
if(isset($_GET['logout'])){
	session_destroy();
	echo "<script>window.location='/index.html';</script>";
}
?>