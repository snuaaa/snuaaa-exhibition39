import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

// import ceilingImg from '../assets/imgs/ceiling_final.webp';

import AaaControls from './aaaThreeControl';
import { wallsInfo, AaaWallsInfo } from './aaaThreeWalls';
import { HALL_SIZE_UNIT } from './aaaThreeConstant';

const SPEED = 1;
const SPEED_ROTATE = 0.005;
const HALL_HEIGHT = 60;
const HALL_SIZE_X = 100;
const HALL_SIZE_Y = 100;
const PHOTO_HEIGHT = 23;
const POINTLIGHT_INTENSITY = 1;
const HEMISPHERELIGHT_INTENSITY = 0.8;
const FRAME_WIDTH = 0.5;
const FRAME_SELECTOR_WIDTH = 0.3

const SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

const Moving = (function () {

  let moveLeft = false;
  let moveRight = false;
  let moveForward = false;
  let moveBackward = false;
  let rotation = 0;
  let blockMove = false;

  const setMoveLeft = function (isMove: boolean) {
    moveLeft = isMove;
  }
  const setMoveRight = function (isMove: boolean) {
    moveRight = isMove;
  }
  const setMoveForward = function (isMove: boolean) {
    moveForward = isMove;
  }
  const setMoveBackward = function (isMove: boolean) {
    moveBackward = isMove;
  }
  const setRotation = function (value: number) {
    rotation = value;
  }
  const addRotation = function (value: number) {
    rotation += value;
  }
  const setBlockMove = function (isBlock: boolean) {
    blockMove = isBlock;
  }
  const getMoveLeft = function () {
    return moveLeft;
  }
  const getMoveRight = function () {
    return moveRight;
  }
  const getMoveForward = function () {
    return moveForward;
  }
  const getMoveBackward = function () {
    return moveBackward;
  }
  const getRotation = function () {
    return rotation;
  }
  const getBlockMove = function () {
    return blockMove;
  }

  return {
    setMoveLeft: setMoveLeft,
    setMoveRight: setMoveRight,
    setMoveForward: setMoveForward,
    setMoveBackward: setMoveBackward,
    setRotation: setRotation,
    addRotation: addRotation,
    setBlockMove: setBlockMove,
    getMoveLeft: getMoveLeft,
    getMoveRight: getMoveRight,
    getMoveForward: getMoveForward,
    getMoveBackward: getMoveBackward,
    getRotation: getRotation,
    getBlockMove: getBlockMove
  }
})()



class AaaThree {

  private scene = new THREE.Scene();
  private renderer = new THREE.WebGLRenderer({ antialias: true });


  private wallObjects: THREE.Mesh[] = [];
  private photoObjects: THREE.Object3D[] = [];

  private camera: THREE.PerspectiveCamera;
  private aaaControl: AaaControls;

  private mouse: THREE.Vector2;
  private stats = Stats();

  constructor() {

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    this.aaaControl = new AaaControls(this.camera, this.wallObjects);

    this.aaaControl.yawObject.position.y = 1;
    this.aaaControl.yawObject.position.z = 8;

    this.mouse = new THREE.Vector2();
  }

  public init(targetElement: HTMLDivElement) {

    this.scene.background = new THREE.Color('#101545');
    this.scene.fog = new THREE.Fog(0x101545, 0, 30);

    const floor = this.makeFloor();
    const walls = this.makeWall();
    this.makeCeiling()
      .then((ceiling) => {
        this.scene.add(ceiling)
      })

    const entrance = this.makeEntrance();
    // makeWords();
    // this.makeArrow();
    this.makeTower();

    this.scene.add(this.aaaControl.yawObject);
    this.scene.add(...this.makeLights());
    this.scene.add(floor);
    // this.scene.add(...walls);
    // this.scene.add(entrance)
    // this.scene.add(...this.makeAAA())

    this.wallObjects.push(...walls);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    targetElement.appendChild(this.renderer.domElement);

    // window.addEventListener('resize', this.onWindowResize.bind(this), false);
    targetElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    // targetElement.addEventListener('click', this.onMouseClick.bind(this), false);

    // targetElement.appendChild(stats.dom);
  }

