var state = 0;
var urlA="http://localhost:8080/melexa/api/api.php";
function setState(i,msg){
    state = i;
    $("#msg_info").text(msg);
}
$(document).ready(function() {
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
                        window.location.replace("main.html?t="+data.token+"&uid="+data.userid+"&uname="+data.username);
                    }if(data.msg == "password"){
                        window.location.replace("pass.html?t="+data.token+"&uid="+data.userid+"&uname="+data.username);
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
});