$(document).ready(function() {
    $(".active_input").change(function(){
        var active=0;
        var idu = $(this).attr("rel");
        if($(this).is(":checked")) {
            active=1;
        }
        $.post( "api/api.php",{action:"set_active",idu:idu,active:active},function(d){
            console.log(d);
        });
    });
    $("#nueva_clave").height( $( document ).height()  ) ;
    $(".bt_np").click(function(){
        var idu=$(this).attr("rel");
        $("#pool").val(idu);
        $("#nueva_clave").show();
        $("#username").val("");
        $("#nclave").val("");
        $("#cclave").val("");
    });

    $("#guardar_np").click(function(){
        var nuser = $("#username").val();
        var npass = $("#nclave").val();
        var cpass = $("#cclave").val();
        var idu = $("#pool").val();
        if(nuser==""|| npass =="" || cpass ==""){
            alert("Se deben llenar todos los campos");
        }else{
            if(npass != cpass){
                alert("Los campos de clave no coinciden");
            }else{
                $.post( "api/api.php",{action:"set_new_clave",idu:idu,clave:npass,name:nuser},function(d){
                    console.log(d);
                    $("#pool").val("");
                    $("#nueva_clave").hide();
                    $("#username").val("");
                    $("#nclave").val("");
                    $("#cclave").val("");
                });
            }
        }

    });
    $("#cerrar_np").click(function(){
        $("#pool").val("");
        $("#nueva_clave").hide();
        $("#username").val("");
        $("#nclave").val("");
        $("#cclave").val("");
    });
});