<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");


//查询赋值选项
if(isset($_GET['user_sku'])){
    $user_sku = $_GET['user_sku'];
    $sql = "SELECT * FROM goods_sku where sku like '%{$user_sku}%'";
    $res = $db->getAll($sql);
    echo json_encode($res);
}
?>