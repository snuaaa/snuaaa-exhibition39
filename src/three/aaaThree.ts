import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import opentype from 'opentype.js';
import { SCENE } from 'src/recoils/scene';
import { APP_URL, DEV_MODE } from 'src/config';
import CustomControl from './customControl';
import {
  makeBreathingBall, makeLights, makeRandom, makeWords,
} from './objects';
import {
  LinkName, mapName, mapRoomToCamera, RoomName,
} from './constants';

const SHOOTING_STAR_INTERVAL = 2 * 1000;
const SHOOTING_STAR_VELOCITY = 0.3;
const POSITION_HOME = {
  x: 0,
  y: 2,
  z: 13,
};
const MODELS_TOWER = [
  'dome',
  'door_guide',
  'door_solar',
  'door_star',
  'door_trail',
  'mvp',
  'newbie_project',
  'star_falls',
  'floor',
];
const MODELS_ROOM = [
  'star_items',
  'star_room',
  'star_frames',
  'trail_room',
  'trail_items',
  'trail_frames',
  'guide_room',
  'guide_items',
  'guide_frames',
  'solar_room',
  'solar_items',
  'ob_room',
  'ob_items',
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

  private controls?: OrbitControls | CustomControl;

  private stats = Stats();

  private linkObjects: Array<THREE.Object3D | THREE.Mesh> = [];

  private shootingStarInterval: number = 0;

  private font?: opentype.Font;

  public onClickLink: (name: string) => void = () => { };

  public onClickPhoto: (modelName: string) => void = () => { };

  public onLoad: () => void = () => { };

  private towerModels: ModelSet[] = [];

  private roomModels: ModelSet[] = [];

  private photoModels: THREE.Mesh[] = [];

  private tower?: THREE.Object3D;

  private room?: THREE.Object3D;

  private towerBackground?: THREE.CubeTexture;

  private roomBackground?: THREE.CubeTexture;

  private loadPromise: Promise<void>;

  private loadResolve: () => void = () => { };

  private get intersectionObjects() {
    return [...this.linkObjects, ...this.photoModels];
  }

  constructor() {
    const fov = window.innerWidth > 800 ? 50 : 70;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    );

    this.mouse = new THREE.Vector2();
    this.loadPromise = new Promise((resolve) => {
      this.loadResolve = resolve;
    });
    this.load();
  }

  public init(targetElement: HTMLDivElement) {
    this.loadPromise
      .then(() => {
        this.tower = this.makeTower();
        this.room = this.makeRoom();

        this.scene.add(this.camera);
        this.scene.add(...makeLights());

        // this.enterHome();

        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        targetElement.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        targetElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        targetElement.addEventListener('click', () => this.onMouseClick());

        if (DEV_MODE) {
          targetElement.appendChild(this.stats.dom);
        }
      });
  }

  private enterHome() {
    document.body.style.cursor = 'grab';
    if (!(this.controls instanceof OrbitControls)) {
      this.controls?.dispose();
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
      this.controls.update();

      this.loadPromise.then(() => {
        if (this.room) {
          this.scene.remove(this.room);
        }
        if (this.tower) {
          this.scene.add(this.tower);
        }
        if (this.towerBackground) {
          this.scene.background = this.towerBackground;
        }
      });
      // this.scene.background = new THREE.Color('#101545');
      this.scene.fog = new THREE.Fog(0x090f27, 15, 25);

      this.shootingStarInterval = window.setInterval(() => {
        this.makeShootingStar();
      }, SHOOTING_STAR_INTERVAL);
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
    this.camera.position.set(POSITION_HOME.x, POSITION_HOME.y, POSITION_HOME.z);
    this.camera.rotation.set(0, 0, 0);
  }

  private enterGallery() {
    document.body.style.cursor = 'grab';
    if (!(this.controls instanceof CustomControl)) {
      this.controls?.dispose();
      if (this.tower) {
        this.scene.remove(this.tower);
      }
      if (this.room) {
        this.scene.add(this.room);
      }
      if (this.roomBackground) {
        this.scene.background = this.roomBackground;
      }

      this.scene.fog = null;

      this.camera.position.set(POSITION_HOME.x, POSITION_HOME.y, POSITION_HOME.z);
      this.camera.rotation.set(0, 0, 0);
      const controls = new CustomControl(this.camera, this.renderer.domElement);
      controls.connect();
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
      window.clearInterval(this.shootingStarInterval);
      this.controls = controls;
    }
  }

  public moveLeft() {
    if (this.controls instanceof CustomControl) {
      this.controls.moveRight(-0.5);
    }
  }

  public moveRight() {
    if (this.controls instanceof CustomControl) {
      this.controls.moveRight(0.5);
    }
  }

  public moveForward() {
    if (this.controls instanceof CustomControl) {
      this.controls.moveForward(0.5);
    }
  }

  public moveBackward() {
    if (this.controls instanceof CustomControl) {
      this.controls.moveForward(-0.5);
    }
  }

  private onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      window.clearInterval(this.shootingStarInterval);
    } else {
      this.shootingStarInterval = window.setInterval(() => {
        this.makeShootingStar();
      }, SHOOTING_STAR_INTERVAL);
    }
  };

  private async load() {
    await this.loadFont();
    await Promise.all(
      MODELS_TOWER.map((modelName) => this.loadTower(modelName)),
    ).then((models) => {
      this.towerModels = models;
    });
    await Promise.all(
      MODELS_ROOM.map((modelName) => this.loadRoom(modelName)),
    ).then((models) => {
      this.roomModels = models;
    });
    await this.loadRoomBackground();
    await this.loadTowerBackground();
    this.loadResolve();
    this.onLoad();
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
  private async loadTower(modelName: string) {
    const texture = await new THREE.TextureLoader().loadAsync(`/assets/models/home/${modelName}.jpg`);
    texture.flipY = false;
    // texture.encoding = THREE.sRGBEncoding;
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('/draco/');
    // dracoLoader.setDecoderConfig({
    //   type: 'js',
    // });

    const gltfLoader = new GLTFLoader();
    // gltfLoader.setDRACOLoader(dracoLoader);
    const gltf = await gltfLoader.loadAsync(`/assets/models/home/${modelName}.glb`);
    return {
      gltf,
      texture,
      name: modelName,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private async loadRoom(modelName: string) {
    const texture = await new THREE.TextureLoader().loadAsync(`/assets/models/room/${modelName}.jpg`);
    texture.flipY = false;
    // texture.encoding = THREE.sRGBEncoding;
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('/draco/');
    // dracoLoader.setDecoderConfig({
    //   type: 'js',
    // });

    const gltfLoader = new GLTFLoader();
    // gltfLoader.setDRACOLoader(dracoLoader);
    const gltf = await gltfLoader.loadAsync(`/assets/models/room/${modelName}.glb`);
    return {
      gltf,
      texture,
      name: modelName,
    };
  }

  private loadTowerBackground() {
    return new Promise<void>((resolve, reject) => {
      const path = '/assets/models/home/background/';
      const format = '.jpg';
      const urls = [
        `${path}px${format}`,
        `${path}nx${format}`,
        `${path}py${format}`,
        `${path}ny${format}`,
        `${path}pz${format}`,
        `${path}nz${format}`,
      ];

      new THREE.CubeTextureLoader().load(urls, (texture) => {
        this.towerBackground = texture;
        resolve();
      }, () => {

      }, (err) => {
        reject(err);
      });
    });
  }

  private loadRoomBackground() {
    return new Promise<void>((resolve, reject) => {
      const path = '/assets/models/room/background/';
      const format = '.jpg';
      const urls = [
        `${path}px${format}`,
        `${path}nx${format}`,
        `${path}py${format}`,
        `${path}ny${format}`,
        `${path}pz${format}`,
        `${path}nz${format}`,
      ];

      new THREE.CubeTextureLoader().load(urls, (texture) => {
        this.roomBackground = texture;
        resolve();
      }, () => {

      }, (err) => {
        reject(err);
      });
    });
  }

  public moveScene(scene: SCENE) {
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
        this.enterHome();
        break;
      case SCENE.GALLERY:
        this.enterGallery();
        break;
      default:
        break;
    }
  }

  public moveRoom(room: RoomName) {
    if (this.controls instanceof CustomControl) {
      const cameraInfo = mapRoomToCamera(room);
      if (cameraInfo) {
        const { position, rotation } = cameraInfo;
        this.controls.setPosition(position.x, position.y, position.z);
        this.controls.setRotation(rotation.x, rotation.y, rotation.z);
      }
    }
  }

  public makeTower() {
    const tower = new THREE.Object3D();

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
            if (!linkName) {
              console.error(`Not matched linkname: ${child.name}`);
              return;
            }
            const word = makeWords(
              linkName,
              this.font,
              new THREE.Vector3(child.position.x, child.position.y + 0.2, child.position.z),
            );
            object.add(word);
            word.visible = false;

            const ballSize = document.body.clientWidth > 800 ? 0.05 : 0.1;

            const ball = makeBreathingBall(
              ballSize,
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
                  document.body.style.cursor = 'grab';
                });
              }
            });
          }
        }
      });
      object.add(gltf.scene);
      object.rotateY(20 * (Math.PI / 180));
      // this.tower = object;
      // this.scene.add(object);
      tower.add(object);
    });
    return tower;
  }

  public makeRoom() {
    const room = new THREE.Object3D();

    this.roomModels.forEach(({
      gltf,
      texture,
    }) => {
      const object = new THREE.Object3D();
      gltf.scene.traverse((child) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        if (child instanceof THREE.Mesh) {
          child.material = material;
          if (child.name.includes('photo_')) {
            this.photoModels.push(child);
            child.addEventListener('click', () => {
              this.onClickPhoto(child.name);
            });
            child.addEventListener('mouseenter', () => {
              document.body.style.cursor = 'pointer';
            });
            child.addEventListener('mouseout', () => {
              document.body.style.cursor = 'grab';
            });
          }
        }
      });
      object.add(gltf.scene);
      object.rotateY(20 * (Math.PI / 180));
      room.add(object);
      // this.scene.add(object);
    });
    return room;
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
    // this.controls?.update();
    if (DEV_MODE) {
      this.stats.update();
    }
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (event.clientY / window.innerHeight) * -2 + 1;

    const mouseRayCaster = new THREE.Raycaster();
    mouseRayCaster.setFromCamera(this.mouse, this.camera);
    mouseRayCaster.far = 100;

    const intersects = mouseRayCaster.intersectObjects(this.intersectionObjects);
    if (intersects && intersects[0] && intersects[0].object instanceof THREE.Mesh) {
      const { object } = intersects[0];
      if (!object.userData.isMouseEnter) {
        object.userData.isMouseEnter = true;
        object.dispatchEvent({
          type: 'mouseenter',
        });
      }
    } else {
      const object = this.intersectionObjects.find((_object) => _object.userData.isMouseEnter);
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
    mouseRayCaster.far = 100;

    const intersects = mouseRayCaster.intersectObjects(this.intersectionObjects);
    if (intersects && intersects[0] && intersects[0].object instanceof THREE.Mesh) {
      const { object } = intersects[0];
      object.dispatchEvent({
        type: 'click',
      });
    }
  }
}

export default AaaThree;
