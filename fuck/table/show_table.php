<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询table_id
if(isset($_POST['table_id'])){
    $folder_id = $_POST['folder_id'];
    $tb_name = $_POST['tb_name'];
    $sql = "SELECT id FROM folder_table WHERE folder_id = '{$folder_id}' AND table_name = '{$tb_name}'";
    $res = $db->getOne($sql);
    $id = $res['id'];
    echo $id;
}

//查询tpl
if(isset($_POST['is_tpl'])){
    $folder_id = $_POST['folder_id'];
    $tb_name = $_POST['tb_name'];
    $sql = "SELECT table_tpl FROM folder_table WHERE table_name = '{$tb_name}' AND folder_id = '{$folder_id}'";
    $res = $db->getOne($sql);
    $is_tpl = $res['table_tpl'];
    echo $is_tpl;
}

//更新my_fields字段序列
if(isset($_POST['my_fields'])){
    $my_fields = $_POST['my_fields'];
    $table_id = $_POST['table_id'];
    $my_fields_title = $_POST['my_fields_title'];
    $sql = "UPDATE folder_table SET my_fields = '{$my_fields}',my_fields_title = '{$my_fields_title}' WHERE id = '{$table_id}'";
    $res = $db->execute($sql);
    echo "ok";
}

//查询title序列名
if(isset($_POST['table_title'])){
    $table_id = $_POST['table_title'];
    $sql = "SELECT my_fields_title FROM folder_table WHERE id = '{$table_id}'";
    $res = $db->getOne($sql);
    $arr = explode(',',$res['my_fields_title']);
    echo json_encode($arr);
}

//查询表单
if(isset($_POST['show_table'])){
    $table_id = $_POST['show_table'];
    $sql = "SELECT my_fields FROM folder_table WHERE id = '{$table_id}'";
    $res = $db->getOne($sql);
    $my_fields = $res['my_fields'];
    $sql = "SELECT $my_fields FROM goods_common p,goods_yahoo pp WHERE p.sku_id=pp.sku_id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

?>