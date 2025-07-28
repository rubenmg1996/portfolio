var font;
let boids = [];
var puntos = [];
var frase;
var canvasWidth;
var canvasHeight;
var metodoBuscarGoal = 0;
var metodoInitBoids = 1;

canvasWidth = 1500;
canvasHeight = 300;

function initBoids(){
  if(metodoInitBoids == 0){
    
    for (let i = 0; i < puntos.length; i++) {
      let pos_x = Math.random() * canvasWidth;
      let pos_y = Math.random() * canvasHeight;

  
      let particula = new Boid(pos_x, pos_y, createVector(0,0));
      
      
      let c = lerpColor(
        color(255, 0, 0),     // Rojo
        color(0, 0, 255),     // Azul
        i / puntos.length     // Interpolación por índice
      );
      particula.color = c;

      particula.maxspeed = 3;
  
      boids.push(particula);
    }
  }else if(metodoInitBoids == 1){
    for(let i = 0; i < puntos.length; i++){
      
      let pos_x = Math.random() * 30;
      let pos_y = Math.random() * canvasHeight;
      
      let particula = new Boid(pos_x, pos_y, createVector(0,0), Math.random() * 5, Math.random());

      let c = lerpColor(
        color(255, 0, 0),     // Rojo
        color(0, 0, 255),     // Azul
        i / puntos.length     // Interpolación por índice
      );
      particula.color = c;
      
      particula.maxspeed = 5;
      
      boids.push(particula);
      
    }
    
  } else if (metodoInitBoids == 2){
    
     let radioMax = 50;
     for(let i = 0; i < puntos.length; i++){
       
      let angulo = Math.random() * Math.PI * 2;
      let radio = Math.random() * radioMax;
      
      let pos_x = canvasWidth / 2 + Math.cos(angulo) * radio;
      let pos_y = canvasHeight / 2 + Math.sin(angulo) * radio;      
      
      let centroCanvas = createVector(canvasWidth / 2, canvasHeight / 2);
      let posVector = createVector(pos_x, pos_y);
      let velVector = p5.Vector.sub(posVector, centroCanvas);
      velVector.setMag(6);
      
      let particula = new Boid(pos_x, pos_y, createVector(0,0), velVector.x, velVector.y);

      let c = lerpColor(
        color(255, 0, 0),     // Rojo
        color(0, 0, 255),     // Azul
        i / puntos.length     // Interpolación por índice
      );
      particula.color = c;
      
      particula.maxspeed = 6;
      
      boids.push(particula);
      
    }
    
  }
  
}

let particleSprite;

function createParticleSprite(diameter) {
  let pg = createGraphics(diameter, diameter);
  pg.noStroke();
  
  let center = diameter / 2;
  let steps = 10;
  
  for (let i = steps; i > 0; i--) {
    let inter = i / steps;
    let c = lerpColor(pg.color('#89D2DC'), pg.color('#101D42'), inter);
    pg.fill(c);
    pg.ellipse(center, center, diameter * inter, diameter * inter);
  }
  
  return pg;
}

function initFlock() {

  initBoids();

  if(metodoBuscarGoal == 0){
      boids.sort((a, b) => a.position.x - b.position.x);
      puntos.sort((a, b) => a.x - b.x);
      calcularGoalAlt();
  }else if(metodoBuscarGoal == 1){
      shuffleArray(boids);
      shuffleArray(puntos);
      calcularGoalRandom();
  }

  for (let i = 0; i < boids.length; i++) {
    boids[i].render();
  }
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio entre 0 e i
    [array[i], array[j]] = [array[j], array[i]];  // Intercambiar elementos
  }
}

function calcularGoalRandom(){
  for (let i = 0; i < boids.length; i++){
      
      boids[i].goal = createVector(puntos[i].x, puntos[i].y);
      
  }
}

function calcularGoalAlt() { // Calcular la partícula más cercana a cada punto
  let puntosAux = [...puntos]; // Copia del vector puntos
  
  for (let i = 0; i < boids.length; i++) {
    let distanciaMin;
    let puntoCercano;
    
    // Buscar el punto más cercano para cada boid
    for (let j = 0; j < puntosAux.length; j++) {
      let punto = puntosAux[j];
      let distancia = Math.sqrt(
        Math.pow(punto.x - boids[i].position.x, 2) +
        Math.pow(punto.y - boids[i].position.y, 2)
      ); // Calcular la distancia entre el boid y el punto

      // Si es la primera distancia o la distancia es menor, actualizar el punto más cercano
      if (distanciaMin == null || distancia < distanciaMin) {
        puntoCercano = j;
        distanciaMin = distancia;
      }
    }
    
    // Asignar el punto más cercano como el objetivo (goal) del boid
    boids[i].goal = createVector(puntosAux[puntoCercano].x, puntosAux[puntoCercano].y);
    
    // Remover el punto ya asignado para evitar que dos boids compartan el mismo punto
    puntosAux.splice(puntoCercano, 1);
  }
}



