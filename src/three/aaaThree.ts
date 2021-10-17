import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import opentype from 'opentype.js';

const HALL_SIZE_X = 100;
const HALL_SIZE_Y = 100;
const POINTLIGHT_INTENSITY = 3;
const HEMISPHERELIGHT_INTENSITY = 0.4;
const SHOOTING_STAR_VELOCITY = 0.3;

class AaaThree {
  private scene = new THREE.Scene();

  private renderer = new THREE.WebGLRenderer({ antialias: true });

  private camera: THREE.PerspectiveCamera;

  private mouse: THREE.Vector2;

  private controls?: OrbitControls;

  private stats = Stats();

  private linkObjects: THREE.Mesh[] = [];

  private shootingStarInterval: number = 0;

  private font?: opentype.Font;

  public onClickLink: (name: string) => void = () => { };

  constructor() {
    const fov = window.innerWidth > 800 ? 50 : 70;
    this.camera = new THREE.PerspectiveCamera(
      fov, window.innerWidth / window.innerHeight,
      0.01,
      200,
    );
    this.camera.position.y = 2;
    this.camera.position.z = 13;

    this.mouse = new THREE.Vector2();
  }

  public init(targetElement: HTMLDivElement) {
    this.load()
      .then(() => {
        this.scene.background = new THREE.Color('#101545');
        this.scene.fog = new THREE.Fog(0x101545, 15, 25);
        const floor = this.makeFloor();
        this.makeTower('dome');
        this.makeTower('door_guide');
        this.makeTower('door_solar');
        this.makeTower('door_star');
        this.makeTower('door_trail');
        this.makeTower('mvp');
        this.makeTower('newbie_project');

        // this.makeCharacter();

        this.scene.add(this.camera);
        this.scene.add(...this.makeLights());
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
        targetElement.addEventListener('click', (e) => this.onMouseClick(e));

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

  private load() {
    return new Promise<void>((resolve, reject) => {
      opentype.load('/assets/fonts/FOUREYES.woff', (err, font) => {
        if (err) {
          console.error(err);
          reject();
        } else {
          this.font = font;
          resolve();
        }
      });
    });
  }

  public makeTower(modelName: string) {
    const loader = new GLTFLoader();
    const texture = new THREE.TextureLoader().load(`/assets/models/${modelName}.jpg`)
    texture.flipY = false;
    // texture.encoding = THREE.sRGBEncoding;

    loader.load(`/assets/models/${modelName}.glb`,
      (gltf) => {
        gltf.scene.traverse((child) => {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          if (child instanceof THREE.Mesh) {
            child.material = material;
            if (child.name.includes('link')) {
              this.linkObjects.push(child);

              this.makeWords('hello', new THREE.Vector3(child.position.x, child.position.y, child.position.z));
              // const sphere = new THREE.SphereGeometry(1, 16, 16);
              // const material = new THREE.MeshStandardMaterial({
              //   color: '#ffffff',
              //   emissive: new THREE.Color('#ffffff'),
              // });
              // child.add(new THREE.Mesh(sphere, material));

              child.addEventListener('click', (e: THREE.Event) => {
                console.log(`click ${child.name}`);
                switch (child.name) {
                  case 'link_mvp':
                    this.camera.position.x = 0.36;
                    this.camera.position.y = 5.7;
                    this.camera.position.z = -0.69;
                    this.camera.rotation.x = 34.7 * Math.PI / 180;
                    this.camera.rotation.y = 17 * Math.PI / 180;
                    this.camera.rotation.z = -11.3 * Math.PI / 180;
                    this.camera.fov = 60;
                    this.camera.quaternion.slerp
                    break;
                  default:
                    break;
                }
                this.onClickLink(child.name);
              });
              child.addEventListener('mouseenter', () => {
                console.log(`mouseenter ${child.name}`)
                material.transparent = true;
                material.opacity = 0.5;
                document.body.style.cursor = 'pointer';
              })
              child.addEventListener('mouseout', () => {
                console.log(`mouseout ${child.name}`)
                material.transparent = false;
                document.body.style.cursor = 'default';
              })
            }
          }
        })
        const object = new THREE.Object3D();
        object.add(gltf.scene);
        object.rotateY(20 * Math.PI / 180);
        this.scene.add(object);
      },
      function (xhr) {
        // console.log(xhr);
      },
      function (err) {
        console.error(err);
      })
  }

  public makeCharacter() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/Xbot.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-1, -1, 3);
        model.rotateY(50 * Math.PI / 180)

        this.scene.add(model);
        const skeleton = new THREE.SkeletonHelper(model);
        skeleton.visible = false;
        this.scene.add(skeleton);
      },
      (xhr) => {
        // console.log(xhr);
      },
      (err) => {
        console.error(err);
      })
  }

  private makeFloor() {
    const floorGeometry = new THREE.PlaneBufferGeometry(HALL_SIZE_X, HALL_SIZE_Y);
    floorGeometry.rotateX(- Math.PI / 2);

    const floorMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#7D3F9B'),
      // color: new THREE.Color('#2D2889'),
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.castShadow = true;
    floor.position.set(0, -2, 0);
    floor.name = "floorMesh";

    return floor;
  }


  private makeLights() {
    const lights: THREE.Light[] = [];

    const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, HEMISPHERELIGHT_INTENSITY);
    hemisphereLight.position.set(0, 10, 0);
    lights.push(hemisphereLight);

    const directionLight = new THREE.DirectionalLight(0xeeeeff, 0.5);
    directionLight.position.set(600, 400, 200);
    lights.push(directionLight)

    const pointLightInfos = [
      // {
      //   color: '#ff0000',
      //   intensity: POINTLIGHT_INTENSITY,
      //   distance: 10,
      //   position: {
      //     x: 0,
      //     y: 3.5,
      //     z: 0,
      //   }
      // },
      {
        color: '#f5dd00',
        intensity: POINTLIGHT_INTENSITY,
        distance: 10,
        position: {
          x: 0.2,
          y: 0,
          z: 3.5,
        }
      },
      // {
      //   color: '#eed800',
      //   intensity: POINTLIGHT_INTENSITY,
      //   distance: 10,
      //   position: {
      //     x: 2.7,
      //     y: 1,
      //     z: 2.5,
      //   }
      // },
      // {
      //   color: '#f5ff00',
      //   intensity: POINTLIGHT_INTENSITY,
      //   distance: 10,
      //   position: {
      //     x: 0.2,
      //     y: 5.2,
      //     z: 1.5,
      //   }
      // },
    ];

    const pointLights = pointLightInfos.map((info) => {
      const pointLight = new THREE.PointLight(info.color, info.intensity, info.distance, 5);
      pointLight.position.set(info.position.x, info.position.y, info.position.z);
      const sphere = new THREE.SphereGeometry(0.05, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: info.color,
        emissive: new THREE.Color(info.color),
      });
      pointLight.add(new THREE.Mesh(sphere, material));
      // const offSetIntensity = POINTLIGHT_INTENSITY / 2;
      // setInterval((() => {
      //   let isBrightening = false;
      //   return () => {
      //     if (pointLight.intensity > POINTLIGHT_INTENSITY) {
      //       isBrightening = false;
      //     } else if (pointLight.intensity < offSetIntensity) {
      //       isBrightening = true;
      //     }
      //     if (isBrightening) {
      //       pointLight.intensity += 0.1;
      //     } else {
      //       pointLight.intensity -= 0.1;
      //     }

      //   }
      // })(), 50)
      return pointLight;
    })

    lights.push(...pointLights);
    return lights;
  }


  private makeWords(text: string, position: THREE.Vector3) {
    const path = this.font?.getPath(text, 0, 0, 1);
    const threePath = new THREE.ShapePath();
    path?.commands.forEach((command) => {
      switch (command.type) {
        case 'M':
          threePath.moveTo(command.x, command.y);
          break;
        case 'L':
          threePath.lineTo(command.x, command.y);
          break;
        case 'Q':
          threePath.quadraticCurveTo(command.x1, command.y1, command.x, command.y);
          break;
        case 'C':
          threePath.bezierCurveTo(command.x1, command.y1, command.x2, command.y2, command.x, command.y);
          break;
        case 'Z':
          // threePath.closePath();
          break;
        default:
          break;
      }
    })
    const shapes = threePath.toShapes(true, false);
    shapes.forEach((shape) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xccccff,
        side: THREE.DoubleSide,
      });
      material.blending = THREE.CustomBlending;
      material.blendEquation = THREE.AddEquation;
      material.blendSrc = THREE.SrcColorFactor;
      material.blendDst = THREE.DstAlphaFactor;
      const geometry = new THREE.ShapeGeometry(shape);
      const object = new THREE.Mesh(geometry, material);
      object.scale.set(0.3, 0.3, 0.3);
      object.rotateX(Math.PI);
      object.position.set(position.x, position.y, position.z);
      // object.position.set(-2.2, 0.7, 2.7);
      this.scene.add(object);
    })
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
    const material = new THREE.MeshToonMaterial({ color: color, side: THREE.DoubleSide });
    const geometry = new THREE.ConeGeometry(0.03, 0.7 + this.makeRandom(0.3), 32);
    const shootingStar = new THREE.Mesh(geometry, material);

    let isBack = false;
    return (() => {
      if (isBack) {
        isBack = false;
        shootingStar.position.z = (this.makeRandom(2) - 7);
      } else {
        isBack = true;
        shootingStar.position.z = (this.makeRandom(2) - 5);
      };

      shootingStar.position.x = this.makeRandom(30);
      shootingStar.position.y = Math.abs(this.makeRandom(1)) + 10;
      shootingStar.rotation.z = -(this.makeRandom(15) + 45) * Math.PI / 180;

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
  };

  private makeRandom(scale: number = 1) {
    return scale * (Math.random() - Math.random());
  };

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
      const object = intersects[0].object;
        if (!object.userData.isMouseEnter) {
          object.userData.isMouseEnter = true;
          object.dispatchEvent({
            type: 'mouseenter'
          });
      }
    } else {
      const object = this.linkObjects.find((object) => object.userData.isMouseEnter)
      if (object) {
        object.userData.isMouseEnter = false;
        object.dispatchEvent({
          type: 'mouseout',
        });
      }
    }
  }

  private onMouseClick(event: MouseEvent) {
    const mouseRayCaster = new THREE.Raycaster();
    mouseRayCaster.setFromCamera(this.mouse, this.camera);
    mouseRayCaster.far = 20;

    const intersects = mouseRayCaster.intersectObjects(this.linkObjects);
    if (intersects && intersects[0] && intersects[0].object instanceof THREE.Mesh) {
      const object = intersects[0].object;
        object.dispatchEvent({
          type: 'click',
        });
    }
  };
};

export default AaaThree;