  public makeTower() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/tower.gltf',
      (gltf) => {

        this.scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

      },
      // called while loading is progressing
      function (xhr) {
        console.log(xhr);
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      function (error) {

        console.log('An error happened');

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
    floor.position.set(0, -2, 0);
    floor.name = "floorMesh";

    return floor;
  }

  private makeCeiling() {
    return new Promise<THREE.Object3D>((resolve, reject) => {
      const loader = new THREE.ImageLoader();

      // loader.loadAsync(ceilingImg)
      //     .then((imageBitmap) => {

      //         // const frameX = imageBitmap.width / 100;
      //         // const frameY = imageBitmap.height / 100;
      //         let texture = new THREE.CanvasTexture(imageBitmap);
      //         let ceilingGeometry = new THREE.SphereBufferGeometry(HALL_SIZE_X * 2, 32, 32, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
      //         // ceilingGeometry.rotateX(Math.PI / 2);

      //         const ceilingMaterial = new THREE.MeshBasicMaterial({
      //             map: texture,
      //             side: THREE.DoubleSide
      //             // vertexColors: true,
      //             // color: 0xc3b292,
      //         });
      //         // ceilingMaterial.color.setRGB(1, 1, 1);
      //         const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
      //         ceiling.position.set(0, 0, 0);
      //         ceiling.name = "ceilingMesh";

      //         resolve(ceiling)
      //         // return ceiling;
      //     })
      //     .catch((err) => {
      //         console.error(err)
      //         reject(err);
      //     })
    })
  }

  private makeLights() {
    const lights: THREE.Light[] = [];

    const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, HEMISPHERELIGHT_INTENSITY);
    hemisphereLight.position.set(0, 10, 0);
    lights.push(hemisphereLight);

    // const rectLight = new THREE.RectAreaLight(0xffffff, 10, 15, 15);
    // rectLight.position.set(0, HALL_HEIGHT - 0.1, -80);
    // rectLight.rotation.set(- Math.PI / 2, 0, 0);
    // const rectLightHelper = new RectAreaLightHelper(rectLight);
    // rectLight.add(rectLightHelper);
    // lights.push(rectLight);

    const directionLight = new THREE.DirectionalLight(0xeeeeff, 0.1);
    directionLight.position.set(600, 400, 200);
    // lights.push(directionLight)

    // const pointLights = this.makePointLights(HALL_SIZE_X, HALL_SIZE_Y, 100);
    // console.dir(pointLights);
    const pointLight = new THREE.PointLight(0xffa550, POINTLIGHT_INTENSITY, 100);
    pointLight.position.set(0, 4, 4);

    lights.push(pointLight);
    return lights;
  }

  private makePointLights(spaceX: number, spaceY: number, distance: number) {

    let pointLight = new THREE.PointLight(0xffffff, POINTLIGHT_INTENSITY, 100);
    pointLight.position.set(0, 1, -HALL_SIZE_UNIT * 0.85);

    let pointLight2 = new THREE.PointLight(0xffffff, POINTLIGHT_INTENSITY, 100);
    pointLight2.position.set(HALL_SIZE_UNIT * 0.4, 1, -HALL_SIZE_UNIT * 0.6);

    let pointLight3 = new THREE.PointLight(0xffffff, POINTLIGHT_INTENSITY, 100);
    pointLight3.position.set(-HALL_SIZE_UNIT * 0.4, 1, -HALL_SIZE_UNIT * 0.6);

    return [pointLight, pointLight2, pointLight3];
  }

  private makeWall() {
    const boxMaterial = new THREE.MeshPhysicalMaterial({
      flatShading: true,
      dithering: true,
      color: new THREE.Color('#dddddd')
    });

    // const walls = [];

    return wallsInfo.map((wallInfo, idx) => {
      const boxGeometry = new THREE.BoxBufferGeometry(wallInfo.length, HALL_HEIGHT, 5);

      const wall = new THREE.Mesh(boxGeometry, boxMaterial);
      wall.position.set(wallInfo.xPosition, HALL_HEIGHT / 2 - 10, wallInfo.zPosition);
      wall.rotation.set(0, wallInfo.rotation, 0);
      wall.name = `wall${idx}`
      return wall
    })
  }

  private makeAAA() {

    const boxMaterial = new THREE.MeshPhysicalMaterial({
      flatShading: true,
      dithering: true,
      color: new THREE.Color('#fff942')
    });


    return AaaWallsInfo.map((wallInfo, idx) => {
      const planeGeometry = new THREE.PlaneBufferGeometry(wallInfo.length, 5);

      const wall = new THREE.Mesh(planeGeometry, boxMaterial);
      wall.rotateY(wallInfo.rotation)
      wall.rotateX(-Math.PI / 2);
      // wall.rotation.set(-Math.PI / 2, wallInfo.rotation, 0)
      wall.position.set(wallInfo.xPosition, HALL_HEIGHT - 9.9, wallInfo.zPosition);
      // wall.rotation.set(0, wallInfo.rotation, 0);
      wall.name = `aaa_wall${idx}`
      return wall
    })
  }

