<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询赋值选项
if(isset($_GET['user_sku'])){
    $user_sku = $_GET['user_sku'];
    $sql = "SELECT * FROM goods_sku WHERE sku LIKE '%{$user_sku}%' ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//重命名sku
if(isset($_GET['re_sku'])){
    $re_id = $_GET['re_id'];
    $re_sku = addslashes($_GET['re_sku']);
    //查询是否已存在
    $sql = "SELECT * FROM goods_sku WHERE sku='{$re_sku}'";
    $res = $db->getOne($sql);
    if(empty($res)){
        $sql = "UPDATE goods_sku SET sku = '{$re_sku}' WHERE id = '{$re_id}'";
        $res = $db->execute($sql);
        echo 'ok';
    }else{
        echo 'has';
    }
}

//删除sku
if(isset($_GET['del_sku'])){
    $del_id = $_GET['del_sku'];
    $sql = "DELETE FROM goods_sku WHERE id = '{$del_id}'";
    $res = $db->execute($sql);
    $sql = "DELETE FROM goods_common WHERE sku_id = '{$del_id}'";
    $res = $db->execute($sql);
    $sql = "DELETE FROM goods_yahoo WHERE sku_id = '{$del_id}'";
    $res = $db->execute($sql);
    $sql = "DELETE FROM goods_rakuten WHERE sku_id = '{$del_id}'";
    $res = $db->execute($sql);
    $sql = "DELETE FROM goods_amazon WHERE sku_id = '{$del_id}'";
    $res = $db->execute($sql);
    echo 'ok';
}