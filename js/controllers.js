var app=angular.module('myApp');
//登陆控制器
app.controller('loginCtrl', ['$rootScope','$scope','$state','$http',function ($rootScope,$scope,$state,$http) {
    $rootScope.bg = true;   //设置背景
    $scope.save = function(){
        var post_data = {u_num:$scope.u_num,u_pwd:$scope.u_pwd};
        if($scope.loginForm.$valid){
            $http.post('/fuck/login.php', post_data).success(function(data) {  
                if(data=='go'){
                    $state.go('site');  //跳转到main
                }else{
                    alert('用户名或密码不正确'); //%
                }
            }).error(function(data) {  
                alert("系统错误，请联系管理员。")   // %
            });  
        }else{
            alert("表单验证失败") // %
        }
    }
}])

//账号管理
app.controller('repwdCtrl', ['$rootScope','$scope','$state','$http',function ($rootScope,$scope,$state,$http) {
    $scope.cg_pwd = function(){
        var post_data = {change_pwd:$scope.old_pwd,new_pwd:$scope.new_pwd,re_pwd:$scope.re_pwd};
        $http.post('/fuck/login.php', post_data).success(function(data) {  
            if(data=='ok'){
                alert('密码修改完成，请重新登录。');
                window.location='/fuck/login.php?logout';
            }else{
                $scope.plug_alert('danger','输入有误。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。") 
        }); 
    }
}])

//面板控制器
app.controller('siteCtrl', ['$rootScope','$scope','$state','$http', function($rootScope,$scope,$state,$http){
    $rootScope.bg = false;
    //查询u_name
    $http.get('/fuck/login.php', {params:{u_name:"get"}
    }).success(function(data) {
        if(data=="logout"){
            $state.go('login');  //跳转到首页登录，%添加超时提醒
        }else{
            $scope.u_name = data;
        }
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //查询文件夹
    $scope.select_folder = function(){
        $http.get('/fuck/sysfolder.php', {params:{folder:"get"}
        }).success(function(data) {
            $scope.folders=data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    $scope.select_folder(); //调用文件夹

    //查询文件夹包括表单
    $scope.select_folder_all = function(){
        $http.get('/fuck/sysfolder.php', {params:{folder_all:"get"}
        }).success(function(data) {
            $scope.folder_all=data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    $scope.select_folder_all(); //调用
    
    //查询表单
    $scope.select_table = function(click_key,click_id){
        $scope.click_me(click_key,click_id);   //赋值
        $http.get('/fuck/systable.php', {params:{select_table:click_id}
        }).success(function(data) {
            $scope.tables=data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }


}])

//文件夹管理
app.controller('folderCtrl', ['$rootScope','$scope','$state','$http', function($rootScope,$scope,$state,$http){
    $scope.plug_dropdown(); //调用下拉
    
    //新建文件夹名
    $scope.add_folder = function(){
        var time=new Date().getTime();
        if($scope.new_folder==undefined){
            return false;
        }
        var post_data = {new_folder:$scope.new_folder};
        $http.post('/fuck/sysfolder.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','文件夹 '+$scope.new_folder+' 添加完成。','icon-ok');
                $state.go('site.sysfolder',{data:time});
                $scope.select_folder_all(); //重新加载侧栏
            }else{
                $scope.plug_alert('danger','文件夹名 '+$scope.new_folder+' 已存在，请输入其它的名称。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

    //重命名
    $scope.rename_popover = {
        title: '文件夹重命名',
        templateUrl: 'rename_popover.html'
    };
    $scope.rename_folder = function(){
        var time=new Date().getTime();
        if($scope.rename_popover.re_folder==undefined){
            return false;
        }
        var post_data = {re_folder:$scope.rename_popover.re_folder,click_key:$scope.click_key};
        $http.post('/fuck/sysfolder.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','文件夹已改为 '+$scope.rename_popover.re_folder+' 。','icon-ok');
                $state.go('site.sysfolder',{data:time});    //这里为了刷新页面，随机传一个参数过去
                $scope.select_folder_all(); //重新加载侧栏
            }else if(data=='has'){
                $scope.plug_alert('danger','文件夹 '+$scope.rename_popover.re_folder+' 已存在。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

    //删除
    $scope.del_popover = {
        title: '删 除 ?',
        templateUrl: 'del_popover.html'
    };
    $scope.del_folder = function(){
        var time=new Date().getTime();
        var post_data = {del_folder:$scope.click_key};
        $http.post('/fuck/sysfolder.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success',$scope.click_key+' 删除完成。','icon-ok');
                var time=new Date().getTime()
                $state.go('site.sysfolder',{data:time});
                $scope.select_folder_all(); //重新加载侧栏
            }else if(data=='has'){
                $scope.plug_alert('danger',$scope.click_key+' 包含表单，删除后再试。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

}])

//表单管理
app.controller('tableCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    $scope.plug_dropdown(); //调用下拉

    //新建表单
    $scope.add_table = function(){
        if($scope.new_table==undefined){
            return false;
        }

        var post_data = {new_table:$scope.new_table,folder_id:$scope.click_id};
        $http.post('/fuck/systable.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','表单 '+$scope.new_table+' 添加完成。','icon-ok');
                $scope.select_table($scope.click_key,$scope.click_id);  //查询表单
                $scope.select_folder_all(); //重新加载侧栏
                $scope.new_table = '';
            }else if(data=='has'){
                $scope.plug_alert('danger','此文件夹中包含 '+$scope.new_table+' 表单，请输入其它的名称。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });
    }

    //table_key
    $scope.table_key = function(e){
        $scope.table_key_click = e;
    }

    //重命名
    $scope.rename_popover = {
        title: '表单重命名',
        templateUrl: 'rename_popover.html'
    };
    $scope.rename_table = function(){
        if($scope.rename_popover.re_table==undefined){
            return false;
        }
        var post_data = {re_table:$scope.rename_popover.re_table,click_key:$scope.table_key_click,folder_id:$scope.click_id};
        $http.post('/fuck/systable.php', post_data).success(function(data) {
            if(data=='ok'){
                $scope.plug_alert('success','表单已改为 '+$scope.rename_popover.re_table+' 。','icon-ok');          
                $scope.select_table($scope.click_key,$scope.click_id); 
                $scope.rename_popover.re_table="";
                $scope.select_folder_all(); //重新加载侧栏
                var dom = document.querySelector('.popover');
                angular.element(dom).removeClass('in');  //移除popover
            }else if(data=='has'){
                $scope.plug_alert('danger','表单 '+$scope.rename_popover.re_table+' 已存在。','icon-ban-circle');
                $scope.rename_popover.re_table="";
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

    //模板添加（替换）
    $scope.tpl_popover = {
        title: '请选择模板',
        templateUrl: 'tpl_popover.html'
    };

    $scope.change_tpl = function(e){
        $http.get('/fuck/systable.php', {params:{change_tpl:e,change_table_id:$scope.table_key_click}
        }).success(function(data) {
            if(data=="ok"){
                $scope.plug_alert('success','操作完成。','icon-ok'); 
                $scope.select_table($scope.click_key,$scope.click_id); 
                var dom = document.querySelector('.popover');
                angular.element(dom).removeClass('in');  //移除popover
            }else{
                $scope.plug_alert('danger','系统错误，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });

    }

    //删除
    $scope.del_popover = {
        title: '删除 ?',
        templateUrl: 'del_popover.html'
    };
    $scope.del_table = function(){
        var post_data = {del_table_id:$scope.table_key_click};
        $http.post('/fuck/systable.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success',' 删除完成。','icon-ok');
                $scope.select_table($scope.click_key,$scope.click_id); 
                $scope.select_folder_all(); //重新加载侧栏
                var dom = document.querySelector('.popover');
                angular.element(dom).removeClass('in');  //移除popover
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

}])

//通用字段
app.controller('commonfieldCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    //查询通用字段
    $http.get('/fuck/field/commonfield.php', {params:{select_comfield:"get"}
    }).success(function(data) {
        $scope.all_commonfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //添加通用字段
    var time=new Date().getTime();
    var self = this;
    self.submit = function(){
        $http.post('/fuck/field/commonfield.php', self.add).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','字段 '+self.add.new_field+' 新建完成。','icon-ok');
                $state.go('site.commonfield',{data:time});
            }else if(data=='has'){
                $scope.plug_alert('danger','已包含 '+self.add.new_field+' 字段名，请输入其它的名称。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    };
        


    //修改通用字段
    $scope.change_comfield = function(id,field,old_value){
        var time=new Date().getTime();
        var sid = field+'_'+id;
        if(field=='field_type' || field=='id'){
            $scope.plug_alert('danger','不能修改项','icon-ban-circle');
        }else{
            var dom = document.querySelector('#'+sid);
            if(angular.element(dom).hasClass('red')==1){
                //修改字段
                var change_key = angular.element(dom).val();
                if(field=='field_length' && isNaN(change_key)){
                    $scope.plug_alert('danger','请输入数字。','icon-ban-circle');
                    return false;
                }
                if(field=="field_require"){
                    if(change_key!='0' && change_key!='1'){
                        $scope.plug_alert('danger','输入有误。','icon-ban-circle');
                        return false;
                    }
                }
                var post_data = {id:id,field:field,change_key:change_key};
                $http.post('/fuck/field/commonfield.php', post_data).success(function(data) {  
                    if(data=='ok'){
                        $scope.plug_alert('success','字段修改完成。','icon-ok');
                        //$state.go('site.commonfield',{data:time});
                    }else if(data=='has'){
                        $scope.plug_alert('danger','该字段名已存在。','icon-ban-circle');
                        angular.element(dom).val(old_value);
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
    }

    //field_key
    $scope.field_key = function(e){
        $scope.field_key_click = e;
    }

    //删除
    $scope.del_popover = {
        title: '删除 ?',
        templateUrl: 'del_popover.html'
    };
    $scope.del_field = function(){
        var post_data = {del_field_id:$scope.field_key_click};
        $http.post('/fuck/field/commonfield.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success',' 删除完成。','icon-ok');
                var del = document.querySelector('#line_'+$scope.field_key_click);
                angular.element(del).remove();  //移除此行
                var dom = document.querySelector('.popover');
                angular.element(dom).removeClass('in');  //移除popover
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }
}])

//雅虎字段
app.controller('yahoofieldCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    //查询雅虎字段
    $http.get('/fuck/field/yahoofield.php', {params:{select_yahoofield:"get"}
    }).success(function(data) {
        $scope.all_yahoofield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //添加雅虎字段
    var time=new Date().getTime();
    var self = this;
    self.submit = function(){
        $http.post('/fuck/field/yahoofield.php', self.add).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','字段 '+self.add.new_field+' 新建完成。','icon-ok');
                $state.go('site.yahoofield',{data:time});
            }else if(data=='has'){
                $scope.plug_alert('danger','已包含 '+self.add.new_field+' 字段名，请输入其它的名称。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    };

    //修改雅虎字段
    $scope.change_yahoofield = function(id,field,old_value){
        var time=new Date().getTime();
        var sid = field+'_'+id;
        if(field=='field_type' || field=='id'){
            $scope.plug_alert('danger','不能修改项','icon-ban-circle');
        }else{
            var dom = document.querySelector('#'+sid);
            if(angular.element(dom).hasClass('red')==1){
                //修改字段
                var change_key = angular.element(dom).val();
                if(field=='field_length' && isNaN(change_key)){
                    $scope.plug_alert('danger','请输入数字。','icon-ban-circle');
                    return false;
                }
                if(field=="field_require"){
                    if(change_key!='0' && change_key!='1'){
                        $scope.plug_alert('danger','输入有误。','icon-ban-circle');
                        return false;
                    }
                }
                var post_data = {id:id,field:field,change_key:change_key};
                $http.post('/fuck/field/yahoofield.php', post_data).success(function(data) {  
                    if(data=='ok'){
                        $scope.plug_alert('success','字段修改完成。','icon-ok');
                        //$state.go('site.yahoofield',{data:time});
                    }else if(data=='has'){
                        $scope.plug_alert('danger','该字段名已存在。','icon-ban-circle');
                        angular.element(dom).val(old_value);
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
    }

    //field_key
    $scope.field_key = function(e){
        $scope.field_key_click = e;
    }

    //删除
    $scope.del_popover = {
        title: '删除 ?',
        templateUrl: 'del_popover.html'
    };
    $scope.del_field = function(){
        var post_data = {del_field_id:$scope.field_key_click};
        $http.post('/fuck/field/yahoofield.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success',' 删除完成。','icon-ok');
                var time=new Date().getTime();
                $state.go('site.amazonfield',{data:time});
            }else{
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }
}])

//乐天字段
app.controller('rakutenfieldCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    //查询乐天字段
    $http.get('/fuck/field/rakutenfield.php', {params:{select_rakutenfield:"get"}
    }).success(function(data) {
        $scope.all_rakutenfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //添加乐天字段
    var time=new Date().getTime();
    var self = this;
    self.submit = function(){
        $http.post('/fuck/field/rakutenfield.php', self.add).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','字段 '+self.add.new_field+' 新建完成。','icon-ok');
                $state.go('site.rakutenfield',{data:time});
            }else if(data=='has'){
                $scope.plug_alert('danger','已包含 '+self.add.new_field+' 字段名，请输入其它的名称。','icon-ban-circle');
            }else{
                console.log(data);
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    };

    //修改乐天字段
    $scope.change_rakutenfield = function(id,field,old_value){
        var time=new Date().getTime();
        var sid = field+'_'+id;
        if(field=='field_type' || field=='id'){
            $scope.plug_alert('danger','不能修改项','icon-ban-circle');
        }else{
            var dom = document.querySelector('#'+sid);
            if(angular.element(dom).hasClass('red')==1){
                //修改字段
                var change_key = angular.element(dom).val();
                if(field=='field_length' && isNaN(change_key)){
                    $scope.plug_alert('danger','请输入数字。','icon-ban-circle');
                    return false;
                }
                if(field=="field_require"){
                    if(change_key!='0' && change_key!='1'){
                        $scope.plug_alert('danger','输入有误。','icon-ban-circle');
                        return false;
                    }
                }
                var post_data = {id:id,field:field,change_key:change_key};
                $http.post('/fuck/field/rakutenfield.php', post_data).success(function(data) {  
                    if(data=='ok'){
                        $scope.plug_alert('success','字段修改完成。','icon-ok');
                    }else if(data=='has'){
                        $scope.plug_alert('danger','该字段名已存在。','icon-ban-circle');
                        angular.element(dom).val(old_value);
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
    }

    //field_key
    $scope.field_key = function(e){
        $scope.field_key_click = e;
    }

    //删除
    $scope.del_popover = {
        title: '删除 ?',
        templateUrl: 'del_popover.html'
    };
    $scope.del_field = function(){
        var post_data = {del_field_id:$scope.field_key_click};
        $http.post('/fuck/field/rakutenfield.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success',' 删除完成。','icon-ok');
                var time=new Date().getTime();
                $state.go('site.amazonfield',{data:time});
            }else{
                console.log(data);
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }
}])

//亚马逊字段
app.controller('amazonfieldCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    //查询亚马逊字段
    $http.get('/fuck/field/amazonfield.php', {params:{select_amazonfield:"get"}
    }).success(function(data) {
        $scope.all_amazonfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //添加亚马逊字段
    var time=new Date().getTime();
    var self = this;
    self.submit = function(){
        $http.post('/fuck/field/amazonfield.php', self.add).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','字段 '+self.add.new_field+' 新建完成。','icon-ok');
                $state.go('site.amazonfield',{data:time});
            }else if(data=='has'){
                $scope.plug_alert('danger','已包含 '+self.add.new_field+' 字段名，请输入其它的名称。','icon-ban-circle');
            }else{
                console.log(data);
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    };

    //修改亚马逊字段
    $scope.change_amazonfield = function(id,field,old_value){
        var time=new Date().getTime();
        var sid = field+'_'+id;
        if(field=='field_type' || field=='id'){
            $scope.plug_alert('danger','不能修改项','icon-ban-circle');
        }else{
            var dom = document.querySelector('#'+sid);
            if(angular.element(dom).hasClass('red')==1){
                //修改字段
                var change_key = angular.element(dom).val();
                if(field=='field_length' && isNaN(change_key)){
                    $scope.plug_alert('danger','请输入数字。','icon-ban-circle');
                    return false;
                }
                if(field=="field_require"){
                    if(change_key!='0' && change_key!='1'){
                        $scope.plug_alert('danger','输入有误。','icon-ban-circle');
                        return false;
                    }
                }
                var post_data = {id:id,field:field,change_key:change_key};
                $http.post('/fuck/field/amazonfield.php', post_data).success(function(data) {  
                    if(data=='ok'){
                        $scope.plug_alert('success','字段修改完成。','icon-ok');
                    }else if(data=='has'){
                        $scope.plug_alert('danger','该字段名已存在。','icon-ban-circle');
                        angular.element(dom).val(old_value);
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
    }

    //field_key
    $scope.field_key = function(e){
        $scope.field_key_click = e;
    }

    //删除
    $scope.del_popover = {
        title: '删除 ?',
        templateUrl: 'del_popover.html'
    };
    $scope.del_field = function(){
        var post_data = {del_field_id:$scope.field_key_click};
        $http.post('/fuck/field/amazonfield.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success',' 删除完成。','icon-ok');
                var time=new Date().getTime();
                $state.go('site.amazonfield',{data:time});
            }else{
                console.log(data);
                $scope.plug_alert('danger','系统出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }
}])