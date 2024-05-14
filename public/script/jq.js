// console.log($("#heading").css({"color":"red", "border": ".2rem solid green"}).hide().show())


// $("#btn").on("click", function() {
//     $("#heading").css({"color":"red", "border": ".2rem solid green"}).toggle("4s")
// })
$("#btn").on("click", function() {
    $("#heading").hide()
    $("#btn").text("Show")
})

// ajax demo
$("#loader").on("click", function() {
    $.ajax({
        type:"GET",
        url: "/register",
        success: function(data) {
            $("#reg").html(data)
            console.log(data);
        },
        beforeSend(){
            alert("loading...")
        },
        error(){

        }
    })
})


// .html()
// .slideIn()
// .toggle()
// .animate()
// .css()
// .slideShow()
// .hide()
// .fadeIn()
// .show()