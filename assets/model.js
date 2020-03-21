let faces = [],
    boxes = [],
    angle = 0.;



function preload() {
    for (let i = 0; i <3 ; i++){
    face = loadImage(`assets/cara${i}.jpg`);
    faces[i]=face;
    }
}

function setup() {
    canvas = createCanvas(windowWidth,windowHeight, WEBGL);
    canvas.position(0,0);
    canvas.style("z-index",-2);
    boxes[0] = new FaceBox(250,0,300);
    for (let i = 1; i < 20; i++) {
        let f = new FaceBox();
    boxes.push(f);
  }
}

function draw(){
    background(0,0,0,0);
    for (let i = 0; i < boxes.length ; i++) {
          boxes[i].show();
  }

}

class FaceBox{
    constructor(x = random(windowWidth/4,windowWidth/3), y = random(windowHeight/4,windowHeight/3), size =random(120,200)){
    this.size = size;
    this.face = random(faces);
    this.tx = x;
    this.ty = y;
    this.tz = random(-2,2);
    this.angle = random(-10,4);
    this.orientation=random(0,5);
  }

  show(){
      ambientLight(50, 0, 0);
      directionalLight(255, 255, 255, 0, -1, -2.5);
      translate(this.tx ,this.ty, this.tz);
      this.angle += 0.002;
      rotateY(this.orientation + this.angle);
      rotateZ(this.angle);
      rotateX(this.angle);
      box(this.size, this.size,this.size);
      texture(this.face);

    }
}
