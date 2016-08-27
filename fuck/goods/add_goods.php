<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询字段
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
        echo $res['id'];
    }else{
    	echo 'has';
    }
}

?>