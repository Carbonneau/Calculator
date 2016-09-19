/* global $ */




$(document).ready(function() {

    $(".buttons").children().click(function() {
        var pressed = $(this).text();
        $("#display").append(pressed);
    });
    
    $("#clear").click(function() {
        $("#display").text("");
    });

    $("#equals").click(function() {
        var string = $("#display").text();
        var arrayOfStuff = string.split("");
        arrayOfStuff.pop();

        function handleMultDiv(array) {
            if (arrayOfStuff.indexOf("*") > -1 || arrayOfStuff.indexOf("/") > -1) {
                var left = {};
                var right = {};
                var operator = {};
                if (arrayOfStuff.indexOf("*") > -1) {
                  operator.index = arrayOfStuff.indexOf("*");
                  operator.type = "*";
                }
                
                else {
                  operator.index = arrayOfStuff.indexOf("/");
                  operator.type = "/";
                }
                
                
                //get the left side of the equation
                arrayOfStuff.reduce(function(prev, curr, currentIndex) {
                    if (currentIndex < operator.index && curr != 'NO') {
                        if (curr === '+' ||curr === '-' ||curr === '*' ||curr === '/') {
                            left.val = '';
                            prev = '';
                            return prev;
                        }
                        else {
                            if (!left.val) {
                                left.val = {};
                                left.val.string = '';
                                left.val.del = [];
                            }
                            left.val.string += curr;
                            left.val.del.push(currentIndex);
                            return prev + curr;
                        }
                    }

                }, '');
                
                //get the right side of the equation
                arrayOfStuff.reduce(function(prev, curr, currentIndex) {
                    if (currentIndex > operator.index && curr != 'NO') {
                        if (curr === '+' ||curr === '-' ||curr === '*' ||curr === '/'|| prev === "stop") {
                            //stop other multiplications farther right from messing things up
                            return "stop";
                        }
                        else {
                            if (!right.val) {
                                right.val = {};
                                right.val.string = '';
                                right.val.del = [];
                            }
                            right.val.string += curr;
                            right.val.del.push(currentIndex);
                            return prev + curr;
                        }
                    }
                }, '');
                
                //do the math
                switch(operator.type) {
                  case "*" :
                    var multResult = parseFloat(left.val.string,10) * parseFloat(right.val.string,10);
                    arrayOfStuff[operator.index] = multResult;
                    break;
                  case "/" :
                    var multResult = parseFloat(left.val.string,10) / parseFloat(right.val.string,10);
                    arrayOfStuff[operator.index] = multResult;
                    break;
                }
                
                
                //modify the array
                left.val.del.forEach(function(index) {
                    arrayOfStuff[index] = 'NO';
                });

                right.val.del.forEach(function(index) {
                    arrayOfStuff[index] = 'NO';
                });
                
                //stop the loop from doing anything
                operator.index = arrayOfStuff.length;
            }
        }
        
        function printThis(array) {
          
          //handle multiplication and division first
            if (array.indexOf("*") > -1 || array.indexOf("/") > -1) {
                handleMultDiv(arrayOfStuff);
                printThis(arrayOfStuff);
            }
            
          //handle addition and subtraction next
            var currOp;
            var leftVal;
            var rightVal;
            var leftOrRight = 'left';
            var subTotal;
            //go throught the array left to right adding and subtracting along the way
            var calculated = array.reduce(function(prev, curr) {
                if (curr === 'NO') {
                    return prev;
                }
                if (curr === '+' || curr === '-') {
                    if (leftOrRight === "right") {
                        rightVal = prev;
                        prev = '';
                        switch (currOp) {
                            case '+':
                                subTotal = parseFloat(leftVal,10) + parseFloat(rightVal,10);
                                break;
                            case '-':
                                subTotal = parseFloat(leftVal,10) - parseFloat(rightVal,10);
                                break;
                        }
                        currOp = curr;
                        leftVal = subTotal.toString();
                        return prev;
                    }


                    currOp = curr;
                    leftOrRight = 'right';
                    leftVal = prev;
                    prev = '';
                }

                else {
                    prev += curr;
                }
                return prev;
            }, '');
            
            //handle the last item in the array 
            switch (currOp) {
                case '+':
                    return parseFloat(leftVal,10) + parseFloat(calculated,10);
                case '-':
                    return parseFloat(leftVal,10) - parseFloat(calculated,10);
                default:
                    return parseFloat(calculated,10);
            }


        }

        var displayResult = printThis(arrayOfStuff);

        if (isNaN(displayResult) === true) {
            $("#display").text("error");
        }
        else {
            $("#display").text(displayResult);
        }
    });
    
    //make the buttons change color
    $(".buttons").children().on({
        mouseover: function(event) {
            var colour = makeColour();
            $(this).css({
                'background-color': colour,
                transition: "1s",
            });
        }
    });
    
    //handle the keypresses
    $(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 49) {
            $("#display").append("1");
       } else if (keycode === 50) {
            $("#display").append("2");
        } else if (keycode === 51) {
            $("#display").append("3");
        } else if (keycode === 52) {
            $("#display").append("4");
        } else if (keycode === 53) {
            $("#display").append("5");
        } else if (keycode === 54) {
            $("#display").append("6");
        } else if (keycode === 55) {
            $("#display").append("7");
        } else if (keycode === 56) {
            $("#display").append("8");
        } else if (keycode === 57) {
            $("#display").append("9");
        } else if (keycode === 48) {
            $("#display").append("0");
        } else if (keycode === 97) {
            $("#clear").click();
        } else if (keycode === 99) {
            $("#clear").click();
        } else if (keycode === 61 || keycode === 13) {
            $("#equals").click();
        } else if (keycode === 43) {
            $("#display").append("+");
        } else if (keycode === 45) {
            $("#display").append("-");
        } else if (keycode === 42 || keycode === 120) {
            $("#display").append("*");
        } else if (keycode === 47) {
            $("#display").append("/");
        } else if (keycode === 46) {
            $("#display").append(".");
        }
    });


});


//returns a random light pastelly color
function makeColour() {
    var text = "#";
    var possible = "ABCDEF";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}