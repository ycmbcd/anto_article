var app=angular.module('myApp');

app.controller('showtableCtrl', ['$scope','$rootScope','$state','$stateParams','$http','$log','$modal',function($scope,$rootScope,$state,$stateParams,$http,$log,$modal){
    $scope.folder_id = $stateParams.folder_id;  //文件夹id
    $scope.tb_name = $stateParams.tb_name;  //tb_name 传参赋值
    //ng-repeat之后要做的事情
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
          //下面是在table render完成后执行的js
          $scope.fix_table();
    });

    //修正panel宽度
    $scope.fix_table = function(){
        var fix_table = document.querySelector('.fix_table');
        var fix_panel = document.querySelector('.fix_panel');
        var fix_box = document.querySelector('.fix_box');
        var fix_table_width = angular.element(fix_table).prop('scrollWidth');
        angular.element(fix_panel).css({'width':fix_table_width+30+'px'});
        angular.element(fix_box).css({'width':fix_table_width+60+'px'});
    }

    //修正工具条宽度
    $scope.fix_width = function(){
        var show_view = document.querySelector('#show_view');
        var view_width = angular.element(show_view).prop('offsetWidth'); 

        var tool_bar = document.querySelector('.tool_bar');
        angular.element(tool_bar).css({'width':view_width+'px'});
    }
    $scope.fix_width(); //初始化宽度

    //查询用户每页显示多少
    $scope.user_pageSize =  function(){
        var post_data = {user_pageSize:'get'};
         $http({
            method: 'POST',
            url: '/fuck/table/show_table.php',
            data: post_data
        }).
        success(function(data){
            $scope.pageSize = data;
            $scope.get_count();     //分配页码
            $scope.to_page('1');   //初始化数据
        }).
        error(function(data){

        });
        
    }
    $scope.user_pageSize();   

    //修改分页参数
    $scope.change_pageSize = function(){
        if($scope.change_size==null ){
            $scope.plug_alert('danger','警告，不能为空','icon-ban-circle');
            return false;
        }else{
            //更新页码
            $http.get('/fuck/table/show_table.php', {params:{change_pageSize:$scope.change_size}
            }).success(function(data) {
                //表示
                $scope.user_pageSize();
            }).error(function(data) {
                alert("系统错误，请联系管理员。");
            });
        }
    }

    //查询总数_分页组件
    $scope.get_count = function(){
        var post_data = {sku_count:'get'};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
            //数据获取总数
            $scope.all_num = data;
            //分页参数
            $scope.pages = Math.ceil($scope.all_num / $scope.pageSize); //分页数
            $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
            $scope.pageList = [];
            $scope.pageOption = [];
            $scope.selPage = 1; //默认第一页
            //默认上一页不能点
            $scope.pre_overflow = true;

            //分页要repeat的数组
            for (var i = 0; i < $scope.newPages; i++) {
                $scope.pageList.push(i + 1);
                $scope.jumpList = $scope.pageList;
            }
            if($scope.pages > 5){
                $scope.pageList.push('... '+$scope.pages); 
                $scope.jumpList = $scope.pageList;
            }

            //分页option要的数组
            for (var i = 0; i < $scope.pages; i++) {
                $scope.pageOption.push(i + 1);
            }

            //跳页
            $scope.clickOption = function(){
                if($scope.selectOption==null){
                    return false;
                }
                if($scope.selectOption <'3'){
                    $scope.pageList = $scope.jumpList;
                    $scope.selectPage($scope.selectOption);
                }else{
                    $scope.selectPage($scope.selectOption);
                }
            }

            //打印当前选中页索引
            $scope.selectPage = function (page) {

                $scope.pre_overflow = false;
                $scope.next_overflow = false;

                //判断首尾页
                if(page=="1 ..."){
                    page=1;
                    $scope.get_count();
                }else if(page=="... "+$scope.pages){
                    page=$scope.pages;
                }

                //跳页响应
                $scope.selectOption=page


                //提示到头了
                if(page < 2){
                    $scope.pre_overflow = true;
                }else if(page > $scope.pages-1){
                    $scope.next_overflow = true;
                }

                //不能小于1大于最大
                if(page<1){
                    return false;
                }else if(page > $scope.pages){
                    return false;
                }

                //最多显示分页数5 #mid状态
                if (page > 2) {
                    //因为只显示5个页数，大于2页开始分页转换
                    var newpageList = [];
                    for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
                        newpageList.push(i + 1);
                    }
                    
                    //中间的
                    if(page > 3 && page <$scope.pages+1){
                        newpageList.unshift('1 ...');
                        newpageList.push('... '+$scope.pages);
                    }
                    //3
                    if(page == 3){
                        newpageList.push('... '+$scope.pages);
                    }
                    //p-3 末尾变
                    if(page == $scope.pages-3){
                        newpageList.pop();
                        newpageList.push($scope.pages);
                    }
                    //p-2 末尾移除
                    if(page > $scope.pages-3){
                        newpageList.pop();
                    }
                    
                    $scope.pageList = newpageList;
                    
                }
                if(page == 4){  //4开始进入mid状态
                    $scope.pageList.shift('1 ...');
                    $scope.pageList.unshift(1);
                }


                $scope.selPage = page;
                $scope.isActivePage(page);
                console.log("选择的页：" + page);
                //获取第page页数据
                $scope.to_page(page);
            };
            //设置当前选中页样式
            $scope.isActivePage = function (page) {
                return $scope.selPage == page;
            };
            //上一页
            $scope.Previous = function () {
                $scope.selectPage($scope.selPage - 1);
            }
            //下一页
            $scope.Next = function () {
                $scope.selectPage($scope.selPage + 1);
            };
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });         
    }
    

    //获取序列内容_分页查询
    $scope.to_page = function(page){
        //计算分页开始值
        start = (page - 1)*$scope.pageSize;

        //获取此表id
        var post_data = {table_id:'get',folder_id:$scope.folder_id,tb_name:$scope.tb_name};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            $scope.table_id = data;
            var post_data = {show_table:$scope.table_id,tpl:$scope.tb_tpl,start:start,page_size:$scope.pageSize};
            $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
                $scope.show_table = data;
            }).error(function(data) {  
                alert("系统错误，请联系管理员。");
            });
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });           
    }


    //获取序列标题
    $scope.get_title = function(){    
        //获取此表id
        var post_data = {table_id:'get',folder_id:$scope.folder_id,tb_name:$scope.tb_name};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            $scope.table_id = data;
            var post_data = {table_title:$scope.table_id};
            $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
                $scope.table_title = data;
            }).error(function(data) {  
                alert("系统错误，请联系管理员。");
            }); 
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });   
    }
    $scope.get_title();  //初始化表头

    //查询是否有模板
    var post_data = {is_tpl:'post',folder_id:$scope.folder_id,tb_name:$scope.tb_name};
    $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
        $scope.tb_tpl = data;
        if($scope.tb_tpl == '无模板'){
            $scope.plug_alert('danger','无模板，请添加模板再操作！','icon-ban-circle');
            $state.go('site.systable');
            $scope.select_folder_all();
        }
    }).error(function(data) {  
        alert("系统错误，请联系管理员。");
    }); 

    //查询此表字段序列
    $scope.table_field = function(tpl){
        //查询通用字段
        $http.get('/fuck/field/commonfield.php', {params:{select_comfield:"get"}
        }).success(function(data) {
            $scope.common_fields = data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
        tpl=tpl+'field';    //比如tpl为yahoo，此处yahoofield

        //查询tpl字段
        $http.get('/fuck/field/'+tpl+'.php', {params:{select_field:"get"}
        }).success(function(data) {
            $scope.tpl_fields = data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });

        //初始化选择序列字段
        $scope.my_select = [];
        $scope.my_select_name = []; //用于前台展示
    }

    //选择序列字段
    $scope.select = function(front,id,name,event){ 
        if(front=="sku"){
            field = id;
        }else{
            field = front+'_'+id;   //前缀     
        }
        //alert(name)
        var action = event.target;
        if(action.checked){//选中，就添加
            if($scope.my_select.indexOf(field) == -1){//不存在就添加
                $scope.my_select.push(field);
                $scope.my_select_name.push(name);
            }
        }else{ //去除就删除com_select里
            var idx = $scope.my_select.indexOf(field);
            if( idx != -1){ //存在就删除
                $scope.my_select.splice(idx,1);
                $scope.my_select_name.splice(idx,1);
            }
        }
    };

    //提交，更新此表的字段序列
    $scope.sub_myfields = function(){
        if($scope.my_select==''){
            $scope.plug_alert('danger','请选择再试。','icon-ban-circle');
            return false;
        }
        var post_data = {my_fields:$scope.my_select,table_id:$scope.table_id,my_fields_title:$scope.my_select_name};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            var folder_id = $scope.folder_id;
            var tb_name = $scope.tb_name;
            //刷新
            var time=new Date().getTime();
            $state.go('site.show_table',{folder_id:folder_id,tb_name:tb_name,time:time});
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });

    }

    //表格下载
    $scope.down_tb = function(){
        $http.get('/fuck/table/show_table.php', {params:{down_tb:$scope.tb_name,tpl:$scope.tb_tpl}
        }).success(function(data) {
            if(data=='ok'){
                window.location="/down/"+$scope.tb_name+".xlsx";
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //选择下载
    $scope.down_select_field = function(){
        var post_data = {down_select_field:$scope.my_select,tpl:$scope.tb_tpl,select_name:$scope.my_select_name};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
            if(data=='ok'){
                window.location="/down/part_fields.xlsx";
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //双击修改
    $scope.change_field = function(sku_id,field,old_value){
        // 判断字段类型
        var field_tb = '';
        if(field.indexOf('sku') !== -1){
            $scope.plug_alert('danger','SKU 不能在这里修改。','icon-ban-circle');
            return false;
        }else if(field.indexOf('com') !== -1){
            field_tb ='goods_common';
        }else if(field.indexOf('yahoo') !== -1){
            field_tb ='goods_yahoo';
        }else if(field.indexOf('amazon') !== -1){
            field_tb ='goods_amazon';
        }else if(field.indexOf('rakuten') !== -1){
            field_tb ='goods_rakuten';
        }

        var time=new Date().getTime();
        var sid = field+'_'+sku_id;

        var dom = document.querySelector('#'+sid);
        var change_key = angular.element(dom).val();
        if(angular.element(dom).hasClass('red')==1){
            //修改字段
            var post_data = {sku_id:sku_id,field:field,field_tb:field_tb,change_key:change_key};
            $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
                if(data=='ok'){
                    $scope.plug_alert('success','字段修改完成。','icon-ok');
                }else{
                    $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
                }
            }).error(function(data) {  
                alert("系统错误，请联系管理员。");
            });  
            angular.element(dom).attr('readonly','readonly').removeClass('red');
        }else{
            //标记编辑中
            angular.element(dom).removeAttr('readonly').addClass('red');
        }

    }

    
}])