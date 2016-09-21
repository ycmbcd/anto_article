<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询字段
if(isset($_GET['select_amazonfield'])){
    $sql = "SELECT * FROM amazon_field ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}
//同上，用于字段管理
if(isset($_GET['select_field'])){
    $sql = "SELECT * FROM amazon_field ORDER BY id";
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
    $new_field_option = $_POST['new_field_option'];
    if(isset($_POST['new_field_default'])){
        $new_field_default = $_POST['new_field_default'];
    }else{
        $new_field_default = '';
    }
    $new_field = addslashes($new_field);   //防止SQL注入
    $new_field_info = addslashes($new_field_info);
    $new_field_default = addslashes($new_field_default);
    $new_field_option = addslashes($new_field_option);

    //查询是否已存在
    $sql = "SELECT * FROM amazon_field WHERE field_name='{$new_field}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        if($new_field_type=="field_big_txt"){
            $lengs = "text";
            $new_field_default = '';
        }else{
            $lengs = "varchar(255)";
        }
        //插入亚马逊字段属性表
        $sql = "INSERT INTO amazon_field (field_name,field_type,field_require,field_length,field_info,field_default,field_option) VALUES ('{$new_field}','{$new_field_type}','{$new_field_require}','{$new_field_length}','{$new_field_info}','{$new_field_default}','{$new_field_option}')";
        $res = $db->execute($sql);
        //搜索出字段id
        $sql = "SELECT id FROM amazon_field WHERE field_name='{$new_field}'";
        $res = $db->getOne($sql);
        $id = $res['id'];

        //插入商品亚马逊字段表
        $sql = "ALTER table goods_amazon add column amazon_{$id} {$lengs} DEFAULT '{$new_field_default}'";
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
        $sql = "SELECT * FROM amazon_field WHERE field_name='{$change_key}' AND id<>'{$id}'";
        $res = $db->getOne($sql);
        if(empty($res)){

        }else{
            echo 'has';
            return false;
        }
    }
    $sql = "UPDATE amazon_field SET {$field} = '{$change_key}' WHERE id='{$id}'";
    $res = $db->execute($sql);
    echo "ok";
}

//删除表单
if(isset($_POST['del_field_id'])){
    $del_field_id = $_POST['del_field_id'];
    //删除雅虎字段属性表
    $sql = "DELETE FROM amazon_field where id='{$del_field_id}'";
    $res = $db->execute($sql);
    //删除商品雅虎字段表
    $sql = "ALTER table goods_amazon drop column amazon_{$del_field_id}";
    $res = $db->execute($sql);
    echo "ok";
}
?>