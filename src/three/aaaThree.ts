import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import opentype from 'opentype.js';
import { SCENE } from 'src/recoils/scene';
import { APP_URL } from 'src/config';
import {
  makeBreathingBall, makeFloor, makeLights, makeRandom, makeWords,
} from './objects';
import { LinkName, mapName } from './constants';

const SHOOTING_STAR_VELOCITY = 0.3;
const MODELS_TOWER = [
  'dome',
  'door_guide',
  'door_solar',
  'door_star',
  'door_trail',
  'mvp',
  'newbie_project',
];

interface ModelSet {
  gltf: GLTF,
  texture: THREE.Texture,
  name: string,
}

class AaaThree {
  private scene = new THREE.Scene();

  private renderer = new THREE.WebGLRenderer({ antialias: true });

  private camera: THREE.PerspectiveCamera;

  private mouse: THREE.Vector2;

  private controls?: OrbitControls;

  private stats = Stats();

  private linkObjects: Array<THREE.Object3D | THREE.Mesh> = [];

  private shootingStarInterval: number = 0;

  private font?: opentype.Font;

  public onClickLink: (name: string) => void = () => { };

  public towerModels: ModelSet[] = [];

  constructor() {
    const fov = window.innerWidth > 800 ? 50 : 70;
    this.camera = new THREE.PerspectiveCamera(
      fov, window.innerWidth / window.innerHeight,
      0.01,
      200,
    );
    this.camera.position.set(0, 2, 13);

    this.mouse = new THREE.Vector2();
  }

  public init(targetElement: HTMLDivElement) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.listenToKeyEvents( window ); // optional

    // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.controls.screenSpacePanning = false;

    this.controls.minDistance = 7;
    this.controls.maxDistance = 15;

    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.target = new THREE.Vector3(0, 2, 0);