  // const makePhoto = function (photoInfo: PhotoType, onClick: (photo_id: number) => void) {

  //   const loader = new THREE.ImageLoader();

  //   // load a image resource
  //   loader.load(
  //     `${SERVER_URL}/static/${photoInfo.thumbnail_path}`,
  //     function (imageBitmap) {
  //       const photoObject = new THREE.Object3D();

  //       const frameX = imageBitmap.width / 30;
  //       const frameY = imageBitmap.height / 30;
  //       let texture = new THREE.CanvasTexture(imageBitmap as any);
  //       let material = new THREE.MeshBasicMaterial({
  //         side: THREE.DoubleSide,
  //         map: texture
  //       });
  //       let geometry = new THREE.PlaneBufferGeometry(frameX, frameY);
  //       let photo = new THREE.Mesh(geometry, material);
  //       // let photo_id = photoInfo.photo_id
  //       photo.position.set(0, PHOTO_HEIGHT, 0.1);
  //       // photo.rotation.x += Math.PI;
  //       photo.name = `photoMesh${photoInfo.photo_id}`
  //       photoObject.add(photo)
  //       photo.addEventListener("click", (e: THREE.Event) => {
  //         onClick(photoInfo.photo_id)
  //         console.log(`photoMesh${photoInfo.photo_id}`)
  //       })
  //       photo.addEventListener("mouseon", (e: THREE.Event) => {
  //         lineMesh.visible = true;
  //         document.body.style.cursor = "pointer"
  //       })
  //       photo.addEventListener("mouseout", (e: THREE.Event) => {
  //         lineMesh.visible = false;
  //         document.body.style.cursor = "grab"
  //       })

  //       const frameGeometry = makeFrameGeometry(frameX, frameY);
  //       const frameMesh = new THREE.Mesh(frameGeometry, new THREE.MeshPhongMaterial({
  //         side: THREE.DoubleSide,
  //         color: 0x333333
  //       }));
  //       frameMesh.name = "photoFrameMesh";
  //       frameMesh.position.set(0, PHOTO_HEIGHT, 0);
  //       photoObject.add(frameMesh);

  //       // PHOTO_POSITIONS[0].x, PHOTO_POSITIONS[0].y, PHOTO_POSITIONS[0].z
  //       const lineGeometry = makeFrameLineGeometry(frameX, frameY);
  //       const lineMaterial = new THREE.MeshBasicMaterial({
  //         color: 0xaaeeff,
  //         transparent: true
  //       });
  //       const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
  //       lineMesh.position.set(0, PHOTO_HEIGHT, 0.5);
  //       lineMesh.visible = false;
  //       lineMesh.name = "photoLineMesh"
  //       photoObject.add(lineMesh);

  //       const spotLight = new THREE.SpotLight(0xffffff, 0.8, 130, Math.PI / 9, 1, 2);
  //       spotLight.position.set(0, HALL_HEIGHT - 5, +45);
  //       spotLight.target = photo;
  //       // photoObject.add(spotLight);

  //       photoObject.position.set(photoInfo.xPos, 0, photoInfo.zPos);
  //       photoObject.rotation.y += photoInfo.rotation / 180 * Math.PI;

  //       photoObjects.push(photoObject);
  //       scene.add(photoObject);

  //     },
  //     // onProgress callback currently not supported
  //     undefined,

  //     // onError callback
  //     function (err) {
  //       console.error(err);
  //     }
  //   );
  // }

  private makeFrameGeometry(frameX: number, frameY: number) {

    let frameOuterX = frameX / 2 + FRAME_WIDTH;
    let frameOuterY = frameY / 2 + FRAME_WIDTH;
    let frameinnerX = frameX / 2;
    let frameinnerY = frameY / 2;
    const frameShape = new THREE.Shape([
      new THREE.Vector2(-frameOuterX, frameOuterY),
      new THREE.Vector2(frameOuterX, frameOuterY),
      new THREE.Vector2(frameOuterX, -frameOuterY),
      new THREE.Vector2(-frameOuterX, -frameOuterY)
    ]);

    const frameHole = new THREE.Path([
      new THREE.Vector2(-frameinnerX, frameinnerY),
      new THREE.Vector2(frameinnerX, frameinnerY),
      new THREE.Vector2(frameinnerX, -frameinnerY),
      new THREE.Vector2(-frameinnerX, -frameinnerY)
    ])

    frameShape.holes = [frameHole]

    const extrudeSettings = {
      amount: 0.5,
      bevelEnabled: false,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 1,
      bevelThickness: 1
    };

    return new THREE.ExtrudeBufferGeometry(frameShape, extrudeSettings);
  }

