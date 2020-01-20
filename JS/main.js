function myFunction() {
    var x = document.getElementsByClassName("main-menu");
    console.log("activated");
    if (x === "main-menu") {
        x;
        console.log("I am working");
        console.log("x");
    } else {
        x = "main-menu";
        console.log("I am working");
    }
}