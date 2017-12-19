var gl;

var canvas;

//variables for helicopter controllers
var x = 0.0; //moves in the x axis (front / back)
var y = 0.0; //moves in the y axis (up / down)
var z = 0.0;
var angle1 = 0;
var angle2 = 0;
var rotateHel = 0;
// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;

var projection;
var modelView;
var view;

matrixStack = [];

function pushMatrix()
{
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix() 
{
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    
    setupProjection();
    setupView();
}

function setupProjection() {
    //projection = perspective(60, 1, 0.1, 100);
    projection = ortho(-1,1,-1,1,0.1,100);

}

function changeView() {
    //var y = Math.asin(Math.sqrt(Math.tan(42*Math.PI/180)*Math.tan(7*Math.PI/180)));
    //var t = Math.atan(Math.sqrt(Math.tan(42*Math.PI/180)/Math.tan(7*Math.PI/180)))-(Math.PI/2);
    var y = document.getElementById("y").value;
    var t = document.getElementById("t").value;
    modelView = mult(modelView, rotateX(y*180/Math.PI));
    modelView = mult(modelView, rotateY(t*180/Math.PI));
}

function setupView() {
    view = lookAt([0,0,5], [0,0,0], [0,1,0]);
    modelView = mat4(view[0], view[1], view[2], view[3]);
    changeView();
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));
    
    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));  

    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));
    
    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));  
}

function draw_sphere(color)
{
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color)
{
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color)
{
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}
/**
function draw_scene()
{
    
    //var d = (new Date()).getTime();
    
    //multTranslation([0,Math.sin(d/500),0]);
    pushMatrix();
        multTranslation([0,1,0]);
       // multRotZ(d/5);
        draw_cube([0,0,1]);
    popMatrix();
    pushMatrix();
      //  multRotY((d/100));
        pushMatrix();
            multTranslation([-2.0,0, 0.0]);
            draw_sphere([1.0, 0.0, 0.0]);
        popMatrix();
        pushMatrix();
            pushMatrix();
                multTranslation([2,0,0]);
                draw_cylinder([0.0, 1.0, 0.0]);
            popMatrix();
        popMatrix();
    popMatrix();
}**/

