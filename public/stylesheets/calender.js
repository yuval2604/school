//calender
        

$(document).ready(
    function(){
        $('#button').click(
            function(){
                var toAdd = $('input[name=ListItem]').val();
                $('ol').append('<div class="event_item"><div class="ei_Dot dot_active"></div><div class="ei_Title">'+toAdd+'</div><div class="ei_Copy">'+toAdd+'</div></div>');
            });

        $("input[name=ListItem]").keyup(function(event){
            //enter
            if(event.keyCode === 13){
                $("#button").click();
            }
        });

        $(document).on('dblclick','li', function(){
            $(this).toggleClass('strike').fadeOut('slow');
        });

        $('input').focus(function() {
            $(this).val('');
        });

        $('ol').sortable();

        //open nav bar

        // $('#closeNav').click(
        //     function(){
        //         $("#mySidenav").css("width", "0");
        //     });
        //
        // $('#openNav').click(
        //     function(){
        //         $("#mySidenav").css("width", "38%");
        //     });

    }
);

