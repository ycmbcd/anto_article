<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询字段
if(isset($_GET['select_comfield'])){
    $sql = "SELECT * FROM common_field ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//添加表单
if(isset($_POST['new_field'])){
    $new_field = $_POST['new_field'];
    $new_field_type = $_POST['new_field_type'];
    $new_field_length = $_POST['new_field_length'];
    $new_field_info = $_POST['new_field_info'];
    $new_field = addslashes($new_field);   //防止SQL注入
    $new_field_info = addslashes($new_field_info);

    //查询是否已存在
    $sql = "SELECT * FROM common_field WHERE field_name='{$new_field}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        $sql = "INSERT INTO common_field (field_name,field_type,field_length,field_info) VALUES ('{$new_field}','{$new_field_type}','{$new_field_length}','{$new_field_info}')";
        $res = $db->execute($sql);
        echo "ok";
    }else{
        echo "has";
    }
}

//修改表单
if(isset($_POST['change_key'])){
    $change_key = $_POST['change_key'];
    $field = $_POST['field'];
    $id = $_POST['id'];
    $change_key = addslashes($change_key);   //防止SQL注入
    if($field=='field_name'){
        $sql = "SELECT * FROM common_field WHERE field_name='{$change_key}' AND id<>'{$id}'";
        $res = $db->getOne($sql);
        if(empty($res)){

        }else{
            echo 'has';
            return false;
        }
    }
    $sql = "UPDATE common_field SET {$field} = '{$change_key}' WHERE id='{$id}'";
    $res = $db->execute($sql);
    echo "ok";
}

//删除表单
if(isset($_POST['del_field_id'])){
    $del_field_id = $_POST['del_field_id'];
    $sql = "DELETE FROM common_field where id='{$del_field_id}'";
    $res = $db->execute($sql);
    echo "ok";
}
?>