  private makeFrameLineGeometry(frameX: number, frameY: number) {
    let frameOuterX = frameX / 2 + FRAME_WIDTH + FRAME_SELECTOR_WIDTH;
    let frameOuterY = frameY / 2 + FRAME_WIDTH + FRAME_SELECTOR_WIDTH;
    let frameinnerX = frameX / 2 + FRAME_WIDTH;
    let frameinnerY = frameY / 2 + FRAME_WIDTH;

    const frameShape = new THREE.Shape([
      new THREE.Vector2(-frameOuterX, frameOuterY),
      new THREE.Vector2(frameOuterX, frameOuterY),
      new THREE.Vector2(frameOuterX, -frameOuterY),
      new THREE.Vector2(-frameOuterX, -frameOuterY),
    ]);

    const frameHole = new THREE.Path([
      new THREE.Vector2(-frameinnerX, frameinnerY),
      new THREE.Vector2(frameinnerX, frameinnerY),
      new THREE.Vector2(frameinnerX, -frameinnerY),
      new THREE.Vector2(-frameinnerX, -frameinnerY),
    ])

    frameShape.holes = [frameHole]

    return new THREE.ShapeGeometry(frameShape);
  }

  private makeEntrance() {
    const entranceObject = new THREE.Object3D();

    const boxMaterial = new THREE.MeshPhysicalMaterial({
      flatShading: true,
      dithering: true,
      color: new THREE.Color('#ffffff')
    });

    const planeGeometry = new THREE.BoxBufferGeometry(60, 5, 60);
    const floor = new THREE.Mesh(planeGeometry, boxMaterial);
    floor.position.set(0, 0, 60);
    const ceiling = new THREE.Mesh(planeGeometry, boxMaterial);
    ceiling.position.set(0, 40, 60);
    entranceObject.add(floor, ceiling);

    const pillarGeometry = new THREE.CylinderGeometry(3, 3, 40, 32);
    const pillar1 = new THREE.Mesh(pillarGeometry, boxMaterial);
    pillar1.position.set(25, 20, 85);
    const pillar2 = new THREE.Mesh(pillarGeometry, boxMaterial);
    pillar2.position.set(25, 20, 35);
    const pillar3 = new THREE.Mesh(pillarGeometry, boxMaterial);
    pillar3.position.set(-25, 20, 85);
    const pillar4 = new THREE.Mesh(pillarGeometry, boxMaterial);
    pillar4.position.set(-25, 20, 35);
    entranceObject.add(...[pillar1, pillar2, pillar3, pillar4])

    const domeGeometry = new THREE.SphereBufferGeometry(30, 32, 32, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
    const dome = new THREE.Mesh(domeGeometry, boxMaterial);
    dome.position.set(0, 42, 60);
    entranceObject.add(dome)

    // wall.position.set(wallInfo.xPosition, HALL_HEIGHT / 2 - 10, wallInfo.zPosition);
    // wall.rotation.set(0, wallInfo.rotation, 0);
    // wall.name = `wall${idx}`
    return entranceObject;
  }

  private makeArrow() {
    // if (!('createImageBitmap' in window)) {
    //     window.createImageBitmap = async function (blob: ImageBitmapSource) {
    //         return new Promise<ImageBitmap>((resolve, reject) => {
    //             let img = document.createElement('img');
    //             img.addEventListener('load', function () {
    //                 resolve(this);
    //             });
    //             img.src = URL.createObjectURL(blob);
    //         });
    //     };
    // }



    // const loader = new THREE.ImageLoader();

    // new THREE.ImageLoader().load(
    //   arrowImg,
    //   function (imageBitmap) {
    //     const frameX = imageBitmap.width / 10;
    //     const frameY = imageBitmap.height / 10;
    //     let texture = new THREE.CanvasTexture(imageBitmap as any);
    //     let material = new THREE.MeshPhysicalMaterial({
    //       side: THREE.DoubleSide,
    //       map: texture
    //     });
    //     let geometry = new THREE.PlaneBufferGeometry(frameX, frameY);
    //     let arrow = new THREE.Mesh(geometry, material);
    //     arrow.position.set(50, PHOTO_HEIGHT, -72.4);
    //     arrow.rotation.x += Math.PI;
    //     scene.add(arrow);
    //   },
    //   undefined,
    //   // onError callback
    //   function (err) {
    //     console.error(err);
    //   });

    // new THREE.ImageLoader().load(posterImg,
    //   function (imageBitmap) {
    //     const frameX = imageBitmap.width / 50;
    //     const frameY = imageBitmap.height / 50;
    //     let texture = new THREE.CanvasTexture(imageBitmap as any);
    //     let material = new THREE.MeshPhysicalMaterial({
    //       side: THREE.DoubleSide,
    //       map: texture
    //     });
    //     let geometry = new THREE.PlaneBufferGeometry(frameX, frameY);
    //     let poster1 = new THREE.Mesh(geometry, material);
    //     poster1.position.set(25, PHOTO_HEIGHT, -72.4);
    //     let poster2 = new THREE.Mesh(geometry, material);
    //     poster2.position.set(0, PHOTO_HEIGHT, -72.4);
    //     let poster3 = new THREE.Mesh(geometry, material);
    //     poster3.position.set(-25, PHOTO_HEIGHT, -72.4);
    //     let poster4 = new THREE.Mesh(geometry, material);
    //     poster4.position.set(-50, PHOTO_HEIGHT, -72.4);

    //     scene.add(poster1, poster2, poster3, poster4);
    //   },
    //   undefined,
    //   // onError callback
    //   function (err) {
    //     console.error(err);
    //   });

    // load a image resource
    // loader.load(
    //     arrowImg,
    //     // onProgress callback currently not supported
    //     undefined,

    // );
  }

  // const makeWords = function() {
  //     const loader = new THREE.FontLoader();
  //     loader.load('../assets/fonts/Minguk-Regular.json', function(font) {
  //         console.log('load success')
  //     })
  // }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this));
    // console.log('animate')
    // if (!Moving.getBlockMove()) {
    if (Moving.getMoveLeft()) {
      this.aaaControl.moveCamera(0, -SPEED);
    }
    if (Moving.getMoveRight()) {
      this.aaaControl.moveCamera(0, SPEED);
    }
    if (Moving.getMoveForward()) {
      this.aaaControl.moveCamera(SPEED, 0);
    }
    if (Moving.getMoveBackward()) {
      this.aaaControl.moveCamera(-SPEED, 0);
    }
    if (Moving.getRotation()) {

      let division = Moving.getRotation() > 0
        ? Math.floor(Moving.getRotation() * 9 / 10)
        : Math.ceil(Moving.getRotation() * 9 / 10);
      this.aaaControl.rotateCamera(0, (Moving.getRotation() - division) * SPEED_ROTATE, 0)
      Moving.setRotation(division)
    }
    // }

    // stats.update();

    this.renderer.render(this.scene, this.camera);
  }