    this.load()
      .then(() => {
        this.scene.background = new THREE.Color('#101545');
        this.scene.fog = new THREE.Fog(0x101545, 15, 25);
        const floor = makeFloor();
        this.makeTower();

        this.scene.add(this.camera);
        this.scene.add(...makeLights());
        this.scene.add(floor);

        this.shootingStarInterval = window.setInterval(() => {
          this.makeShootingStar();
        }, 400);

        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        targetElement.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        targetElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        targetElement.addEventListener('click', () => this.onMouseClick());

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            window.clearInterval(this.shootingStarInterval);
          } else {
            this.shootingStarInterval = window.setInterval(() => {
              this.makeShootingStar();
            }, 2000);
          }
        });
        targetElement.appendChild(this.stats.dom);
      });
  }

  private async load() {
    await this.loadFont();
    this.towerModels = await Promise.all(
      MODELS_TOWER.map((modelName) => this.loadTower(modelName)),
    );
  }

  private loadFont() {
    return new Promise<void>((resolve, reject) => {
      opentype.load(`${APP_URL}assets/fonts/FOUREYES.woff`, (err, font) => {
        if (err) {
          reject(err);
        } else {
          this.font = font;
          resolve();
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private loadTower(modelName: string) {
    const loader = new GLTFLoader();
    const texture = new THREE.TextureLoader().load(`/assets/models/${modelName}.jpg`);
    texture.flipY = false;
    // texture.encoding = THREE.sRGBEncoding;
    return new Promise<ModelSet>((resolve, reject) => {
      loader.load(`/assets/models/${modelName}.glb`,
        (gltf) => {
          resolve({
            gltf,
            texture,
            name: modelName,
          });
        },
        () => {
          // console.log(xhr);
        },
        (err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  public moveCamera(scene: SCENE) {
    switch (scene) {
      case SCENE.MVP:
        this.camera.position.x = 0.36;
        this.camera.position.y = 5.7;
        this.camera.position.z = -0.69;
        this.camera.rotation.x = 34.7 * (Math.PI / 180);
        this.camera.rotation.y = 17 * (Math.PI / 180);
        this.camera.rotation.z = -11.3 * (Math.PI / 180);
        this.camera.fov = window.innerWidth > 800 ? 60 : 60;
        // this.camera.quaternion.slerp
        break;
      case SCENE.HOME:
        this.camera.position.x = 0;
        this.camera.position.y = 2;
        this.camera.position.z = 13;
        this.camera.rotation.x = 0;
        this.camera.rotation.y = 0;
        this.camera.rotation.z = 0;
        this.camera.fov = window.innerWidth > 800 ? 50 : 70;
        break;
      default:
        break;
    }
  }

  public makeTower() {
    this.towerModels.forEach(({
      gltf,
      texture,
    }) => {
      const object = new THREE.Object3D();
      gltf.scene.traverse((child) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        if (child instanceof THREE.Mesh) {
          child.material = material;
          if (child.name.includes('link') && this.font) {
            this.linkObjects.push(child);
            const linkName = mapName(child.name as LinkName);
            const word = makeWords(
              linkName,
              this.font,
              new THREE.Vector3(child.position.x, child.position.y + 0.2, child.position.z),
            );
            object.add(word);
            word.visible = false;

            const ball = makeBreathingBall(
              0.05,
              new THREE.Vector3(child.position.x, child.position.y, child.position.z),
            );
            object.add(ball);
            ball.traverse((mesh) => {
              if (mesh instanceof THREE.Mesh) {
                this.linkObjects.push(mesh);
                mesh.addEventListener('click', () => {
                  this.onClickLink(child.name);
                });
                mesh.addEventListener('mouseenter', () => {
                  document.body.style.cursor = 'pointer';
                  word.visible = true;
                });
                mesh.addEventListener('mouseout', () => {
                  word.visible = false;
                  document.body.style.cursor = 'default';
                });
              }
            });
          }
        }
      });
      object.add(gltf.scene);
      object.rotateY(20 * (Math.PI / 180));
      this.scene.add(object);
    });
  }

  private onWindowResize() {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    this.camera.aspect = width / height;

    if (width < 800) {
      this.camera.fov = 70;
    } else {
      this.camera.fov = 50;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private makeShootingStar() {
    const color = new THREE.Color('#FFFFFF');
    const material = new THREE.MeshToonMaterial({ color, side: THREE.DoubleSide });
    const geometry = new THREE.ConeGeometry(0.03, 0.7 + makeRandom(0.3), 32);
    const shootingStar = new THREE.Mesh(geometry, material);

    let isBack = false;
    return (() => {
      if (isBack) {
        isBack = false;
        shootingStar.position.z = (makeRandom(2) - 7);
      } else {
        isBack = true;
        shootingStar.position.z = (makeRandom(2) - 5);
      }

      shootingStar.position.x = makeRandom(30);
      shootingStar.position.y = Math.abs(makeRandom(1)) + 10;
      shootingStar.rotation.z = -(makeRandom(15) + 45) * (Math.PI / 180);

      setInterval(() => {
        if (shootingStar.position.y < 0) {
          this.scene.remove(shootingStar);
        } else {
          shootingStar.position.x += SHOOTING_STAR_VELOCITY * Math.sin(shootingStar.rotation.z);
          shootingStar.position.y -= SHOOTING_STAR_VELOCITY * Math.cos(shootingStar.rotation.z);
          shootingStar.geometry.scale(1, 1.03, 1);
        }
      }, 50);

      this.scene.add(shootingStar);
    })();
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.controls?.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (event.clientY / window.innerHeight) * -2 + 1;

    const mouseRayCaster = new THREE.Raycaster();
    mouseRayCaster.setFromCamera(this.mouse, this.camera);
    mouseRayCaster.far = 20;

    const intersects = mouseRayCaster.intersectObjects(this.linkObjects);
    if (intersects && intersects[0] && intersects[0].object instanceof THREE.Mesh) {
      const { object } = intersects[0];
      if (!object.userData.isMouseEnter) {
        object.userData.isMouseEnter = true;
        object.dispatchEvent({
          type: 'mouseenter',
        });
      }
    } else {
      const object = this.linkObjects.find((_object) => _object.userData.isMouseEnter);
      if (object) {
        object.userData.isMouseEnter = false;
        object.dispatchEvent({
          type: 'mouseout',
        });
      }
    }
  }

  private onMouseClick() {
    const mouseRayCaster = new THREE.Raycaster();
    mouseRayCaster.setFromCamera(this.mouse, this.camera);
    mouseRayCaster.far = 20;

    const intersects = mouseRayCaster.intersectObjects(this.linkObjects);
    if (intersects && intersects[0] && intersects[0].object instanceof THREE.Mesh) {
      const { object } = intersects[0];
      object.dispatchEvent({
        type: 'click',
      });
    }
  }
}

export default AaaThree;
