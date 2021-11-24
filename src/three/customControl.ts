import {
  Euler,
  EventDispatcher,
  Vector3,
} from 'three';

const changeEvent = { type: 'change' };
const lockEvent = { type: 'lock' };
const unlockEvent = { type: 'unlock' };

const PI_2 = Math.PI / 2;

class CustomControl extends EventDispatcher {
  private domElement: HTMLElement;

  private minPolarAngle = 0; // radians

  private maxPolarAngle = Math.PI; // radians

  public isLocked: boolean;

  public camera: THREE.Camera;

  private euler = new Euler(0, 0, 0, 'YXZ');

  private vector = new Vector3();

  private isRotating = false;

  private mouseX = 0;

  private mouseY = 0;

  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    super();

    if (domElement === undefined) {
      this.domElement = document.body;
    } else {
      this.domElement = domElement;
    }
    this.isLocked = false;
    this.camera = camera;
    // Set to constrain the pitch of the camera
    // Range is 0 to Math.PI radians
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // const scope = this;
    this.connect();
  }

  public dispose() {
    this.disconnect();
  }

  // private onMouseMove(event: MouseEvent) {
  //   // if ( scope.isLocked === false ) return;

  //   const movementX = event.movementX || 0;
  //   const movementY = event.movementY || 0;
  //   console.log(this.euler);

  //   this.euler.setFromQuaternion(this.camera.quaternion);

  //   this.euler.y -= movementX * 0.002;
  //   this.euler.x -= movementY * 0.002;

  //   this.euler.x = Math.max(
  //     PI_2 - this.maxPolarAngle,
  //     Math.min(PI_2 - this.minPolarAngle, this.euler.x),
  //   );

  //   this.camera.quaternion.setFromEuler(this.euler);

  //   this.dispatchEvent(changeEvent);
  // }

  private rotate(x: number, y: number) {
    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= x * 0.002;
    this.euler.x -= y * 0.002;

    this.euler.x = Math.max(
      PI_2 - this.maxPolarAngle,
      Math.min(PI_2 - this.minPolarAngle, this.euler.x),
    );

    this.camera.quaternion.setFromEuler(this.euler);

    this.dispatchEvent(changeEvent);
  }

  private onTouchStart(e: TouchEvent) {
    // e.preventDefault();
    this.mouseX = e.touches[0].clientX;
    this.mouseY = e.touches[0].clientY;
    this.isRotating = true;
  }

  private onTouchEnd(e: TouchEvent) {
    // e.preventDefault();
    this.isRotating = false;
  }

  private onTouchMove(e: TouchEvent) {
    // e.preventDefault();
    if (e.touches[0]) {
      if (this.isRotating) {
        // AaaThree.addRotation(mouseX - e.touches[0].clientX);
        this.rotate(this.mouseX - e.touches[0].clientX, 0);
      }
      this.mouseX = e.touches[0].clientX;
    }
  }

  private onPointerlockChange() {
    if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
      this.dispatchEvent(lockEvent);
      this.isLocked = true;
    } else {
      this.dispatchEvent(unlockEvent);
      this.isLocked = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private onPointerlockError() {
    console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
  }

  private getObject() { // retaining this method for backward compatibility
    return this.camera;
  }

  private mouseDownEventHandler = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.isRotating = true;
  };

  private mouseUpEventHandler = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.isRotating = false;
  };

  private mouseMoveEventHandler = (e: MouseEvent) => {
    if (this.isRotating) {
      this.rotate((-0.2 * e.movementX), (-0.2 * e.movementY));
    }
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  };

  private mouseOutHandler = () => {
    this.isRotating = false;
  };

  private keyDownHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        this.moveForward(0.5);
        break;
      case 'ArrowRight':
      case 'd':
        this.moveRight(0.5);
        break;
      case 'ArrowDown':
      case 's':
        this.moveForward(-0.5);
        break;
      case 'ArrowLeft':
      case 'a':
        this.moveRight(-0.5);
        break;
      default:
        break;
    }
  };

  public connect() {
    this.domElement.ownerDocument.addEventListener('pointerlockchange', () => this.onPointerlockChange());
    this.domElement.ownerDocument.addEventListener('pointerlockerror', () => this.onPointerlockError());

    this.domElement.addEventListener('mousedown', this.mouseDownEventHandler);
    this.domElement.addEventListener('mouseup', this.mouseUpEventHandler);
    this.domElement.addEventListener('mousemove', this.mouseMoveEventHandler);
    this.domElement.addEventListener('mouseout', this.mouseOutHandler);
    document.addEventListener('keydown', this.keyDownHandler);
  }

  public disconnect() {
    this.domElement.ownerDocument.removeEventListener('pointerlockchange', () => this.onPointerlockChange());
    this.domElement.ownerDocument.removeEventListener('pointerlockerror', () => this.onPointerlockError());

    this.domElement.removeEventListener('mousedown', this.mouseDownEventHandler);
    this.domElement.removeEventListener('mouseup', this.mouseUpEventHandler);
    this.domElement.removeEventListener('mousemove', this.mouseMoveEventHandler);
    this.domElement.removeEventListener('mouseout', this.mouseOutHandler);
    document.addEventListener('keydown', this.keyDownHandler);
  }

  public moveForward(distance: number) {
    // move forward parallel to the xz-plane
    // assumes camera.up is y-up

    this.vector.setFromMatrixColumn(this.camera.matrix, 0);

    this.vector.crossVectors(this.camera.up, this.vector);

    this.camera.position.addScaledVector(this.vector, distance);
  }

  public moveRight(distance: number) {
    this.vector.setFromMatrixColumn(this.camera.matrix, 0);
    this.camera.position.addScaledVector(this.vector, distance);
  }

  public lock() {
    this.domElement.requestPointerLock();
  }

  public unlock() {
    this.domElement.ownerDocument.exitPointerLock();
  }
}

export default CustomControl;