  private onMouseMove(event: MouseEvent) {

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    const mouseRayCaster = new THREE.Raycaster();

    mouseRayCaster.setFromCamera(this.mouse, this.camera);
    mouseRayCaster.far = 150;

    let photos = this.photoObjects
      .map(photoObject => photoObject.children
        .filter(child => child.name.substring(0, 9) === 'photoMesh')[0])

    const intersects = mouseRayCaster.intersectObjects(
      photos
    );
    if (intersects && intersects[0]) {
      // let mesh = intersects[0].object as THREE.Mesh
      if (intersects[0].object.name.substring(0, 9) === 'photoMesh') {
        // THREE.find\
        intersects[0].object.dispatchEvent({
          type: "mouseon"
        })
      }
    }
    else {
      photos.forEach((photo => {
        photo.dispatchEvent({
          type: "mouseout"
        })
      }))
    }
  }


  private onMouseClick(event: MouseEvent) {

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    const mouseRayCaster = new THREE.Raycaster();

    mouseRayCaster.setFromCamera(this.mouse, this.camera);
    mouseRayCaster.far = 150;

    let photos = this.photoObjects
      .map(photoObject => photoObject.children
        .filter(child => child.name.substring(0, 9) === 'photoMesh')[0])

    const intersects = mouseRayCaster.intersectObjects(
      photos
    );
    if (intersects && intersects[0]) {
      if (intersects[0].object.name.substring(0, 9) === 'photoMesh') {
        intersects[0].object.dispatchEvent({
          type: "click"
        })
      }
    }
  }


  // setMoveLeft: Moving.setMoveLeft,
  // setMoveRight: Moving.setMoveRight,
  // setMoveForward: Moving.setMoveForward,
  // setMoveBackward: Moving.setMoveBackward,
  // addRotation: Moving.addRotation,
  // setBlockMove: Moving.setBlockMove,
  // getBlockMove: Moving.getBlockMove,
  // // makePhoto: makePhoto,
  // fly: fly

};

export default AaaThree;
