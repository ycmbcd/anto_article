<?php
$dir = dirname(__FILE__);
require_once($dir."/./header.php");

//查询表单
if(isset($_GET['select_table'])){
    $select_table = $_GET['select_table'];
    $sql = "SELECT * FROM folder_table WHERE folder_id='{$select_table}' ORDER BY id DESC";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//添加表单
if(isset($_POST['new_table'])){
    $new_table = $_POST['new_table'];
    $folder_id = $_POST['folder_id'];
    $new_table = addslashes($new_table);   //防止SQL注入

    //查询是否已存在
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

//修改表单
if(isset($_POST['re_table'])){
    $re_table = $_POST['re_table'];
    $click_key = $_POST['click_key'];
    $folder_id = $_POST['folder_id'];
    $re_table = addslashes($re_table);   //防止SQL注入
    $sql = "SELECT * FROM folder_table WHERE table_name='{$re_table}' and folder_id='{$folder_id}'";
    $res = $db->getOne($sql);
    if(empty($res)){
        $sql = "UPDATE folder_table SET table_name='{$re_table}' where id='{$click_key}'";
        $res = $db->execute($sql);
        echo "ok";
    }else{
        echo "has";
    }
}

//删除表单
if(isset($_POST['del_table_id'])){
    $del_table_id = $_POST['del_table_id'];
    $sql = "DELETE FROM folder_table where id='{$del_table_id}'";
    $res = $db->execute($sql);
    echo "ok";
}
?>