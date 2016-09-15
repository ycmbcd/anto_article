<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//添加sku
if(isset($_GET['add_sku'])){
	$sku = $_GET['add_sku'];
	$sku = addslashes($sku);
	//查询是否已存在
    $sql = "SELECT * FROM goods_sku WHERE sku='{$sku}'";
    $res = $db->getOne($sql);
    if(empty($res)){
    	$sql = "INSERT INTO goods_sku (sku) VALUES ('{$sku}')";
        $res = $db->execute($sql);
        //查询sku_id
        $sql = "SELECT id FROM goods_sku WHERE sku='{$sku}'";
        $res = $db->getOne($sql);
        $sku_id = $res['id'];
        //占位goods_common
        $sql = "INSERT INTO goods_common (sku_id) VALUES ('{$sku_id}')";
        $res = $db->execute($sql);
        //占位goods_yahoo
        $sql = "INSERT INTO goods_yahoo (sku_id) VALUES ('{$sku_id}')";
        $res = $db->execute($sql);
        echo $sku_id;
    }else{
    	echo 'has';
    }
}

//添加字段
if(isset($_GET['add_field'])){
    $add_field = $_GET['add_field'];
    $field_id = $_GET['field_id'];
    $field_val = $_GET['field_val'];
    $field_val = addslashes($field_val);
    $sku_id = $_GET['sku_id'];
    if($add_field == 'com'){
        $goods_table = 'goods_common';
    }else if($add_field == 'yahoo'){
        $goods_table = 'goods_yahoo';
    }
    //更新表
    $sql = "UPDATE $goods_table SET $field_id='{$field_val}' where sku_id='{$sku_id}'";
    $res = $db->execute($sql);
    echo "ok";
}

//查询赋值选项
if(isset($_GET['field_option'])){
    $id = $_GET['field_option'];
    $from_table = $_GET['from_table'];
    $from_table = $from_table.'_field';
    $sql = "SELECT field_option FROM $from_table where id='{$id}'";
    $res = $db->getOne($sql);
    $arr = explode(',', $res['field_option']);
    echo json_encode($arr);
}
?>