function draw_scene(){
    var d = (new Date()).getTime();
	
	//Helicopter
    pushMatrix();
        multRotY(rotateHel);
		multTranslation([x, y , z]);
		multScale([0.25,0.25,0.25]);
		
		//multRotY(90);
		//multRotX(90);
	
        //center
        pushMatrix();
			multScale([1.3,0.8,0.8]);
			draw_sphere([0.562,0.691,0.300]);
        popMatrix();
		
		//Top Helice
		pushMatrix();
		
			//Support
			pushMatrix();
				multTranslation([0.0,0.3,0.0]);
				multScale([0.05,0.5,0.05]);
				draw_cube([1.0,1.0,1.0]);
			popMatrix();
			
			//helices			
			pushMatrix(); 			
				multTranslation([0.0,0.3,0.0]);
				multRotY(d);
					
				//helice1
				pushMatrix();
					multTranslation([-0.5,0.2,0.0]);
					multScale([1.0,0.1,0.09]);
					draw_sphere([0.1,0.5,0.2]);	
				popMatrix();
			
				//helice2
				pushMatrix();
					multTranslation([0.5,0.2,0.0]);
					multScale([1.0,0.1,0.09]);
					draw_sphere([0.1,0.5,0.2]);	
				popMatrix();				
			popMatrix();
			
		popMatrix();
		
		//Tail
		pushMatrix();
		multTranslation([-0.1,-0.1,0.0]);
		
			//smallTail
			pushMatrix();
				multTranslation([1.55,0.4,0.0]);
				multRotZ(45);
				multScale([0.3,0.15,0.15]);
				draw_sphere([0.562,0.691,0.300]);
			popMatrix();
			
			//bigTail
			pushMatrix();
				multTranslation([1.0,0.3,0.0]);
				multScale([1.0,0.2,0.2]);
				draw_sphere([0.562,0.691,0.300]);
			popMatrix();
			
			//point
			pushMatrix();
				multTranslation([1.55,0.4,0.1]);
				multRotX(90);
				multScale([0.09,0.09,0.1]);
				draw_sphere([0.3,0.1,0.9]);
			popMatrix();
			
			//helices			
			pushMatrix(); 
				multTranslation([1.55,0.4,0.1]);
				multRotZ(d);
					
				//helice1
				pushMatrix();				
					multTranslation([-0.15,0.0,0.0]);					
					multScale([0.3,0.1,0.09]);
					draw_sphere([0.1,0.5,0.2]);				
				popMatrix();
			
				//helice2
				pushMatrix();
					multTranslation([0.15,0.0,0.0]);				
					multScale([0.3,0.1,0.09]);
					draw_sphere([0.1,0.5,0.2]);				
				popMatrix();				
					
			popMatrix();
		
		popMatrix();
		
		//Landing Things
		pushMatrix();
			multTranslation([0.0,-0.4,0.0]);
			
			//landing 1
			pushMatrix();
				multTranslation([0.0,0.0,-0.2]);
				multRotX(45);
				//Right Leg
				pushMatrix();
					multTranslation([0.2,0.0,0.0]);
					multRotZ(45);
					multScale([0.05,0.5,0.05]);				
					draw_sphere([1.0,1.0,1.0]);			
				popMatrix();
				
				//left Leg
				pushMatrix();
					multTranslation([-0.2,0.0,0.0]);
					multRotZ(-45);
					multScale([0.05,0.5,0.05]);				
					draw_sphere([1.0,1.0,1.0]);			
				popMatrix();
				
				//base
				pushMatrix();
					multTranslation([0.0,-0.15,0.0]);
					multRotX(-45);
					multScale([1.2,0.08,0.08]);
					draw_cube([1.0,0.0,0.0]);				
				popMatrix();
			popMatrix();
			
			//landing 2
			pushMatrix();
				multTranslation([0.0,0.0,0.2]);
				multRotX(-45);
				
				//Right Leg
				pushMatrix();
					multTranslation([0.2,0.0,0.0]);
					multRotZ(45);
					multScale([0.05,0.5,0.05]);				
					draw_sphere([1.0,1.0,1.0]);			
				popMatrix();
				
				//left Leg
				pushMatrix();
					multTranslation([-0.2,0.0,0.0]);
					multRotZ(-45);
					multScale([0.05,0.5,0.05]);				
					draw_sphere([1.0,1.0,1.0]);			
				popMatrix();
				
				//base
				pushMatrix();
					multTranslation([0.0,-0.15,0.0]);
					multRotX(45);
					multScale([1.2,0.08,0.08]);
					draw_cube([1.0,0.0,0.0]);				
				popMatrix();
			popMatrix();
		
		popMatrix();
    popMatrix();
    var a = 42;
    var b = 7;
    //floor
    pushMatrix();
        multTranslation([0.0,-2.0,0.0]);
        multScale([5.0,0.0001,5.0])
        draw_cube([0.0,1.0,0.0]);
    popMatrix();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    setupView();
    
    // Send the current projection matrix
    var mProjection = gl.getUniformLocation(program, "mProjection");
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));
        
    draw_scene();
    requestAnimFrame(render);
}


window.onresize = function canvasResize(){
    canvas = document.getElementById("gl-canvas");
    canvas.width = 900;
    canvas.height = 900;
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    initialize();
            
    render();
    
}

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    canvas.width = 900;
    canvas.height = 900;
    canvas.style.left = "500px";
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    initialize();
            
    render();
}

window.addEventListener("keydown", function moveHelicopter(e){
	if(e.keyCode == 40) {
        if(y>-0.95){
            y -= 0.03;
        }//ArrowDown
		
	} else if (e.keyCode == 38) { //ArrowUp
		y += 0.03;
		
	} else if (e.keyCode == 37) { //ArrowLeft
		x = 0.5*Math.sin(angle1+50);
        z = 0.5*Math.cos(angle1+50);
        rotateHel +=15;
		
	} else if (e.keyCode == 39) { //ArrowRight
		x = 0.5*Math.sin(angle1-50);
        z = 0.5*Math.cos(angle1-50);
        rotateHel -=15;
		
	}
	 
	
});


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
