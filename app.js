"use strict";

(function () {

    /* ******************************************************** */
    /* ****************** CONSTANTS *************************** */
    /* ******************************************************** */

    const ORIGINAL_COLOR = "#007BFF";
    const COMPARISON_COLOR = "red";
    const BOX_STYLE_CLASS = "vr mt-auto";

    /* ******************************************************** */
    /* *************** SHARED DATA STRUCTURES ***************** */
    /* ******************************************************** */

    const array = [];
    const animations = [];
    let animationRangeValue = "25"; // hold animation slider value, default set as 25

    // AnimationStep template
    class AnimationStep {
        constructor(firstIdx, secondIdx, ifPosChange, color) {
            this.firstIdx = firstIdx;
            this.secondIdx = secondIdx;
            this.ifPosChange = ifPosChange;
            this.color = color;
        }
    }


    /* ******************************************************** */
    /* ********************* UI BINDINGS ********************** */
    /* ******************************************************** */

    let btnArrayGenElement = document.querySelector("#btnArrayGenerator");
    let btnSortElement = document.querySelector("#btnSort");
    let divInputArrItemsElement = document.querySelector("#divInputArrItems");
    let divSortedArrItemsElement = document.querySelector("#divSortedArrItems");
    let divBarsElement = document.querySelector("#divBars");
    let rangeAnimationSliderElement = document.querySelector("#animationSlider");

    divInputArrItemsElement.disabled = true; // disable the text input div
    divSortedArrItemsElement.disabled = true; // disable the text output div

    /* ******************************************************** */
    /* *********** Initialize Array on Page Load ************** */
    /* ******************************************************** */
    generateRandomArray();


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
        generateRandomArray();
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
    // 
    btnSortElement.addEventListener("click", function () {
        enableDisableUIElements(false); // disable the divControls
        animationRangeValue = rangeAnimationSliderElement.value; // get Animation Speed
        let sortingAlgo = document.querySelector(`input[type="radio"][name=sortingAlgo]:checked`).value;
        switch (sortingAlgo) {
            case "bubbleSort":
                bubbleSort(array);
                break;
            case "selectionSort":
                selectionSort(array);
                break;
            case "insertionSort":
                insertionSort(array);
                break;
            case "quickSort":
                quickSort(array);
                break;
            case "mergeSort":
                mergeSort(array);
                break;
        }

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
            btnSortElement.disabled = false;
        } else {
            rangeAnimationSliderElement.disabled = true;
            btnArrayGenElement.disabled = true;
            btnSortElement.disabled = true;
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

        let fragment = new DocumentFragment(); // Create the fragment

        array.forEach((item, index) => {
            const boxItem = document.createElement("div");
            boxItem.className = BOX_STYLE_CLASS;
            boxItem.style.height = item + "px";
            boxItem.innerHTML = item;
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
     * --- Set the height of this box to the secondIndex value in pixels and innerHTML text vaue to secondIndex value.
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

        const boxHTMLCollection = document.getElementsByClassName(BOX_STYLE_CLASS);

        for (let i = 0; i < animationsLength; i++) { // start animation
            let animationStep = animations[i];

            let firstIndex = animationStep.firstIdx;
            let secondIndex = animationStep.secondIdx;
            let positionChangeCheck = animationStep.ifPosChange;
            let animationStepColor = animationStep.color;

            if (positionChangeCheck) {
                const box = boxHTMLCollection.item(firstIndex);

                setTimeout(() => {
                    box.style.height = secondIndex + "px";
                    box.innerHTML = secondIndex;

                    if (i === (animationsLength - 1)) { // enable UI Elements
                        enableDisableUIElements(true);
                    }

                }, (i * animationPace));

            } else {
                const box1 = boxHTMLCollection.item(firstIndex);

                if (secondIndex === -1) { // quickSort case, pivot element coloring
                    setTimeout(() => {
                        box1.style.backgroundColor = animationStepColor;

                        if (i === (animationsLength - 1)) { // enable UI Elements
                            enableDisableUIElements(true);
                        }

                    }, (i * animationPace));

                } else {
                    const box2 = boxHTMLCollection.item(secondIndex);

                    setTimeout(() => {
                        box1.style.backgroundColor = animationStepColor;
                        box2.style.backgroundColor = animationStepColor;

                        if (i === (animationsLength - 1)) { // enable UI Elements
                            enableDisableUIElements(true);
                        }

                    }, (i * animationPace));
                }
            }
        } // animation ends

        console.log("DONE!");
    }

    /**
     * 
     */
    function generateRandomArray() {
        array.length = 0; // clear the array

        for (let count = 0; count < 20; count++) { // add 20 numbers in the range 50 to 350
            array.push(getRandomInt(50, 350));
        }

        divInputArrItemsElement.innerHTML = '[' + array + ']'; // set array in the input array 
        divSortedArrItemsElement.innerHTML = "[]"; // reset sorted array area
        showBoxes(array); // call to display array boxes into divbars div section
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
            case "5": return 87;
            case "10": return 75;
            case "15": return 64;
            case "20": return 54;
            case "25": return 45;
            case "30": return 37;
            case "35": return 29;
            case "40": return 21;
            case "45": return 13;
            case "50": return 5;
        }
    }

    /* ******************************************************** */
    /* *************** SORTING ALGORITHMS ********************* */
    /* ******************************************************** */


    // bubble sort
    function bubbleSort(array) {
        animations.length = 0; // reset animation array

        for (let i = 0; i < array.length; i++) { // bubble sort starts
            let sortingFlag = false; // to optimize the sorting, once array is sorted, no more iterations will be made

            for (let j = 0; j < array.length - i - 1; j++) { // inner for loop starts

                // push current indexes in comparison to the animations array 
                animations.push(new AnimationStep(j, j + 1, false, COMPARISON_COLOR)); // change color to comparison
                animations.push(new AnimationStep(j, j + 1, false, ORIGINAL_COLOR)); // back to original color

                if (array[j] > array[j + 1]) { // If the condition is true then swap them
                    sortingFlag = true;

                    let temp1 = array[j];
                    let temp2 = array[j + 1];

                    array[j] = temp2;
                    array[j + 1] = temp1;

                    // push swap operation in the animations array
                    animations.push(new AnimationStep(j, temp2, true, ORIGINAL_COLOR)); // index, item height, true
                    animations.push(new AnimationStep(j + 1, temp1, true, ORIGINAL_COLOR)); // index, item height, true
                }

            } // inner for loop ends

            if (sortingFlag === false) { // check if array is sorted now
                break;
            }

        } // bubble sort ends

        console.log("Bubble Sort Array: " + array); // Print the sorted array
        divSortedArrItemsElement.innerHTML = '[' + array + ']';

        showAnimations(animations); // call animation display
    }

    // seletion sort
    function selectionSort(array) {
        animations.length = 0;

        let arrayLen = array.length;

        // One by one move boundary of unsorted subarray
        for (let i = 0; i < arrayLen - 1; i++) {
            // Find the minimum element in unsorted array
            let min_idx = i;
            for (let j = i + 1; j < arrayLen; j++) {
                // push current indexes in comparison to the animations array 
                animations.push(new AnimationStep(j, min_idx, false, COMPARISON_COLOR)); // change color to comparison
                animations.push(new AnimationStep(j, min_idx, false, ORIGINAL_COLOR)); // back to original color

                if (array[j] < array[min_idx]) {
                    min_idx = j;
                }
            }
            // Swap the found minimum element with the first element
            // swap(arr, min_idx, i);
            let temp = array[i];
            let temp2 = array[min_idx];
            array[i] = temp2;
            array[min_idx] = temp;

            // push swap operation in the animations array
            animations.push(new AnimationStep(i, temp2, true, ORIGINAL_COLOR)); // index, item height, true
            animations.push(new AnimationStep(min_idx, temp, true, ORIGINAL_COLOR)); // index, item height, true
        }

        // print sorted array
        console.log("Selection sort Array: " + array);
        divSortedArrItemsElement.innerHTML = '[' + array + ']';

        // call animation show
        showAnimations(animations);
    }

    // insertion sort
    function insertionSort(array) {
        // reset animations array
        animations.length = 0;

        let arrayLen = array.length;

        for (let i = 1; i < arrayLen; i++) {
            let key = array[i];
            let j = i - 1;

            // push current indexes in comparison to the animations array
            animations.push(new AnimationStep(j, i, false, COMPARISON_COLOR));
            animations.push(new AnimationStep(j, i, false, ORIGINAL_COLOR));

            /* Move elements of arr[0..i-1], that are greater than key, to one position ahead of their current position */
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                animations.push(new AnimationStep(j + 1, array[j], true, ORIGINAL_COLOR)); // index, item height, true
                j = j - 1;
            }
            array[j + 1] = key;
            // push swap operation in the animations array
            animations.push(new AnimationStep(j + 1, key, true, ORIGINAL_COLOR)); // index, item height, true
        }

        // print sorted array
        console.log("Insertion Sorted Array : " + array);
        divSortedArrItemsElement.innerHTML = '[' + array + ']';

        // call animation show
        showAnimations(animations);
    }

    // quick sort helper for partitioning
    function partition(array, low, high, animations) {
        let temp, temp2;
        let pivot = array[high];

        // color pivot element
        animations.push(new AnimationStep(high, -1, false, 'green')); // secondIndex -1 means just the firstIndex needs to be operated

        // index of smaller element
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {

            if (array[j] <= pivot) {
                i++;

                if (i !== j) {
                    animations.push(new AnimationStep(i, j, false, COMPARISON_COLOR)); // secondIndex -1 means just the firstIndex needs to be operated
                    animations.push(new AnimationStep(i, j, false, ORIGINAL_COLOR));
                } else {
                    // change color of current index in comparison
                    animations.push(new AnimationStep(j, -1, false, COMPARISON_COLOR)); // secondIndex -1 means just the firstIndex needs to be operated
                    animations.push(new AnimationStep(j, -1, false, ORIGINAL_COLOR));
                }

                temp = array[i];
                temp2 = array[j];
                array[i] = temp2;
                array[j] = temp;
                // position change
                animations.push(new AnimationStep(i, temp2, true, ORIGINAL_COLOR)); // index, item height, true
                animations.push(new AnimationStep(j, temp, true, ORIGINAL_COLOR)); // index, item height, true
            } else {
                // change color of current index in comparison
                animations.push(new AnimationStep(j, -1, false, COMPARISON_COLOR)); // secondIndex -1 means just the firstIndex needs to be operated
                animations.push(new AnimationStep(j, -1, false, ORIGINAL_COLOR));
            }
        }

        // color pivot element back to original
        animations.push(new AnimationStep(high, -1, false, ORIGINAL_COLOR)); // secondIndex -1 means just the firstIndex needs to be operated

        // swap arr[i+1] and arr[high]
        temp = array[i + 1];
        temp2 = array[high];
        array[i + 1] = temp2;
        array[high] = temp;

        // position change
        animations.push(new AnimationStep(i + 1, temp2, true, ORIGINAL_COLOR)); // index, item height, true
        animations.push(new AnimationStep(high, temp, true, ORIGINAL_COLOR)); // index, item height, true

        return i + 1;
    }

    // quick sort helper
    function quickSortHelper(array, low, high, animations) {
        // Create an auxiliary stack
        let stack = new Array(high - low + 1);
        stack.fill(0);

        let top = -1;

        stack[++top] = low;
        stack[++top] = high;

        while (top >= 0) {
            high = stack[top--];
            low = stack[top--];

            let p = partition(array, low, high, animations);

            if (p - 1 > low) {
                stack[++top] = low;
                stack[++top] = p - 1;
            }

            if (p + 1 < high) {
                stack[++top] = p + 1;
                stack[++top] = high;
            }
        }
    }

    // quick sort 
    function quickSort(array) {
        animations.length = 0;
        quickSortHelper(array, 0, array.length - 1, animations);

        // sorted array
        console.log("Quick Sort Array: " + array);
        divSortedArrItemsElement.innerHTML = '[' + array + ']';

        // animation show
        showAnimations(animations);
    }


    // merge sort helper : merge
    function merge(array, left, mid, right, animations) {
        let n1 = mid - left + 1;
        let n2 = right - mid;
        let midTracker = mid + 1;
        let leftTracker = left;

        // Create temp arrays
        let L = new Array(n1);
        let R = new Array(n2);

        // Copy data to temp arrays L[] and R[]
        for (let i = 0; i < n1; i++)
            L[i] = array[left + i];
        for (let j = 0; j < n2; j++)
            R[j] = array[mid + 1 + j];

        // Merge the temp arrays back into arr[l..r]

        // Initial index of first subarray
        let i = 0;

        // Initial index of second subarray
        let j = 0;

        // Initial index of merged subarray
        let k = left;

        while (i < n1 && j < n2) {
            // color change for comparing indexes
            animations.push(new AnimationStep(leftTracker, midTracker, false, COMPARISON_COLOR));
            animations.push(new AnimationStep(leftTracker, midTracker, false, ORIGINAL_COLOR));

            if (L[i] <= R[j]) {
                let temp1 = L[i];
                array[k] = temp1;
                // position change
                animations.push(new AnimationStep(k, temp1, true, ORIGINAL_COLOR));
                i++;
                leftTracker = leftTracker + 1;
            }
            else {
                let temp2 = R[j];
                array[k] = temp2;
                // position change
                animations.push(new AnimationStep(k, temp2, true, ORIGINAL_COLOR));
                j++;
                midTracker = midTracker + 1;
            }
            k++;
        }

        // Copy the remaining elements of
        // L[], if there are any
        while (i < n1) {
            let temp = L[i];
            array[k] = temp;
            animations.push(new AnimationStep(k, temp, true, ORIGINAL_COLOR)); // position change
            i++;
            k++;
        }

        // Copy the remaining elements of
        // R[], if there are any
        while (j < n2) {
            let temp = R[j];
            array[k] = temp;
            animations.push(new AnimationStep(k, temp, true, ORIGINAL_COLOR)); // position change
            j++;
            k++;

        }
    }

    // merge sort helper
    function mergeSortHelper(array, left, right, animations) {
        if (left >= right) {
            return;//returns recursively
        }
        let mid = left + parseInt((right - left) / 2);
        mergeSortHelper(array, left, mid, animations);
        mergeSortHelper(array, mid + 1, right, animations);
        merge(array, left, mid, right, animations);
    }


    // merge sort
    function mergeSort(array) {
        // reset animations 
        animations.length = 0;

        mergeSortHelper(array, 0, array.length - 1, animations);

        // sorted array
        console.log("Merge Sort Array: " + array);
        divSortedArrItemsElement.innerHTML = '[' + array + ']';

        // show animations
        showAnimations(animations);
    }

})();
