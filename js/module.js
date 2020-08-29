var canvas = new fabric.Canvas('image-canvas', {
    isDrawingMode: true
});
fabric.Object.prototype.transparentCorners = false;
$(document).on("click","#drawing-mode", function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        $('#drawing-mode').html('Cancel drawing mode');
        $('#drawing-mode-options').show(), $('.not-drawing').hide();
    } else {
        $('#drawing-mode').html('Enter drawing mode');
        $('#drawing-mode-options').hide(), $('.not-drawing').show();
    }
});
$(document).on("click","#clear-canvas", function() { canvas && canvas.clear(); });
$(document).on("change","#drawing-line-width", function() { 
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
});
$(document).on("change","#drawing-color", function() { 
    canvas.freeDrawingBrush.color = this.value;
});
$(document).on("click","#addText", function() {
    var textvalue = $("#printText").val();
    canvas.discardActiveObject().renderAll();
    if (canvas && textvalue && textvalue.trim()){
        var textObj = new fabric.IText(textvalue, {
            left: 100, top: 100,
            fontSize: 24, fill: "#000000",
            fontFamily: 'helvetica neue',
            strokeWidth: .1, fontSize: 24,
            originX: 'center', originY: 'center',
        });
        canvas.add(textObj), canvas.setActiveObject(textObj), 
        canvas.renderAll(), $("#printText").val('');
    }
});
$(document).on("click","#addImage", function(e) {
    var imgUrl = 'images/tmp.jpg';
    canvas.discardActiveObject().renderAll();
    if(canvas){
        fabric.Image.fromURL(imgUrl, function(img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width, scaleY: canvas.height / img.height
            });
            canvas.renderAll();
        });
    }         
});
$(document).on("click","#output", function() { canvas && canvas.toDataURL(); });
$(document).keydown(function(e) {
    var activeObj = canvas.getActiveObject();
    if(canvas && activeObj){
        e.keyCode == 46 && canvas.remove(activeObj);
        canvas.renderAll();
    }
});
function cornerSet(object){
    object.setControlsVisibility({ bl: true, br: true, tl: true, tr: true, mtr: false, mb: false, ml: false, mr: false, mt: false });
    object.set({
        borderColor: 'black', cornerSize: 15, cornerStyle: 'circle', 
        cornerBackgroundColor: 'white', cornerStrokeColor: 'blue', transparentCorners: false
    });
}
function canvasBrush(){
    if(canvas){
        canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = $('#drawing-color').val();
            canvas.freeDrawingBrush.width = parseInt($('#drawing-line-width').val(), 10) || 1;
        }
    }
}
canvas.on('object:selected', function(e) { cornerSet(e.target); });
canvas.on('object:added', function(e) { cornerSet(e.target); });
canvas.on("selection:cleared", function (e) { canvas.discardActiveObject().renderAll(); });
canvas.on("object:modified", function (e) { console.log('object Modified'); });
canvas.on("selection:updated", function (e) { console.log('Selection update'); });
canvas.on('text:changed', function(e) { console.log('Text Change'); });