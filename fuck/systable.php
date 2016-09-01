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
        // //查询出table_id
        // $sql = "SELECT id FROM folder_table WHERE table_name='{$new_table}' and folder_id='{$folder_id}'";
        // $res = $db->getOne($sql);
        // $table_id = 'table_'.$res['id'];
        // //新建表单show表
        // $sql = "CREATE table $table_id(
        //         id int(9) auto_increment primary key,
        //         my_fields varchar(255))engine=InnoDB default charset='utf8'";
        // $res = $db->execute($sql);          
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

//修改模板
if(isset($_GET['change_tpl'])){
    $change_tpl = $_GET['change_tpl'];
    $change_table_id = $_GET['change_table_id'];
    $sql = "UPDATE folder_table SET table_tpl='{$change_tpl}' where id='{$change_table_id}'";
    $res = $db->execute($sql);
    echo "ok";
}

//删除表单
if(isset($_POST['del_table_id'])){
    $del_table_id = $_POST['del_table_id'];
    $sql = "DELETE FROM folder_table where id='{$del_table_id}'";
    $res = $db->execute($sql);
    //删除show表
    // $table_id = 'table_'.$del_table_id;
    // //新建表单show表
    // $sql = "DROP table $table_id";
    // $res = $db->execute($sql);
    echo "ok";
}
?>