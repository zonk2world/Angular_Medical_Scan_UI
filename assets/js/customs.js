$(document).ready(function() {
    /*For Responsive Data Table*/
    $('#example').DataTable({
        responsive: {
            details: {
                type: 'column',
                target: -1
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: false,
            targets: -1
        }]
    });

    // toggle navigation bar

    var ww = $(window).width(); // usef for hide default navigation for mobile view
    if(ww < 767){
        $("body").addClass("hide-nav");
    }

    $(".tgl-btn").click(function() {
        $("body").toggleClass("hide-nav");
    });
    $(".drop-down").click(function(){
        $(this).toggleClass("active");
    });
});