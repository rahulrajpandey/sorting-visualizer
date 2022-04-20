"use strict";

(function () {

  /* ******************************************************** */
  /* ****************** CONSTANTS *************************** */
  /* ******************************************************** */

  const ORIGINAL_COLOR = "cadetblue";
  const COMPARISON_COLOR = "red";

  /* ******************************************************** */
  /* *************** SHARED DATA STRUCTURES ***************** */
  /* ******************************************************** */

  const array = [];
  const animations = [];
  let animationRangeValue = "25"; // hold animation slider value, default set as 25

  // AnimationStep template
  class AnimationStep {
    constructor(firstIdx, secondIdx, ifPosChange) {
      this.firstIdx = firstIdx;
      this.secondIdx = secondIdx;
      this.ifPosChange = ifPosChange;
    }
  }


  /* ******************************************************** */
  /* ********************* UI BINDINGS ********************** */
  /* ******************************************************** */


  var btnArrayGenElement = document.querySelector("#btnArrayGenerator");
  var btnBubbleSortElement = document.querySelector("#btnBubbleSort");
  var txtElement = document.querySelector("#txtArea");
  var divBarsElement = document.querySelector("#divBars");
  var rangeAnimationSliderElement = document.querySelector("#animationSlider");

  
  txtElement.disabled = true; // disable the text box


  /* ******************************************************** */
  /* ***************** UI EVENTS HANDLERS ******************* */
  /* ******************************************************** */


  /**
   * Objective: Generate array of random numbers in some range.
   * 
   * Operations:
   * - Reset the array data structure.
   * - Generate 20 random Numbers in the range [30, 200] by calling getRandomInt().
   * - Push all those Numbers into the array.
   * - Display the array in the txtElement.
   * - Call showBoxes() to display the array number in form of box in the respective div.
   */
  btnArrayGenElement.addEventListener("click", function () {
    array.length = 0; // clear the array

    for (var count = 0; count < 20; count++) { // add 20 numbers in the range 30 to 200
      array.push(getRandomInt(30, 200));
    }

    txtElement.value = array; // set array in the textarea
    showBoxes(array); // call to display array boxes into divbars div section
  });


  /**
   * Objective: Bubble Sort array of Numbers and add the steps performed in the animations array.
   * 
   * Operations:
   * - Disable the buttons and input controls, so that animation runs smoothly.
   * - Get the animation slider value.
   * - Reset the animations array.
   * - Start Bubble Sorting.
   * -- push current indexes being compared into animations array twice 
   * -- (first push to change color from Primary to Comparing and second push to revert the first push action)
   * -- If swap is required, do and then add the swaps into the animations array
   * -- (push- index, new height of box at that index)
   * - Call showAnimations() to start animation on the UI.
   */
  btnBubbleSortElement.addEventListener("click", function () {
    enableDisableUIElements(false); // disable the divControls
    animationRangeValue = rangeAnimationSliderElement.value; // get Animation Speed
    animations.length = 0; // reset animation array

    for (var i = 0; i < array.length; i++) { // bubble sort starts
      let sortingFlag = false; // to optimize the sorting, once array is sorted, no more iterations will be made

      for (var j = 0; j < array.length - i - 1; j++) { // inner for loop starts
        
        // push current indexes in comparison to the animations array 
        animations.push(new AnimationStep(j, j + 1, false)); // change color to comparison
        animations.push(new AnimationStep(j, j + 1, false)); // back to original color

        if (array[j] > array[j + 1]) { // If the condition is true then swap them
          sortingFlag = true;

          var temp1 = array[j];
          var temp2 = array[j + 1];

          array[j] = temp2;
          array[j + 1] = temp1;

          // push swap operation in the animations array
          animations.push(new AnimationStep(j, temp2, true)); // index, item height, true
          animations.push(new AnimationStep(j + 1, temp1, true)); // index, item height, true
        }

      } // inner for loop ends

      if (sortingFlag === false) { // check if array is sorted now
        break; 
      }

    } // bubble sort ends

    console.log(array); // Print the sorted array
    showAnimations(animations); // call animation display
  });


  /* ******************************************************** */
  /* *************** UTILITY FUNCTIONS ********************** */
  /* ******************************************************** */

  /**
   * Objective:
   * Enable and Disable UI elements
   * 
   * @param {Boolean} doEnable - to be used to enable and disable UI elements
   */
  function enableDisableUIElements(doEnable) {
    if (doEnable === true) {
      rangeAnimationSliderElement.disabled = false;
      btnArrayGenElement.disabled = false;
      btnBubbleSortElement.disabled = false;
    } else {
      rangeAnimationSliderElement.disabled = true;
      btnArrayGenElement.disabled = true;
      btnBubbleSortElement.disabled = true;
    }
  }

  /**
   * Obejctive: 
   * Display array number boxes in the div `divBars`
   * 
   * @param {[]} array - array of numbers to be used in sorting
   * 
   * Operations:
   * - Clear elements inside divBars div
   * - Create a Fragement to hold all the array box elements
   * - Iterate over array items
   * -- Create a `div` element, set class to `box`, set height to the current number
   * -- Append the newly created element into the fragement
   * - Append the fragement with all the boxes to the divBars div to show on the UI
   */
  function showBoxes(array) {
    divBarsElement.replaceChildren(); // clear the div

    var fragment = new DocumentFragment(); // Create the fragment

    array.forEach(function (item, index) {
      const boxItem = document.createElement("div");
      boxItem.className = "box";
      boxItem.style.height = item + "px";
      fragment.appendChild(boxItem);
    });

    // console.log(fragment);
    divBarsElement.appendChild(fragment);
    console.log("All array items added as box into the Div");
  }

  /**
   * Objective:
   * function to perform animations for the sorting steps 
   * 
   * @param {array} animations - array of AnimationStep
   * 
   * Data Structure Info:
   * - array of AnimationStep contains primarily 2 things:
   * - 1. If the positionChange is True, then seondIndex is the height for the firstIndex box
   * - 2. If the positionChange is False, then boxes at firstIndex and SecondIndex are compared
   * - When the position change is False, same indexes are pushed twice in the array, so that
   * - the first push needs to change the color from Original color to Comparison color 
   * - and second push to revert from Comparison color to Original color
   * 
   * Operations:
   * - find the speed for animation to happen using the user selected animation slider value
   * - Find the length of AnimationSteps
   * - Get all the array item from Page i.e. box elements, these will be used for animation
   * 
   * - Start Animation:
   * 
   * -- Start looping over array of AnimationStep
   * -- For each Object, check if the position change needs to be displayed
   * 
   * -- If YES, get reference to the box on UI at the firstIndex in this Object
   * --- Start setTimeOut for Animation, and inside setTimeOut do the following:
   * --- Set the height of this box to the secondIndex value in pixels.
   * --- Also check if, current index in array has reached to the end, then enable UI elementds 
   * 
   * -- If NO, get reference to the boxes at first and second index
   * --- Start setTimeOut for Animation, and inside setTimeOut do the following:
   * --- Check if the current index in array is Odd meaning set the Primary color
   * --- Else set the Comparison color
   * --- Also check if, current index in array has reached to the end, then enable UI elementds
   * 
   * - End Animation:
   */
  function showAnimations(animations) {
    // console.log(animations);
    let animationPace = getAnimationPace(animationRangeValue);
    let animationsLength = animations.length;

    const boxHTMLCollection = document.getElementsByClassName("box");

    for (let i = 0; i < animationsLength; i++) { // start animation
      let animationStep = animations[i];

      let firstIndex = animationStep.firstIdx;
      let secondIndex = animationStep.secondIdx;
      let positionChangeCheck = animationStep.ifPosChange;

      if (positionChangeCheck) {
        const box = boxHTMLCollection.item(firstIndex);
        
        setTimeout(function () {
          box.style.height = secondIndex + "px";

          if (i === (animationsLength - 1)) { // enable UI Elements
            enableDisableUIElements(true);
          }

        }, (i * animationPace));

      } else {
        const box1 = boxHTMLCollection.item(firstIndex);
        const box2 = boxHTMLCollection.item(secondIndex);
        
        setTimeout(function () {
          if (i & 1) { // odd, set original color
            box1.style.backgroundColor = ORIGINAL_COLOR;
            box2.style.backgroundColor = ORIGINAL_COLOR;
          } else { // set comparison color
            box1.style.backgroundColor = COMPARISON_COLOR;
            box2.style.backgroundColor = COMPARISON_COLOR;
          }

          if (i === (animationsLength - 1)) { // enable UI Elements
            enableDisableUIElements(true);
          }

        }, (i * animationPace));

      }
    } // animation ends

    console.log("DONE!");
  }

  /**
   * Objective:
   * Return a random number in the given lower and upper limits.
   * 
   * @param {positive Number} min - lower bound of the range
   * @param {positive Number} max - upper bound of the range
   * @returns a random Number in the range [min, max]
   */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Objective: 
   * function to return milliseconds to be used to perform animations of the sorting steps
   * 
   * @param {String} animationRangeValue - Animation Speed Slider value
   * @returns milliseconds 
   * 
   * Operations: 
   * lower the animationRangeValue, higher the milliseconds i.e. more slower animation
   */
  function getAnimationPace(animationRangeValue) {
    switch (animationRangeValue) {
      case "5": return 1000;
      case "10": return 900;
      case "15": return 800;
      case "20": return 700;
      case "25": return 600;
      case "30": return 500;
      case "35": return 400;
      case "40": return 300;
      case "45": return 200
      case "50": return 100;
    }
  }
})();
