var app=angular.module('myApp');
app.controller('addgoodsCtrl', ['$scope','$state','$http', function($scope,$state,$http){
//新建商品
    //初始化
    $scope.aaaa = [];
    $scope.bbbb = [];
    $scope.cccc = [];
    $scope.dddd = [];
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

    //遍历乐天字段
    $http.get('/fuck/field/rakutenfield.php', {params:{select_rakutenfield:"get"}
    }).success(function(data) {
        $scope.all_rakutenfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //去掉前后空格
    $scope.trim = function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }



    //快速赋值
    $scope.fuzhi = function(f,f_type,f_id,xxxx,index){
        //f为点击的值，(f_type是操作的表，f_id为操作表的field_id，此两个字段供保存用),index为input的index
        if(xxxx=='aaaa'){
            var o_value = $scope.aaaa[index];
        }else if(xxxx=='bbbb'){
            var o_value = $scope.bbbb[index];
        }else if(xxxx=='cccc'){
            var o_value = $scope.cccc[index];
        }else if(xxxx=='dddd'){
            var o_value = $scope.dddd[index];
        }
        if(typeof(o_value)=='undefined'){   //默认情况下为空，则会undefined，这时重新定义原始值为空
            o_value ='';
        }
        var is_has = o_value.indexOf(f);
        var final_key='';
        if(is_has<0){ 
            f = o_value+' '+f;
            //删掉第一个和最后一个空格
            f = $scope.trim(f);
            final_key = f;
            if(xxxx=='aaaa'){
                $scope.aaaa[index]= final_key;
            }else if(xxxx=='bbbb'){
                $scope.bbbb[index]= final_key;
            }else if(xxxx=='cccc'){
                $scope.cccc[index]= final_key;
            }else if(xxxx=='dddd'){
                $scope.dddd[index]= final_key;
            }
            $scope.add_field_go(f_type,f_id,final_key);
        }else{
            f = o_value.replace(f,'');
            //删掉第一个和最后一个空格
            f = $scope.trim(f);
            final_key = f;
            if(xxxx=='aaaa'){
                $scope.aaaa[index]= final_key;
            }else if(xxxx='bbbb'){
                $scope.bbbb[index]= final_key;
            }else if(xxxx='cccc'){
                $scope.cccc[index]= final_key;
            }else if(xxxx='dddd'){
                $scope.dddd[index]= final_key;
            }
            $scope.add_field_go(f_type,f_id,final_key);
        }
        
    };

    //查询赋值选项
    $scope.find_option = function(id,from_table){
        $scope.remove_option();
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

    //新建乐天
    $scope.new_rakuten = function(id){
        var sid = 'new_rakuten_'+id;
        var field_id = 'rakuten_'+id;
        var dom = document.querySelector('#'+sid);
        var field_val = angular.element(dom).val();
        var field_name = 'rakuten';
        $scope.add_field_go(field_name,field_id,field_val);
    }

    $scope.submit_rakuten = function(){
        $scope.rakuten_over = true;
        //取消新建功能
        $scope.new_rakuten = function(){
            return false;
        }
    }

}])