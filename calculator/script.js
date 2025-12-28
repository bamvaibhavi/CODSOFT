const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");


buttons.forEach((btn) => {
    
    
    btn.addEventListener("click", () => {
        
        
        const btnValue = btn.getAttribute("data-value");

        
        if (btnValue === "=") {
            
            if (display.value !== "") {
                
                
                display.value = eval(display.value); 
            }
        } 
        else if (btnValue === "AC") {
            
            display.value = "";
        } 
        else if (btnValue === "DEL") {
            
            display.value = display.value.toString().slice(0, -1);
        } 
        else {
            
            
            if (display.value === "" && (btnValue === "%" || btnValue === "/" || btnValue === "*" || btnValue === "+" || btnValue === "-")) return;
            display.value += btnValue;
        }
    });
});