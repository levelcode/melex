var state = 0;
//var urlA="http://localhost:8080/melexa/api/api.php";
var urlA="http://melexa.info/app_melexa/api/api.php";

function setState(i,msg){
    state = i;
    $("#msg_info").text(msg);
}
$(document).ready(function() {
    token = localStorage.getItem("t");
    u_id = localStorage.getItem("uid");
    u_name = localStorage.getItem("uname");

    if( validateLS(token,u_id,u_name) ){
        window.location.replace("main.html");
    }else{
        $('a[href="#navbar-more-show"], .navbar-more-overlay').on('click', function(event) {
    		event.preventDefault();
    		$('body').toggleClass('navbar-more-show');
    		if ($('body').hasClass('navbar-more-show'))	{
    			$('a[href="#navbar-more-show"]').closest('li').addClass('active');
    		}else{
    			$('a[href="#navbar-more-show"]').closest('li').removeClass('active');
    		}
    		return false;
    	});

        $('.datetimepicker').datetimepicker();
        
        setState(0);

        $("#bt_login").click(function(){
            if(state==0){
            	setState(1,"Procesando");
                $(this).addClass("in_process");
                var user = $("#login_user").val(); 
                var pass = $("#login_password").val();
                if(user.length == "" || pass.length =="")
                {
                    setState(0,"Se deben llenar todos los campos");
                }else{

                    $.post( urlA,{action:"login",username:user,password:pass}, function( data ) {
                        if(data.msg == "ok"){
                            localStorage.setItem("t", data.token);
                            localStorage.setItem("uid", data.userid);
                            localStorage.setItem("uname", data.username);
                            window.location.replace("main.html");
                        }if(data.msg == "password"){
                            localStorage.setItem("t", data.token);
                            localStorage.setItem("uid", data.userid);
                            localStorage.setItem("uname", data.username);
                            window.location.replace("pass.html");
                        }else{
                            setState(0,data.detail);
                            $("#bt_login").removeClass("in_process");
                        }
                    },"json");
                }   
            }
        });

        $("#loading").hide();
        $("#wrapper").show();
    }
});