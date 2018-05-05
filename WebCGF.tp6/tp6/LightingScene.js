var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

var FPS = 30;

class LightingScene extends CGFscene 
{
	constructor()
	{
		super();
	};

	init(application) 
	{
		super.init(application);

		this.initCameras();

		this.initLights();

		this.Paint = "Flames";
		this.PaintControl = "";

		this.Sun=true;
		this.CarLights=true;

		this.axisDisplay = true;

		this.gl.clearColor(0.7, 0.7, 1.0, 1.0);
		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);

		// Scene elements
		this.floor = new MyTerrain(this,20, 0,10,0,10);
		this.car = new MyOffRoadCar(this);
		
		//test
		this.trapezium = new MyTrapezium(this,5,0,0.1,2,0);
		this.wheel = new MyHandWheel(this);
		this.chassi = new MyCarChassi(this,1);
		this.model = new MyCarModel(this,"flames.jpg");



		// Materials
		

		// Textures
		this.enableTextures(true);

		this.materialDefault = new CGFappearance(this);
		this.materialDefault.loadTexture("../resources/images/lamptext.jpg");
		//this.materialDefault.setDiffuse(0,0,0.25,1);
		this.materialDefault.setAmbient(0.2,0.2,0.2,1);
		
		this.flame = new CGFappearance(this);
		this.flame.loadTexture("../resources/images/flames.jpg");
		//this.materialDefault.setDiffuse(0,0,0.25,1);
		this.flame.setAmbient(0.2,0.2,0.2,1);

		this.terrainAppearance = new CGFappearance(this);
		this.terrainAppearance.loadTexture("../resources/images/terrain.png");
	
		
		this.setUpdatePeriod(1000/FPS);
	};

	initCameras() 
	{
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
	};

	initLights() 
	{
		this.setGlobalAmbientLight(1,1,1, 1.0);
		
		this.lights[0].setPosition(0, 50, 0, 1);
		this.lights[0].setVisible(true);
		
		this.lights[0].setAmbient(1.0, 1.0, 1.0, 1);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[0].enable();

		this.lights[1].setPosition(-2, 1, 0, 1);
		this.lights[1].setVisible(true);
		
		this.lights[1].setAmbient(1.0, 1.0, 0.0, 1);
		this.lights[1].setDiffuse(1.0, 1.0, 0.0, 1.0);
		this.lights[1].enable();
	};

	updateLights() 
	{
		for (var i = 0; i < this.lights.length; i++)
			this.lights[i].update();
	};


	display() 
	{
		// ---- BEGIN Background, camera and axis setup

		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Update all lights used
		this.evalLights();
		this.updateLights();

		// Draw axis
		if(this.axisDisplay)
			this.axis.display();


		// ---- END Background, camera and axis setup

		// ---- BEGIN Scene drawing section
		
		// Floor
		this.pushMatrix();		
			this.terrainAppearance.apply();
			this.rotate(-90 * degToRad, 1, 0, 0);
			this.scale(50, 50, 0);
			//this.floor.display();
		this.popMatrix();
		
		this.pushMatrix();
			if(this.Paint != this.PaintControl)
			{
				this.car.setPaint(this.Paint);
				this.PaintControl = this.Paint;
			}
			this.car.display();
		this.popMatrix();

		// ---- END Scene drawing section

		// test
		this.pushMatrix();		
			
		this.popMatrix();
		
	};

	update(currTime)
	{
		this.lastTime = this.lastTime || 0;

		this.deltaTime = currTime - this.lastTime;

		this.lastTime = currTime;

		if(this.deltaTime <= 1000)
		{
			this.car.update(this.deltaTime);		
		}
	};

	toggleAxis()
	{
		this.axisDisplay = !this.axisDisplay;
	};

	evalLights()
	{
		if(this.Sun)
		{
			this.lights[0].enable();
		}
		else
		{
			this.lights[0].disable();
		}

		if(this.CarLights)
		{
			this.lights[1].enable();
		}
		else
		{
			this.lights[1].disable();
		}
	};

};


