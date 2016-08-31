<?php
$dir = dirname(__FILE__);
require_once($dir."/./header.php");

//查询文件夹（包括表单）用于侧栏展示
if(isset($_GET['folder_all'])){
    $sql = "SELECT folder.id,folder_table.folder_id,folder.folder_name,group_concat(table_name ORDER BY folder_table.id DESC separator ',')AS tbname FROM folder_table, folder WHERE folder_table.folder_id=folder.id GROUP BY folder.folder_name ORDER BY folder.id DESC";
    $res = $db->getAll($sql);
    $arr = array();
    $arr1 = array();
    $arr2 = array();
    foreach ($res as $key => $value) {
        $arr1["folder_id"]=$value["id"];
        $arr1["folder_name"]=$value["folder_name"];
        $arr2 = explode(',',$value["tbname"]);
        $arr1["tbname"]=$arr2;
        array_push($arr,$arr1);
    }
    echo json_encode($arr);
}

//查询文件夹
if(isset($_GET['folder'])){
    $sql = "SELECT * FROM folder";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//添加文件夹
if(isset($_POST['new_folder'])){
	$new_folder = $_POST['new_folder'];
	$new_folder = addslashes($new_folder);
	$sql = "INSERT INTO folder (folder_name) VALUES ('{$new_folder}')";
    $res = $db->execute($sql);
    $sql = "SELECT id FROM folder WHERE folder_name='{$new_folder}'";
    $res = $db->getOne($sql);
    $folder_id = $res['id'];
    // //插入默认表单(仅供占位)
    // $sql = "INSERT INTO folder_table (table_name,folder_id) VALUES ('***','{$folder_id}')";
    // $res = $db->execute($sql);
    echo "ok";
}

//修改文件夹
if(isset($_POST['re_folder'])){
    $re_folder = $_POST['re_folder'];
    $click_key = $_POST['click_key'];
    $re_folder = addslashes($re_folder);
    $click_key = addslashes($click_key);
    //查找重复
    $sql = "SELECT * FROM folder WHERE folder_name='{$re_folder}'";
    $res = $db->getOne($sql);
    if(empty($res)){
        $sql = "UPDATE folder SET folder_name='{$re_folder}' WHERE folder_name='{$click_key}'";
        $res = $db->execute($sql);
        echo "ok";
    }else{
        echo "has";
    }
}

//删除文件夹
if(isset($_POST['del_folder'])){
    $del_folder = $_POST['del_folder'];
    $sql = "SELECT id FROM folder WHERE folder_name='{$del_folder}'";
    $res = $db->getOne($sql);
    $folder_id = $res['id'];
    $sql = "SELECT * FROM folder_table WHERE folder_id='{$folder_id}'";
    $res = $db->getOne($sql);
    if(empty($res)){
        $sql = "DELETE FROM folder WHERE folder_name='{$del_folder}'";
        $res = $db->execute($sql);
        $sql = "DELETE FROM folder_table WHERE folder_id='{$folder_id}'";
        $res = $db->execute($sql);
        echo "ok";
    }else{
        echo "has";
    } 
}
?>