var settingsDefault = {
	minutesNumber: 60,
	radius: 100,
	depthFace: 20,
	lineWidthHandHour: 5,
	lineWidthHandMinute: 5,
	lineWidthHandSecond: 1,
	spacing: 5,
	spacingHand: 15,

	handHourColor: 0xFFFFFF,
	handMinuteColor: 0xFFFFFF,
	handSecondColor: 0xFF0000,
};
var settings = {};

settingsDefault.handHourLength = settingsDefault.radius - 40;
settingsDefault.handMinuteLength = settingsDefault.radius - 20;
settingsDefault.handSecondLength = settingsDefault.radius - 10;

for (var prop in settingsDefault) {
	if (settingsDefault.hasOwnProperty(prop)) {
		settings[prop] = settingsDefault[prop];
	}
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 650;

camera.lookAt({ x: 0, y: 0, z: 0 });

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

var group = new THREE.Group();
group.position.y = 50;

var subGroup = new THREE.Group();
group.add(subGroup);

scene.add( group );

var light;
light = new THREE.DirectionalLight(0xFFFFFF, 0.9);
light.position.set(80, 80, 80);

scene.add(light);

var materials = {
	handHour: new THREE.MeshPhongMaterial(
		{
			color: settings.handHourColor,
			shininess: 10,
			shading: THREE.FlatShading
		}
	),
	handMinute: new THREE.MeshPhongMaterial(
		{
			color: settings.handMinuteColor,
			shininess: 10,
			shading: THREE.FlatShading
		}
	),
	handSecond: new THREE.MeshPhongMaterial(
		{
			color: settings.handSecondColor,
			shininess: 10,
			shading: THREE.FlatShading
		}
	)
};

settings.spacing = settings.radius - settings.lineLengthShort / 2 - settings.spacing;

var boxGeometry3 = new THREE.BoxGeometry( settings.lineWidthHandHour, settings.handHourLength, 1);
var boxGeometry4 = new THREE.BoxGeometry( settings.lineWidthHandMinute, settings.handMinuteLength, 1);
var boxGeometry5 = new THREE.BoxGeometry( settings.lineWidthHandSecond, settings.handSecondLength, 1);

var handHourParent = new THREE.Object3D();
var handMinuteParent = new THREE.Object3D();
var handSecondParent = new THREE.Object3D();

var handHour = new THREE.Mesh( boxGeometry3, materials.handHour );
var handMinute = new THREE.Mesh( boxGeometry4, materials.handMinute );
var handSecond = new THREE.Mesh( boxGeometry5, materials.handSecond );

handHourParent.add(handHour);
handMinuteParent.add(handMinute);
handSecondParent.add(handSecond);

handHour.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.handHourLength / 2 - settings.spacingHand );
handMinute.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.handMinuteLength / 2 - settings.spacingHand );
handSecond.translateOnAxis(new THREE.Vector3( 0, 1, 0 ), settings.handSecondLength / 2 - settings.spacingHand );

handHour.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 2 );
handMinute.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 3 );
handSecond.translateOnAxis(new THREE.Vector3( 0, 0, 1 ), settings.depthFace / 2 + 4 );

group.add( handHourParent );
group.add( handMinuteParent );
group.add( handSecondParent );

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var timePassed = 0;

function render(time) {
	requestAnimationFrame( render );

	if (time - timePassed > 1000) {
		timePassed = time;

		var date = new Date();

		var hrs = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();

		var handHourR = (30 * (hrs > 12 ? hrs - 12 : hrs) * Math.PI) / 180;
		var handMinuteR = (6 * min * Math.PI) / 180;
		var handSecondR = (6 * sec * Math.PI) / 180;

		handHourParent.rotation.z = -handHourR;
		handMinuteParent.rotation.z = -handMinuteR;
		handSecondParent.rotation.z = -handSecondR;

	}

	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;

	subGroup.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 180);

	renderer.render( scene, camera );
}

render();