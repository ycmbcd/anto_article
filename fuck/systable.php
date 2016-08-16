<?php
//开启session
session_start();
@$u_name = $_SESSION['u_name'];
if($u_name==''){
	echo '请登录后再试。1秒钟后跳转...<meta http-equiv="refresh" content="2;url=/index.html" />';die;
}

$dir = dirname(__FILE__);
require_once($dir."/../pdo/PdoMySQL.class.php");//PDO

$db = new PdoMySQL();

//查询表单
if(isset($_GET['select_table'])){
    $select_table = $_GET['select_table'];
    $sql = "SELECT * FROM folder_table WHERE folder_id='{$select_table}' AND table_name <> '***' ORDER BY id DESC";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//添加表单
if(isset($_POST['new_table'])){
    $new_table = $_POST['new_table'];
    $folder_id = $_POST['folder_id'];
    $new_table = addslashes($new_table);   //防止SQL注入

    $db = new \PdoMySQL();
    //查询此文件夹是否包含此表单
    $sql = "SELECT * FROM folder_table WHERE table_name='{$new_table}' and folder_id='{$folder_id}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        $sql = "INSERT INTO folder_table (table_name,folder_id) VALUES ('{$new_table}','{$folder_id}')";
        $res = $db->execute($sql);
        echo "ok";
    }else{
        echo "has";
    }
}


?>