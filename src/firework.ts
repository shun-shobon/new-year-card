import {
  AdditiveBlending,
  Color,
  Geometry,
  Object3D,
  Points,
  PointsMaterial,
  Scene,
  Texture,
  Vector3,
} from "three";

class FireParticleData {
  private invisibleAdditionY = 10000;
  private invisibleCount: number;
  private readonly vector: Vector3;
  life: number;

  constructor(direction: Vector3, burstSize: number) {
    this.vector = direction.clone().normalize().multiplyScalar(burstSize);

    this.invisibleCount = Math.floor(Math.random() * 10);
    this.life = Math.floor(Math.random() * 70) + 80;
  }

  update(position: Vector3) {
    if (this.invisibleCount > 0) {
      this.invisibleCount -= 1;
    } else if (this.life > 0) {
      this.invisibleAdditionY = 0;
      this.life -= 1;
    } else {
      this.invisibleAdditionY = 10000;
    }

    this.vector.multiplyScalar(0.98);
    this.vector.y += this.invisibleAdditionY;
    position.add(this.vector);
  }
}

abstract class Explosion extends Object3D {
  protected abstract geometry: Geometry;
  protected abstract particleData: Array<FireParticleData>;
  protected particles!: Points;
  protected material!: PointsMaterial;
  protected particleNum: number = 2000;
  protected particleSize: number = 0.3;
  life = this.particleNum;

  protected constructor(private texture: Texture, private color: Color) {
    super();
  }

  createParticle() {
    this.material = new PointsMaterial({
      map: this.texture,
      color: this.color,
      size: this.particleSize,
      blending: AdditiveBlending,
      transparent: true,
      depthTest: false,
    });
    this.particles = new Points(this.geometry, this.material);
    this.add(this.particles);
  }

  update() {
    this.life = this.particleData.reduce((prev, curr, i) => {
      curr.update(this.geometry.vertices[i]);
      return prev + curr.life;
    }, 0);
    this.geometry.verticesNeedUpdate = true;
  }
}

export class Firework extends Explosion {
  protected geometry: Geometry;
  protected particleData: Array<FireParticleData>;

  constructor(texture: Texture, color: Color, base: Vector3) {
    super(texture, color);
    const burstSize = Math.random() * 0.05 + 0.02;

    this.geometry = new Geometry();
    this.particleData = Array.from({ length: this.particleNum }, (_, i) => {
      const position = new Vector3(
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05,
      ).add(base);
      const vector = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      this.geometry.vertices[i] = position;
      return new FireParticleData(vector, burstSize);
    });

    this.createParticle();
  }
}

export class FireworkManager {
  private fireworks: Array<Firework> = [];
  private generateIntervalMax = 50;
  private generateInterval = 0;

  constructor(private texture: Texture, private scene: Scene) {}

  update() {
    this.generateInterval += 1;
    if (this.generateInterval > this.generateIntervalMax) {
      this.generateInterval = 0;
      const position = new Vector3(
        Math.random() - 0.5,
        Math.random() * 0.5,
        Math.random() - 0.5,
      ).multiplyScalar(8);
      position.y += 3;
      const firework = new Firework(this.texture, new Color(0xffffff), position);
      this.fireworks.push(firework);
      this.scene.add(firework);
    }
    this.fireworks = this.fireworks.filter((firework) => {
      firework.update();
      if (0 < firework.life) return true;
      this.scene.remove(firework);
      return false;
    });
  }
}
