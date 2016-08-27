<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询字段
if(isset($_GET['select_yahoofield'])){
    $sql = "SELECT * FROM yahoo_field ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//添加表单
if(isset($_POST['new_field'])){
    $new_field = $_POST['new_field'];
    $new_field_type = $_POST['new_field_type'];
    $new_field_require = $_POST['new_field_require'];
    $new_field_length = $_POST['new_field_length'];
    $new_field_info = $_POST['new_field_info'];
    $new_field_default = isset($_POST['new_field_default']);
    $new_field = addslashes($new_field);   //防止SQL注入
    $new_field_info = addslashes($new_field_info);
    $new_field_default = addslashes($new_field_default);

    //查询是否已存在
    $sql = "SELECT * FROM yahoo_field WHERE field_name='{$new_field}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        //插入通用字段属性表
        $sql = "INSERT INTO yahoo_field (field_name,field_type,field_require,field_length,field_info,field_default) VALUES ('{$new_field}','{$new_field_type}','{$new_field_require}','{$new_field_length}','{$new_field_info}','{$new_field_default}')";
        $res = $db->execute($sql);
        //搜索出字段id
        $sql = "SELECT id FROM yahoo_field WHERE field_name='{$new_field}'";
        $res = $db->getOne($sql);
        $id = $res['id'];
        if($new_field_type=="field_big_txt"){
            $lengs = "text";
        }else{
            $lengs = "varchar(255)";
        }
        //插入商品通用字段表
        $sql = "ALTER table goods_yahoo add column yahoo_{$id} {$lengs}";
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
        $sql = "SELECT * FROM yahoo_field WHERE field_name='{$change_key}' AND id<>'{$id}'";
        $res = $db->getOne($sql);
        if(empty($res)){

        }else{
            echo 'has';
            return false;
        }
    }
    $sql = "UPDATE yahoo_field SET {$field} = '{$change_key}' WHERE id='{$id}'";
    $res = $db->execute($sql);
    echo "ok";
}

//删除表单
if(isset($_POST['del_field_id'])){
    $del_field_id = $_POST['del_field_id'];
    //删除通用字段属性表
    $sql = "DELETE FROM yahoo_field where id='{$del_field_id}'";
    $res = $db->execute($sql);
    //删除商品通用字段表
    $sql = "ALTER table goods_yahoo drop column yahoo_{$del_field_id}";
    $res = $db->execute($sql);
    echo "ok";
}
?>