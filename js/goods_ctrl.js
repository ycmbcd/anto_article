var app=angular.module('myApp');
app.controller('addgoodsCtrl', ['$scope','$state','$http', function($scope,$state,$http){
//新建商品
    //初始化
    $scope.aaaa = [];
    $scope.bbbb = [];
    $scope.sku_id = "0";    //默认0，数据库无id=0，即使出错也不会影响数据

    //跳转下一条
    $scope.next_add = function(){
        var time=new Date().getTime();
        $state.go('site.addgoods',{data:time});
    }

    //遍历通用字段
    $http.get('/fuck/field/commonfield.php', {params:{select_comfield:"get"}
    }).success(function(data) {
        $scope.all_commonfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //遍历雅虎字段
    $http.get('/fuck/field/yahoofield.php', {params:{select_yahoofield:"get"}
    }).success(function(data) {
        $scope.all_yahoofield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //去掉前后空格
    $scope.trim = function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    //快速赋值
    $scope.fuzhi = function(e,f,f_type,f_id){
        //e为需要input修改的id，f为点击的值，(f_type是操作的表，f_id为操作表的field_id，此两个字段供保存用)
        var dom = document.querySelector('#'+e);
        var o_value = angular.element(dom).val();
        var is_has = o_value.indexOf(f);
        var final_key='';
        if(is_has<0){ 
            f = o_value+' '+f;
            //删掉第一个和最后一个空格
            f = $scope.trim(f);
            angular.element(dom).val(f);
            final_key = f;
            $scope.add_field_go(f_type,f_id,final_key);
        }else{
            f = o_value.replace(f,'');
            //删掉第一个和最后一个空格
            f = $scope.trim(f);
            angular.element(dom).val(f);
            final_key = f;
            $scope.add_field_go(f_type,f_id,final_key);
        }
        
    };

    //查询赋值选项
    $scope.find_option = function(id,from_table){
        $http.get('/fuck/goods/add_goods.php', {params:{field_option:id,from_table:from_table}
        }).success(function(data) {
            if(data==""){
            }else{
                $scope.field_option = data;
                var dom = document.querySelector('#ss'+from_table+id);
                var fuzhi = document.querySelectorAll('.fuzhi');
                angular.element(fuzhi).addClass('hidden');
                angular.element(dom).removeClass('hidden');
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }
    $scope.remove_option = function(){
        //鼠标离开隐藏
        var fuzhi = document.querySelectorAll('.fuzhi');
            angular.element(fuzhi).addClass('hidden');
    }

    //新建sku
    $scope.submit_sku = function(){
        $http.get('/fuck/goods/add_goods.php', {params:{add_sku:$scope.sku_name}
        }).success(function(data) {
            if(data=="has"){
                $scope.plug_alert('danger','该 SKU 已存在。','icon-ban-circle');  
            }else{
                $scope.plug_alert('success','SKU 添加完成。','icon-ok');
                $scope.sku_id=data;     //定义sku_id
                $scope.sku_over = true;
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //公用新建http
    $scope.add_field_go = function(field_name,field_id,field_val){
        $http.get('/fuck/goods/add_goods.php', {params:{add_field:field_name,field_id:field_id,field_val:field_val,sku_id:$scope.sku_id}
        }).success(function(data) {
            if(data=="ok"){
                $scope.plug_alert('success','记录完成。','icon-ok');  
            }else{
                alert(data)
                $scope.plug_alert('danger','系统错误，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //新建通用
    $scope.new_com = function(id){
        var sid = 'new_com_'+id;
        var field_id = 'com_'+id;
        var dom = document.querySelector('#'+sid);
        var field_val = angular.element(dom).val();
        var field_name = 'com';
        $scope.add_field_go(field_name,field_id,field_val);
    }

    $scope.submit_com = function(){
        $scope.com_over = true;
        //取消新建功能
        $scope.new_com = function(){
            return false;
        }
    }
    
    //新建雅虎
    $scope.new_yahoo = function(id){
        var sid = 'new_yahoo_'+id;
        var field_id = 'yahoo_'+id;
        var dom = document.querySelector('#'+sid);
        var field_val = angular.element(dom).val();
        var field_name = 'yahoo';
        $scope.add_field_go(field_name,field_id,field_val);
    }

    $scope.submit_yahoo = function(){
        $scope.yahoo_over = true;
        //取消新建功能
        $scope.new_yahoo = function(){
            return false;
        }
    }

}])