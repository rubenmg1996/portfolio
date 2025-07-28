// clase Boid
// Métodos para separación, cohesión y alineamiento
class Boid {
  constructor(x,y, g, vx, vy) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(vx,vy) || p5.Vector.random2D();
    this.position = createVector(x, y);
    this.r = random(1, 5);
    this.maxspeed = 5;    // velocidad máxima
    this.maxforce = 0.25; // fuerza máxima de viraje
    this.goal = createVector(g.x, g.y); 
        this.r = window.innerWidth < 768 ? random(1, 3) : random(1, 5);
  
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  // las fuerzas son añadidas a la aceleración
  applyForce(force) {
    this.acceleration.add(force);
  }

  // acumulamos una nueva aceleración cada vez que el tiempo pasa, basado en tres reglas
  flock(boids) {
    let sk = this.arrive(this.goal);
    let sep = this.separate(boids); // separación
    //let ali = this.align(boids);    // alineamiento
    let coh = this.cohesion(boids); // cohesión
    let fl = this.flee(createVector(mouseX, mouseY)); // cohesión
    
    // darle un peso arbitrario a las fuerzas
    sep.mult(2.0);
   // ali.mult(1.0);
    coh.mult(0.5);
    sk.mult(2);
    fl.mult(3);
    // añade los vectores de fuerza a la aceleración
    this.applyForce(sep);
    //this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(sk);
    this.applyForce(fl);
  }

  // método para actualizar ubicación
  update() {
    let dt = 0.8;
    // actualizar velocidad
    this.velocity.add(p5.Vector.mult(this.acceleration, dt));
    // limitar velocidad
    this.velocity.limit(this.maxspeed);
    this.position.add(p5.Vector.mult(this.velocity, dt));
    // resetear aceleración a 0 en cada ciclo
    this.acceleration.mult(0);
  }

  // un método que aplica y calcula una fuera de viraje a un objetivo
  // viraje = deseado - velocidad
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // un vector apuntanto desde la ubicación y hacia el objetivo
    
    // normalizar deseado y escalar a velocidad máxima
    desired.normalize();
    desired.mult(this.maxspeed);
    // viraje = deseado menos velocidad
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // limitar a la fuerza máxima de viraje
    return steer;
  }
  
  flee(target) {
    let d = p5.Vector.dist(this.position, target);
    if (d < 25){
      let desired = p5.Vector.sub(this.position, target); // un vector apuntanto desde la ubicación y hacia el objetivo
      
      // normalizar deseado y escalar a velocidad máxima
      desired.normalize();
      desired.mult(this.maxspeed);
      // viraje = deseado menos velocidad
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce); // limitar a la fuerza máxima de viraje
      return steer;
    }
    else{
     return createVector(0,0);
    }  
}
  
  arrive(target) {
    let desired = p5.Vector.sub(target, this.position); // un vector apuntanto desde la ubicación y hacia el objetivo
    
    // normalizar deseado y escalar a velocidad máxima
    //desired.normalize();
    //desired.mult(this.maxspeed);
    desired.limit(this.maxspeed);
    // viraje = deseado menos velocidad
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // limitar a la fuerza máxima de viraje
    return steer;
  }

  // dibujar el boid como un círculo
render() {
  // Ajusta tamaño según this.r
  let d = this.r * 2;
  imageMode(CENTER);
  image(particleSprite, this.position.x, this.position.y, d, d);
}

  // wraparound, si se llega a un borde, aparecer por el borde opuesto
  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // separación
  // método que revisa si hay boids cercanos y vira para alejarse de ellos
  separate(boids) {
    let desiredseparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    // por cada boid en el sistema, revisar si está muy cerca
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      // si la distancia es mayor a 0 y menor que un tamaño arbitrario (0 cuando es sí mismo)
      //if ((d > 0) && (d < desiredseparation)) {
      if ((d > 0) && (d < (this.r+boids[i].r))) {
        // calcular vector apuntando para alejarse del vecino
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // peso según distancia
        steer.add(diff);
        count++; // contar cuántos
      }
    }
    // promedio -- dividir por la cantidad
    if (count > 0) {
      steer.div(count);
    }

    // mientas el vector sea mayor que 0
    if (steer.mag() > 0) {
      // implementar Reynolds: viraje = deseado - velocidad
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // alineamiento
  // por cada boid cercano en el sistema, calcular la velocidad promedio
  align(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // cohesión
  // Para la ubicación promedio (centro) de todos los boids vecinos, calcular el vector de viraje hacia esa ubicación
  cohesion(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0); // empezar con un vector vacío para acumular todas las ubicaciones
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Agregar ubicación
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Virar hacia la ubicación
    } else {
      return createVector(0, 0);
    }
  }
}
