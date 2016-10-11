function ModalController() {
    var modalCtrl = this;
    modalCtrl.activeSnap = {};

    window.modalCtrl = modalCtrl;

    modalCtrl.openModal = function() {
        console.log('Open Modal event');
        modalCtrl.editing = true;

        //var goTo = confirm(modalCtrl.canData);


        //Open Modal Window
        document.getElementById("modalBox").style.zIndex = "3";
        var vid = document.querySelector("video");

        modalCtrl.vid = vid; //attach video to controller
        modalCtrl.canData = vid.data;
        //console.log("tips: " + modalCtrl.canData.tips);
        //load video into modal window

        var h = modalCtrl.vid.videoHeight * 0.25
        var w = modalCtrl.vid.videoWwidth * 0.25
        console.log(vid, h, w);
        modalCtrl.vid.pause();
        var canvas = document.getElementById('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(modalCtrl.vid, 0, 0, w, h);
        var tmpImgData = canvas.toDataURL();
        console.log("Time Stamp of the pic--->" + modalCtrl.vid.currentTime);
        console.log("height: " + h + "width: " + w)
        modalCtrl.modalBoxStyles = {
            "height": h + "px",
            "width": w + "px"
        }
        modalCtrl.saveModal = function() {
            if (modalCtrl.activeSnap.imgSnapped) {
                modalCtrl.editing = false;
                modalCtrl.activeSnap.imgComments = modalCtrl.canData.tips;
                modalCtrl.canData.tips = "";
                modalCtrl.activeSnap = {};
            } else {

                modalCtrl.canData.push({
                    imgGName: "John Green",
                    imgGEmail: "",
                    imgSwingSegment: "Back Swing",
                    imgData: tmpImgData,
                    imgTimeStamp: modalCtrl.vid.currentTime,
                    imgComments: modalCtrl.canData.tips,
                    imgScreenShotNum: modalCtrl.canData.length,
                    imgSnapped: true
                })
            }

            modalCtrl.editing = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            modalCtrl.canData.tips = "";
        }
        modalCtrl.Close = function() {
            modalCtrl.editing = false;

        }

        modalCtrl.removeItem = function($index) {
            modalCtrl.canData.splice($index, 1);
            modalCtrl.activeSnap = {};
            modalCtrl.canData.tips = "";
        }


        modalCtrl.loadSnapshot = function(index, imageData, tips, event) {
            //console.log("index " + index);
            modalCtrl.activeSnap = imageData;
            modalCtrl.activeSnap.imgSnapped = true;

            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            ctx.drawImage(event.target, 0, 0);
            modalCtrl.editing = true;
            modalCtrl.canData.tips = imageData.imgComments;

        }
    }
}


var moveModal = function() {
    var selected = null, // Object of the element to be moved
        x_pos = 0,
        y_pos = 0, // Stores x & y coordinates of the mouse pointer
        x_elem = 0,
        y_elem = 0; // Stores top, left values (edge) of the element

    // Will be called when user starts dragging an element
    function _drag_init(elem) {
        // Store the object of the element which needs to be moved
        selected = elem;
        x_elem = x_pos - selected.offsetLeft;
        y_elem = y_pos - selected.offsetTop;
    }

    // Will be called when user dragging an element
    function _move_elem(e) {
        x_pos = document.all ? window.event.clientX : e.pageX;
        y_pos = document.all ? window.event.clientY : e.pageY;
        if (selected !== null) {
            selected.style.left = (x_pos - x_elem) + 'px';
            selected.style.top = (y_pos - y_elem) + 'px';
        }
    }

    // Destroy the object when we are done
    function _destroy() {
        selected = null;
    }

    // TODO - fix this!
    // Bind the functions...
    document.getElementById('modalBox').onmousedown = function() {
        _drag_init(this);
        // return false;
    };

    document.onmousemove = _move_elem;
    document.onmouseup = _destroy;
}