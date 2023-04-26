var main = (function(){

    let pub = {};
    let count = 0;
    
    pub.start = function(){
        console.log("Initializing 3D");
        //
        setupListeners();
    }

    pub.count = function(){
        count++
        if(count == 7){
            console.log("complete")
            window.postMessage("game1_complete","*");
        }
    }

    setupListeners = function () {
        window.addEventListener("message", function(event){
            route(event.data)
        }, false);
    }

    route = function(data) {

        switch(data){
            case "display_game1":
                console.log("starting game 1")
                break;
        }
    }
    
    pub.start();
    return pub;
})();