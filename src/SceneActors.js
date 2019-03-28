/********************
 File: SceneActors.js
 Author: Marco Iuri
 Date: 28/03/2019
 ********************/

/*GEOMETRIES DEFINITIONS*/
//Little Column
var lc_basement, lc_main, lc_capitel;

/*AUXILIARY FUNCTIONS*/
function InitGeometries()
{
    //Little column
    lc_basement  = new THREE.BoxGeometry(0.5, 1, 0.5);
    lc_main      = new THREE.BoxGeometry(0.25, 2.5, 0.25);
    lc_capitel   = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    //TODO: rest of geometries!
}

/*
@brief: Big Island constructor function
@param: position of the island
@param: rotation of the island
@param: material to be used for the elements of the island
*/
function BigIsland(position, rotation, mat)
{
    //Center pivot creation
    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.y = position.y;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    //Create little columns
    this.lcols = [];
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, 0,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 1.5, 0,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-1.5, 0,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, 0,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, 0,  1.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, 0, -1.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, 0, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-1.5, 0, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 1.5, 0, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, 0, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, 0, -1.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, 0,  1.5), new THREE.Vector3(0,0,0), mat));
    
    //Add little columns to the island
    for(var c = 0; c < this.lcols.length; c++)
        this.pivot.add(this.lcols[c].basement);

}

/*
@brief: Little Column constructor function
@param: position of the column
@param: rotation of the column
@param: material of the column
*/
function LittleColumn(position, rotation, mat)
{
    //Basement creation
    this.basement = new THREE.Mesh(lc_basement, mat);
    this.basement.castShadow = true;
    this.basement.receiveShadow = true;
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(lc_main, mat);
    this.main.castShadow = true;
    this.main.receiveShadow = true;
    this.main.position.set(0, 1.75, 0);
    this.basement.add(this.main);

    //Capitel creation
    this.capitel = new THREE.Mesh(lc_capitel, mat);
    this.capitel.castShadow = true;
    this.capitel.receiveShadow = true;
    this.capitel.position.set(0, 1.5, 0);
    this.main.add(this.capitel);
}