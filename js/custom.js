var state = 0;
function setState(i){
	if(i>0)
		$(".navbar-toggle").show();
	else
		$(".navbar-toggle").hide();
	state = i;
	$(".container-fluid").hide();
	$(".container-fluid").eq(state).show();
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
    	setState(1);
    });
    $("#bt_perfil").click(function(){
    	setState(2);
    });
    $("#bt_pedidos").click(function(){
    	setState(3);
    });
    $("#bt_cartera").click(function(){
    	setState(4);
    });
    $("#bt_ofertas").click(function(){
    	setState(5);
    });

});