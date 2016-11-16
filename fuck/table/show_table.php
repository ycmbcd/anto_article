<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询用户分页
if(isset($_POST['user_pageSize'])){
    $user_pageSize = $_POST['user_pageSize'];
    $sql = "SELECT page_size FROM user_company WHERE u_name = '{$u_name}'";
    $res =  $db->getOne($sql);
    echo $res['page_size'];
}

//更新用户分页
if(isset($_GET['change_pageSize'])){
    $change_pageSize = $_GET['change_pageSize'];
    $sql = "UPDATE user_company SET page_size = '{$change_pageSize}' WHERE u_name = '{$u_name}'";
    $res = $db->execute($sql);
    echo "ok";
}

//查询table_id
if(isset($_POST['table_id'])){
    $folder_id = $_POST['folder_id'];
    if($folder_id=='0'){
        echo '0';
    }else{
        $tb_name = $_POST['tb_name'];
        $sql = "SELECT id FROM folder_table WHERE folder_id = '{$folder_id}' AND table_name = '{$tb_name}'";
        $res = $db->getOne($sql);
        $id = $res['id'];
        echo $id;
    }
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

//查询sku总数
if(isset($_POST['sku_count'])){
    $table_id = $_POST['sku_count'];
    if($table_id=='edit'){//编辑页面
        //判断是否有筛选过滤
        $sql = "SELECT count(1) as bcd FROM filter_sql WHERE is_click='1'";
        $res = $db->getOne($sql);
        $click_count = $res['bcd'];
        if(empty($click_count) or $click_count=='0'){
            $sql1 = "SELECT count(1) as cc FROM goods_sku";
        }else{
            $sql1 = "SELECT count(1) as cc FROM goods_sku WHERE is_click='1'";
        }
        $res1 = $db->getOne($sql1);
        echo $res1['cc'];
    }else{
        $sql = "SELECT count(1) as cc FROM goods_sku";
        $res = $db->getOne($sql);
        echo $res['cc'];
    }
    
}

//单个字段修改
if(isset($_POST['change_key'])){
    $sku_id = $_POST['sku_id'];
    $field = $_POST['field'];
    $field_tb = $_POST['field_tb'];
    $change_key = $_POST['change_key'];
    $change_key = addslashes($change_key);   //防止SQL注入

    $sql = "UPDATE $field_tb SET {$field} = '{$change_key}' WHERE sku_id='{$sku_id}'";
    $res = $db->execute($sql);
    echo "ok";
}

//查询表单
if(isset($_POST['show_table'])){
    $table_id = $_POST['show_table'];
    $page_size = $_POST['page_size'];
    $start = $_POST['start'];

    if($table_id == '0'){ //编辑商品页面
        //重置勾选sku
        $sql0 = "UPDATE goods_sku SET is_click='0'";
        $res0 = $db->execute($sql0);
        //查询是否有筛选
        $sql = "SELECT count(1) as bcd FROM filter_sql WHERE is_click='1'";
        $res = $db->getOne($sql);
        $click_count = $res['bcd'];
        if(empty($click_count) or $click_count=='0'){
            //如果没有筛选，则输出所有的sku
            $sql = "SELECT id,sku FROM goods_sku limit {$start},{$page_size}";
            $res = $db->getAll($sql);
            echo json_encode($res);
            die;
        }
        else{
            //如果有筛选，则从筛选条件来筛选sku
            $sql = "SELECT concat(filter_sql,' and ') as ycm FROM filter_sql WHERE is_click='1'";
            $res = $db->getAll($sql);
            $sql_line = '';
            foreach ($res as $value) {
                $sql_line = $sql_line.$value['ycm'];
            }   
            $sql_line = rtrim($sql_line, " and ");

            $sql = "SELECT goods_sku.id,goods_sku.sku FROM goods_sku inner join goods_common on goods_sku.id=goods_common.id inner join goods_yahoo on goods_sku.id=goods_yahoo.sku_id inner join goods_amazon on goods_sku.id=goods_amazon.id inner join goods_rakuten on goods_sku.id=goods_rakuten.id WHERE $sql_line limit {$start},{$page_size}";
            $res = $db->getAll($sql);

            //勾选sku
            $sql1 = "UPDATE goods_sku inner join goods_common on goods_sku.id=goods_common.id inner join goods_yahoo on goods_sku.id=goods_yahoo.sku_id inner join goods_amazon on goods_sku.id=goods_amazon.id inner join goods_rakuten on goods_sku.id=goods_rakuten.id SET goods_sku.is_click = '1' WHERE $sql_line";
            $res1 = $db->execute($sql1);

            //输出结果
            echo json_encode($res);
            die;
        }
    }

    //模板页面
    $tpl = $_POST['tpl'];
    if($tpl == 'yahoo'){
        $tpl = 'goods_yahoo';
    }else if($tpl == 'rakuten'){
        $tpl = 'goods_rakuten';
    }else if($tpl == 'amazon'){
        $tpl = 'goods_amazon';
    }

    $sql = "SELECT my_fields FROM folder_table WHERE id = '{$table_id}'";
    $res = $db->getOne($sql);
    $my_fields = $res['my_fields'];
    $sql = "SELECT p.sku_id,$my_fields FROM goods_common p,$tpl pp,goods_sku ppp WHERE p.sku_id=pp.sku_id AND p.sku_id=ppp.id limit {$start},{$page_size}";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//查询单个sku标题
if(isset($_POST['all_title'])){
    $sql = "SELECT field_name FROM common_field UNION SELECT field_name FROM yahoo_field UNION SELECT field_name FROM rakuten_field UNION SELECT field_name FROM amazon_field";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//查询单个sku所有信息
if(isset($_POST['sku_info'])){
    $sku_id = $_POST['sku_info'];
    $sql = "SELECT * FROM goods_common,goods_yahoo,goods_rakuten,goods_amazon WHERE goods_common.sku_id='{$sku_id}' and goods_yahoo.sku_id='{$sku_id}' and goods_rakuten.sku_id='{$sku_id}' and goods_amazon.sku_id='{$sku_id}'";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//下载表单
if(isset($_GET['down_tb'])){
    $down_tb = $_GET['down_tb'];
    $tpl = $_GET['tpl'];
    if($tpl == 'yahoo'){
        $tpl = 'goods_yahoo';
    }else if($tpl == 'rakuten'){
        $tpl = 'goods_rakuten';
    }else if($tpl == 'amazon'){
        $tpl = 'goods_amazon';
    }

    require_once($dir."/./PHPExcel/PHPExcel.php");//引入PHPExcel
    //加大响应
    set_time_limit(0); 
    ini_set("memory_limit", "1024M");
    //制作时间
    date_default_timezone_set("Asia/Shanghai");
    // $now_time = date("Y-m-d H.i.s");

    //PHPExcel
    $objPHPExcel = new PHPExcel();
    $objSheet = $objPHPExcel->getActiveSheet();
    $objSheet->setTitle($down_tb.' '.$now_time);//表名
    $objPHPExcel->getActiveSheet()->getStyle('1')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_WHITE);//前景色
    $objSheet->getStyle('1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
    $objSheet->getStyle('1')->getFill()->getStartColor()->setRGB('3D3F42');//背景色

    $objSheet->getDefaultRowDimension()->setRowHeight(18);   //单元格高
    $objSheet->freezePane('A2');//冻结表头
    //查询表字段和表头
    $sql = "SELECT my_fields,my_fields_title FROM folder_table WHERE table_name = '{$down_tb}'";
    $res = $db->getOne($sql);
    $my_fields = $res['my_fields'];
    $my_fields_title = $res['my_fields_title'];
    $arr = explode(',', $my_fields_title);
    $arr2 = array($arr);

    $sql = "SELECT $my_fields FROM goods_common p,$tpl pp,goods_sku ppp WHERE p.sku_id=pp.sku_id AND p.sku_id=ppp.id ";
    $res = $db->getAll($sql);
    $final = array_merge($arr2, $res);

    //fromArray字符串
    class PHPExcel_Cell_MyValueBinder extends PHPExcel_Cell_DefaultValueBinder
        implements PHPExcel_Cell_IValueBinder 
    { 
        public function bindValue(PHPExcel_Cell $cell, $value = null) 
        { 
            // sanitize UTF-8 strings 
            if (is_string($value)) { 
                $value = PHPExcel_Shared_String::SanitizeUTF8($value); 
            } 
            // Implement your own override logic 
            if (is_string($value) && $value[0] == '0') { 
                $cell->setValueExplicit($value, PHPExcel_Cell_DataType::TYPE_STRING); 
                return true; 
            } 
            // Not bound yet? Use default value parent... 
            return parent::bindValue($cell, $value); 
        } 
    }

    PHPExcel_Cell::setValueBinder( new PHPExcel_Cell_MyValueBinder() );

    //填充内容
    $objPHPExcel->getActiveSheet()->fromArray(
        $final,// 赋值的数组
        NULL, // 忽略的值,不会在excel中显示
        'A1' // 赋值的起始位置
    );

    // $objPHPExcel->getActiveSheet()->getColumnDimension()->setAutoSize(true);
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save($dir."/../down/$down_tb.xlsx");   //保存在服务器
    echo "ok";
}

//选择下载
if(isset($_POST['down_select_field'])){
    $my_fields = $_POST['down_select_field'];
    $tpl = $_POST['tpl'];
    $my_fields_title = $_POST['select_name'];
    if($tpl == 'yahoo'){
        $tpl = 'goods_yahoo';
    }else if($tpl == 'rakuten'){
        $tpl = 'goods_rakuten';
    }else if($tpl == 'amazon'){
        $tpl = 'goods_amazon';
    }
    require_once($dir."/./PHPExcel/PHPExcel.php");//引入PHPExcel
    //加大响应
    set_time_limit(0); 
    ini_set("memory_limit", "1024M");
    //制作时间
    date_default_timezone_set("Asia/Shanghai");
    $now_time=date("Y-m-d H.i.s");
    //PHPExcel
    $objPHPExcel = new PHPExcel();
    $objSheet = $objPHPExcel->getActiveSheet();
    $objSheet->setTitle($down_tb.' '.$now_time);//表名
    $objPHPExcel->getActiveSheet()->getStyle('1')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_WHITE);//前景色
    $objSheet->getStyle('1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
    $objSheet->getStyle('1')->getFill()->getStartColor()->setRGB('3D3F42');//背景色

    $objSheet->getDefaultRowDimension()->setRowHeight(18);   //单元格高
    $objSheet->freezePane('A2');//冻结表头
    //表头
    $arr = explode(',', $my_fields_title);
    $arr2 = array($arr);

    $sql = "SELECT $my_fields FROM goods_common p,$tpl pp,goods_sku ppp WHERE p.sku_id=pp.sku_id AND p.sku_id=ppp.id ";
    $res = $db->getAll($sql);
    $final = array_merge($arr2, $res);

    //fromArray字符串
    class PHPExcel_Cell_MyValueBinder extends PHPExcel_Cell_DefaultValueBinder
        implements PHPExcel_Cell_IValueBinder 
    { 
        public function bindValue(PHPExcel_Cell $cell, $value = null) 
        { 
            // sanitize UTF-8 strings 
            if (is_string($value)) { 
                $value = PHPExcel_Shared_String::SanitizeUTF8($value); 
            } 
            // Implement your own override logic 
            if (is_string($value) && $value[0] == '0') { 
                $cell->setValueExplicit($value, PHPExcel_Cell_DataType::TYPE_STRING); 
                return true; 
            } 
            // Not bound yet? Use default value parent... 
            return parent::bindValue($cell, $value); 
        } 
    }

    PHPExcel_Cell::setValueBinder( new PHPExcel_Cell_MyValueBinder() );

    //填充内容
    $objPHPExcel->getActiveSheet()->fromArray(
        $final,// 赋值的数组
        NULL, // 忽略的值,不会在excel中显示
        'A1' // 赋值的起始位置
    );

    // $objPHPExcel->getActiveSheet()->getColumnDimension()->setAutoSize(true);
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save($dir."/../down/part_fields.xlsx");   //保存在服务器
    echo "ok";

}

//获取查询字段类型 sku，com，yahoo...
if(isset($_POST['cg_type'])){
    $cg_type = $_POST['cg_type'];
    $cg_type = $cg_type.'_field';
    $sql = "SELECT id,field_name FROM $cg_type ORDER BY ID";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//字段修改
if(isset($_POST['add_filter'])){
    $filter_name = $_POST['add_filter'];

    //查询是否重名
    $sql = "SELECT * FROM filter_sql WHERE filter_name='{$filter_name}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        $cgg_type = $_POST['cgg_type'];
        $cgg_field = $_POST['cgg_field'];
        $txt_method = $_POST['txt_method'];
        $filter_txt = $_POST['filter_txt'];
        if($txt_method=='0'){   //包含
            $txt_method = 'like';
            $filter_txt = '%'.$filter_txt.'%';
        }else if($txt_method=='1'){ //大于
            $txt_method = '>';
        }else if($txt_method=='2'){ //小于
            $txt_method = '<';
        }else if($txt_method=='3'){ //等于
            $txt_method = '=';
            $filter_txt = '"'.$filter_txt.'"';
        }

        if($cgg_type == 'sku'){
            $sql = "INSERT INTO filter_sql(filter_name,filter_sql) VALUES ('$filter_name','goods_sku.sku {$txt_method} \'{$filter_txt}\'')";
            $res = $db->execute($sql);
            echo "ok";
        }else{
            $tt_table = 'goods_'.$cgg_type;
            $tt_field = $cgg_type.'_'.$cgg_field;
            // $sql = "INSERT INTO filter_sql(filter_name,filter_sql) VALUES ('$filter_name','SELECT * FROM {$tt_table} WHERE {$tt_field} {$txt_method} {$filter_txt}')";
            $sql = "INSERT INTO filter_sql(filter_name,filter_sql) VALUES ('$filter_name','{$tt_table}.{$tt_field} {$txt_method} {$filter_txt}')";
            $res = $db->execute($sql);
            echo "ok";
        }


    }else{
        echo "has";     
    }

}

//查询过滤条件
if(isset($_POST['get_all_filter'])){
    $sql = "SELECT * FROM filter_sql ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//点击过滤条件
if(isset($_POST['click_filter'])){
    $click_filter = $_POST['click_filter'];
    $is_click = $_POST['is_click'];
    if($is_click=='1'){
        $sql = "UPDATE filter_sql SET is_click='1' WHERE id='{$click_filter}'";
    }else if($is_click=='0'){
        $sql = "UPDATE filter_sql SET is_click='0' WHERE id='{$click_filter}'";
    }
    $res = $db->execute($sql);
    echo 'ok';
}

//删除过滤条件
if(isset($_POST['del_filter'])){
    $filter_id = $_POST['del_filter'];
    $sql = "DELETE FROM filter_sql WHERE id='{$filter_id}'";
    $res = $db->execute($sql);
    echo 'ok';
}

//批处理
if(isset($_POST['batch_field'])){
    $cgg_type = $_POST['cgg_type'];
    $cgg_field = $_POST['cgg_field'];
    $txt_method = $_POST['txt_method'];
    $origin_txt = $_POST['origin_txt'];
    $new_txt = $_POST['new_txt'];
    //如果是sku修改
    if($cgg_type == 'sku'){
        echo 'sku';
    }else{

    }
    // $sql = "";
    // $res = $db->execute($sql);
    // echo 'ok';
}
?>