function calcularGoal() //Calcular el punto mas cercano a cada partícula
{
  
  let boidsAux = [...boids];
  for(let i=0; i < puntos.length; i++)
  {
    let distanciaMin;
    let particulaCercana;
    for(let j= 0; j < boidsAux.length; j++)
    {
      let boidPosicion = boidsAux[j].position;
      let distancia = Math.sqrt(
        Math.pow(puntos[i].x - boidPosicion.x, 2) + 
        Math.pow(puntos[i].y - boidPosicion.y, 2)
      );// distancia entre puntosAux[i] y boids[j]
      let indice;
      if(distanciaMin == null || distancia < distanciaMin)
      { 
        particulaCercana = j;
        distanciaMin = distancia;
      }
      
    }
      boidsAux[particulaCercana].goal = createVector(puntos[i].x, puntos[i].y);
      boidsAux.splice(particulaCercana, 1);
  }
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
     metodoBuscarGoal = 1;
     boids= [];
     initFlock();
  } else if (key === 'A' || key === 'a') {
     metodoBuscarGoal = 0;
     boids= [];
     initFlock();
  } else if(key === '1') {
    metodoInitBoids = 1;
    boids= [];
    initFlock();
  } else if(key === '3') {
    metodoInitBoids = 0;
    boids= [];
    initFlock();
  } else if(key === '2') {
    metodoInitBoids = 2;
    boids= [];
    initFlock();
  }
}

function draw_points()
{
  for (i=0; i<puntos.length;i++){
    var p = puntos[i];
    stroke(0,255,0);
    strokeWeight(4);
    point(p.x, p.y);
  }
}


function preload() {
  font = loadFont("LetterGothicStd.otf");
}

function calcularTamañoFuente() {
  const container = select('#canvas-container');
  const containerWidth = container.width;
  return Math.min(containerWidth * 0.15, 164);
}

function setup() {

  let container = select('#canvas-container');
  canvasWidth = container.width;
  canvasHeight = 300;
  
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  
  canvas.parent('canvas-container');
  background(13,19,23);
  textFont(font); 
  textSize(164);
  fill(255);
  noStroke();

  // Hacer el diámetro máximo responsive según el ancho del canvas
  let maxDiameter = constrain(canvasWidth * 0.007, 6, 16);
  particleSprite = createParticleSprite(maxDiameter);
  console.log(maxDiameter);
  
  frase = 'BIENVENIDO';
  
  // Calcular el ancho del texto


  //let container = select('#canvas-container');

  resizeCanvas(container.width, 300);


  
  // Posición y vertical (centrada)
  let textoY = height / 2 + 60; // Ajuste para centrado vertical
  
  let fontSize = calcularTamañoFuente();
  textSize(fontSize);

  let textoAncho = textWidth(frase);
  let textoX = (canvasWidth - textoAncho) / 2;

  puntos = font.textToPoints(frase, textoX, textoY, fontSize, {
    sampleFactor: 0.15,
    simplifyThreshold: 0.0
  });
  
  
  initFlock();
}

function windowResized() {

  let container = select('#canvas-container');
  canvasWidth = container.width;

  let maxDiameter = constrain(canvasWidth * 0.01, 4, 10);
  particleSprite = createParticleSprite(maxDiameter);
  console.log(maxDiameter);
  
  resizeCanvas(canvasWidth, canvasHeight);
  
  // Recalcular posición del texto
  let fontSize = calcularTamañoFuente();
  textSize(fontSize);
  
  let textoAncho = textWidth(frase);
  let textoX = (canvasWidth - textoAncho) / 2;


  let textoY = height / 2 + 60;
  
  textSize(fontSize);
  puntos = font.textToPoints(frase, textoX, textoY, fontSize, {
    sampleFactor: 0.15,
    simplifyThreshold: 0.0
  });
  
  // Reiniciar los boids para que se adapten a la nueva posición
  boids = [];
  initFlock();
}


let textAlpha = 0;
let fadeSpeed = 8; 

function draw() {


  background(13,19,23);

  let container = select('#canvas-container');
  canvasWidth = container.width;
  canvasHeight = container.height;

    let mouseOverCanvas = (
    mouseX >= 0 && mouseX <= canvasWidth &&
    mouseY >= 0 && mouseY <= canvasHeight
  );

  // Animar la opacidad del texto
  if (mouseOverCanvas) {
    textAlpha = lerp(textAlpha, 255, 0.1); // Fade in
  } else {
    textAlpha = lerp(textAlpha, 0, 0.1);   // Fade out
  }

  // Mostrar el texto con opacidad si es visible
  if (textAlpha > 1) {
    fill(255, textAlpha); // Aplicar opacidad
    let responsiveSize = constrain(canvasWidth * 0.02, 10, 24);
    textSize(responsiveSize);
    textAlign(CENTER);
    text('Pulsa 1, 2 o 3; R o A para cambiar el comportamiento inicial', canvasWidth / 2, canvasHeight - 30);
  }
    for (let i = 0; i < boids.length; i++) {
    boids[i].run(boids);  // Actualizar y dibujar cada boid
  }
  
}
