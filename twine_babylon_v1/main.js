var main = (function(){

    let tl = gsap.timeline()
    let pub = {};
    //
    let story = null;
    let display = null;
    
    pub.start = function(){
        console.log("Initializing");
        //
        story = document.getElementsByClassName("story")[0];
        display = document.getElementsByClassName("display")[0];
        //
        setupListeners();
    }

    setupListeners = function () {
        story.contentWindow.addEventListener("message", function(event){
            route(event.data)
        }, false);
        display.contentWindow.addEventListener("message", function(event){
            route(event.data)
        }, false);
    }

    route = function(data) {
        switch(data){
            case "show_room":
                tl.to(display, { autoAlpha: 1, duration: 0.5 });
                break;
            case "start_game1":
                tl.to(story, { autoAlpha: 0, duration: 0.1 });
                display.contentWindow.postMessage("display_game1","*")
                break;
            case "game1_complete":
                tl.to(story, { autoAlpha: 1, duration: 0.3 });
                tl.to(display, { autoAlpha: 0, duration: 0.5 });
                story.contentWindow.postMessage("goto_end","*");
                break;
            case "story_reset":
                tl.to(display, { autoAlpha: 0, duration: 0.5 });
                //story.contentWindow.postMessage("story_reset","*");
                break;

        }
    }
    
    return pub;
})();