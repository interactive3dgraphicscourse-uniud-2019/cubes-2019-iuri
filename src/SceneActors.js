/********************
 File: SceneActors.js
 Author: Marco Iuri
 Date: 28/03/2019
 ********************/

/*CONSTANTS*/
const BI_FLOOR_TILE_DIM = 1.5;
const BI_FLOOR_TILE_VARIANCE = 0.4;

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

    //Big column
    bc_basement  = new THREE.BoxGeometry(1, 1.5, 1);
    bc_main      = new THREE.BoxGeometry(0.5, 2.75, 0.5);
    bc_capitel   = new THREE.BoxGeometry(1, 0.75, 1);

    //Big island tessellated floor tile
    bi_floor_tile = new THREE.BoxGeometry(BI_FLOOR_TILE_DIM, 0.5, BI_FLOOR_TILE_DIM);

    //TODO: rest of geometries!
}

/*CONSTRUCTOR FUNCTIONS*/

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
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 1.5, -0.25,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-1.5, -0.25,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, -0.25,  3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, -0.25,  1.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, -0.25, -1.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, -0.25, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-1.5, -0.25, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 1.5, -0.25, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25, -3.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25, -1.5), new THREE.Vector3(0,0,0), mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25,  1.5), new THREE.Vector3(0,0,0), mat));
    
    //Add little columns to the island
    for(var c = 0; c < this.lcols.length; c++)
        this.pivot.add(this.lcols[c].basement);

    //Create big columns
    this.bcols = [];
    this.bcols.push(new BigColumn(new THREE.Vector3(   7, 0, 7), new THREE.Vector3(0,0,0), mat));
    this.bcols.push(new BigColumn(new THREE.Vector3( 2.5, 0, 7), new THREE.Vector3(0,0,0), mat));
    this.bcols.push(new BigColumn(new THREE.Vector3(-2.5, 0, 7), new THREE.Vector3(0,0,0), mat));
    this.bcols.push(new BigColumn(new THREE.Vector3(  -7, 0, 7), new THREE.Vector3(0,0,0), mat));

    //Add big columns to the island
    for(var c = 0; c < this.bcols.length; c++)
        this.pivot.add(this.bcols[c].basement);

    //Add the floor to the island
    this.floor = new TesselFloor(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), mat);
    this.floor.pivot.position.y = -1;
    this.pivot.add(this.floor.pivot);
    
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

/*
@brief: Big Column constructor function
@param: position of the column;
@param: rotation of the column;
@param: material of the column;
*/
function BigColumn(position, rotation, mat)
{
    //Basement creation
    this.basement = new THREE.Mesh(bc_basement, mat);
    this.basement.castShadow = true;
    this.basement.receiveShadow = true;
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(bc_main, mat);
    this.main.castShadow = true;
    this.main.receiveShadow = true;
    this.main.position.set(0, 2.125, 0);
    this.basement.add(this.main);

    //Capitel creation
    this.capitel = new THREE.Mesh(bc_capitel, mat);
    this.capitel.castShadow = true;
    this.capitel.receiveShadow = true;
    this.capitel.position.set(0, 1.75, 0);
    this.main.add(this.capitel);
}

/*
@brief: Tessellated floor contructor
@param: rotation of the floor;
@param: material of the floor;
*/
function TesselFloor(position, rotation, mat)
{
    var n_tile_side = 15 / BI_FLOOR_TILE_DIM;

    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.y = position.y;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    this.tiles = [];
    for(var j = 0; j < n_tile_side; j++)
    {
        for(var i = 0; i < n_tile_side; i++)
        {
            var random_z_scale = BI_FLOOR_TILE_VARIANCE*(Math.random()*2 -1);
            this.tiles.push(new THREE.Mesh(bi_floor_tile, mat));
            this.tiles[j*n_tile_side + i].castShadow = true;
            this.tiles[j*n_tile_side + i].receiveShadow = true;
            this.tiles[j*n_tile_side + i].scale.y += random_z_scale;
            this.tiles[j*n_tile_side + i].position.x = -7.5 + (BI_FLOOR_TILE_DIM/2) + i*BI_FLOOR_TILE_DIM;
            this.tiles[j*n_tile_side + i].position.z = -7.5 + (BI_FLOOR_TILE_DIM/2) + j*BI_FLOOR_TILE_DIM;
            this.pivot.add(this.tiles[j*n_tile_side + i]);
        }
    }
}