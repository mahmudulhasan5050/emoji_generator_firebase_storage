
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";

//web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRGOVgiGK6hfcgm_QI9WfxviO2n5zRVX0",
    authDomain: "mycanvas-c564f.firebaseapp.com",
    databaseURL: "https://mycanvas-c564f-default-rtdb.firebaseio.com",
    projectId: "mycanvas-c564f",
    storageBucket: "mycanvas-c564f.appspot.com",
    messagingSenderId: "822991844854",
    appId: "1:822991844854:web:170e0c0e0a9984622ec3d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref, set, onValue }
    from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
const db = getDatabase();


const canvasIn = document.createElement("canvas");
document.getElementById("inputCanvas").appendChild(canvasIn)
canvasIn.width = window.innerWidth;
canvasIn.height = 500;
var c = canvasIn.getContext("2d");



var btnGiveName = document.getElementById("btnGiveName");
var btnSave = document.getElementById("btnSave");
var colorSelected = "#060606";
var colorNotSelected = "#b0b301"

//mouse location
var mouse = {
    x: undefined,
    y: undefined
}

//create circle
function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
}
const draw = (x, y, radius, color) => {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = color;
    c.fill();
}
const drawf = (x, y, radius, color, cOut) => {
    cOut.beginPath();
    cOut.arc(x, y, radius, 0, Math.PI * 2, false);
    cOut.fillStyle = color;
    cOut.fill();
}
const eightByEightDisplay = (x, y, radius, color, startPoint, increment) => {
    var circle = []
    for (var i = 0; i < 8; i++) {
        y += increment;
        for (var j = 0; j < 8; j++) {
            if (x <= startPoint + (radius * 2) * 7) {
                x += increment;
            } else {
                x = startPoint + increment;
            }
            circle.push(new Circle(x, y, radius, color));
        }
    }
    return circle
}

const fetchAllData = async () => {
    const arrayRef = await ref(db, "canvasArrays/");
    onValue(arrayRef, (snapshot) => {
        const array = snapshot.val();
        print(array);
    })
}
var circleArray = [];

const makeCircleFunction = () => {
    circleArray = [];
    var radius = 25;
    var color = colorNotSelected;
    var startPoint = Math.floor((canvasIn.width / 2) - radius * 8);
    var x = startPoint;
    var y = 0;
    var increment = 50;
    circleArray = eightByEightDisplay(x, y, radius, color, startPoint, increment);
}

// mouse click
document.addEventListener("mouseup", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
    circleArray.map((ele) => {
        if (mouse.x - ele.x < 20 && mouse.x - ele.x > -20 && mouse.y - ele.y < 20 && mouse.y - ele.y > -20) {
            if (ele.color === colorNotSelected) {
                ele.color = colorSelected;
            } else {
                ele.color = colorNotSelected
            }
        } else {
            ele
        }

    })

});




const showInputField = () => {
    document.getElementById("myForm").style.display = "block";

    const showForm = () => {
        var name = document.getElementById("eName");
        if (name.value !== "") {
            set(ref(db, "canvasArrays/" + name.value), {
                circleArray
            })
                .then(() => {
                    alert("data stored successfully");
                    location.reload();
                })
                .catch((error) => {
                    alert("unsuccessfull" + error)
                })

        } else {
            location.reload();
        }

    }
    btnSave.addEventListener("click", showForm);
}
btnGiveName.addEventListener("click", showInputField);

//print--------------------------------------------------------------
const print = (array) => {

    Object.keys(array).forEach(e => {
        var newArray = [];
        var circleFromDatabase = [];

        var iDiv = document.createElement('div');
        iDiv.className = 'block';
        document.getElementsByClassName('output')[0].appendChild(iDiv);

        var innerH = document.createElement('h3');
        innerH.className = 'emjName'
        var innerCanvas = document.createElement('canvas');
        innerCanvas.className = 'block-2';
        iDiv.appendChild(innerH).innerHTML = e
        iDiv.appendChild(innerCanvas);
        var cOut = innerCanvas.getContext("2d")

        var radius = 7;
        var color = colorNotSelected;
        var startPoint = Math.floor((innerCanvas.width / 2) - radius * 8);
        var x = startPoint;
        var y = 0;
        var increment = 14;
        newArray = eightByEightDisplay(x, y, radius, color, startPoint, increment);
        circleFromDatabase = array[e].circleArray;

        for (var k = 0; k < newArray.length; k++) {
            var x = newArray[k].x;
            var y = newArray[k].y;
            var radius = newArray[k].radius;
            var color = circleFromDatabase[k].color;
            drawf(x, y, radius, color, cOut);
        }
    })

}


function animate() {
    requestAnimationFrame(animate);   //create loop infinite
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circleArray.length; i++) {
        var x = circleArray[i].x;
        var y = circleArray[i].y;
        var radius = circleArray[i].radius;
        var color = circleArray[i].color;
        draw(x, y, radius, color, c);
    }
}
fetchAllData();
makeCircleFunction();
animate();
