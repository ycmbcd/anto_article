<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询tpl
if(isset($_POST['is_tpl'])){
    $folder_id = $_POST['folder_id'];
    $tb_name = $_POST['tb_name'];
    $sql = "SELECT table_tpl FROM folder_table WHERE table_name = '{$tb_name}' AND folder_id = '{$folder_id}'";
    $res = $db->getOne($sql);
    $is_tpl = $res['table_tpl'];
    echo $is_tpl;
}

//查询title
if(isset($_POST['table_title'])){
    $sql = "SELECT id, field_name FROM (SELECT id,field_name FROM common_field UNION SELECT id,field_name FROM yahoo_field) tmp ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//查询表单
if(isset($_POST['show_table'])){
    //$show_table = $_POST['show_table'];
    $sql = "SELECT s.sku,p.*,pp.* FROM goods_common p INNER JOIN goods_yahoo pp ON p.sku_id=pp.sku_id INNER JOIN goods_sku s ON s.id=p.sku_id  ORDER BY p.sku_id DESC";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

?>