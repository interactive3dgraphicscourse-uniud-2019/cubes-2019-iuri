/********************
 File: WhiteChapel.js
 Author: Marco Iuri
 Date: 28/03/2019
 ********************/

/*CONSTANTS*/
const BI_FLOOR_TILE_DIM = 1.5;
const BI_BASE_TILE_DIM = 0.75;
const BI_FLOOR_TILE_VARIANCE = 0.4;
const BI_WALL_BRICK_W = 1;
const BI_WALL_BRICK_H = 0.5;

/*MATERIALS DEFINTIONS*/
var c_mat, f_mat, bp_mat, wall_mat;

/*GEOMETRIES DEFINITIONS*/
//Little Column
var lc_basement, lc_main, lc_capitel;
//Big Column
var bc_basement, bc_main, bc_capitel;
//Floor and Island Basement
var bi_floor_tile;
//Ruined Wall
var rwall_part1;
var rwall_bricks;

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

    //Ruined wall part1 (no-ruined part)
    rwall_part1 = new THREE.BoxGeometry(0.5, 5, 8);
    rwall_bricks = new THREE.BoxGeometry(0.6, BI_WALL_BRICK_H, BI_WALL_BRICK_W);

    //TODO: rest of geometries!
}

function InitMaterials()
{
    c_mat = new THREE.MeshPhongMaterial();
    c_mat.color.setRGB(1.0, 1.0, 1.0);
    
    f_mat = new THREE.MeshPhongMaterial();
    f_mat.color.setRGB(1.0, 1.0, 1.0);
    
    bp_mat = new THREE.MeshPhongMaterial();
    bp_mat.color.setRGB(1.0, 1.0, 1.0);
    
    wall_mat = new THREE.MeshPhongMaterial();
	wall_mat.color.setRGB(1.0, 1.0, 1.0);
}

/*CONSTRUCTOR FUNCTIONS*/

/*
@brief: Big Island constructor function
@param: position of the island
@param: rotation of the island
*/
function BigIsland(position, rotation)
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
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25,  3.5), new THREE.Vector3(0,0,0), c_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, -0.25, -3.5), new THREE.Vector3(0,0,0), c_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-1.5, -0.25, -3.5), new THREE.Vector3(0,0,0), c_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 1.5, -0.25, -3.5), new THREE.Vector3(0,0,0), c_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25, -3.5), new THREE.Vector3(0,0,0), c_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25, -1.5), new THREE.Vector3(0,0,0), c_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25,  1.5), new THREE.Vector3(0,0,0), c_mat));
    
    //Add little columns to the island
    for(var c = 0; c < this.lcols.length; c++)
        this.pivot.add(this.lcols[c].basement);

    //Create broken little columns
    this.b_lcols = [];
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3( 1.5, -0.25,  3.5), new THREE.Vector3(0,0,0), c_mat, 1.0));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-1.5, -0.25,  3.5), new THREE.Vector3(0,0,0), c_mat, 0.65));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-3.5, -0.25,  3.5), new THREE.Vector3(0,0,0), c_mat, 0.25));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-3.5, -0.25,  1.5), new THREE.Vector3(0,0,0), c_mat, 0.5));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-3.5, -0.25, -1.5), new THREE.Vector3(0,0,0), c_mat, 0.75));

    //Add broken little columns to the island
    for(var c = 0; c < this.b_lcols.length; c++)
        this.pivot.add(this.b_lcols[c].basement);

    //Create big column
    this.bcol = new BigColumn(new THREE.Vector3(-2.5, 0, 7), new THREE.Vector3(0,0,0), c_mat);

    //Add big column to the island
    this.pivot.add(this.bcol.basement);

    //Create broken big columns
    this.b_bcols = [];
    this.b_bcols.push(new BigColumn_Broken(new THREE.Vector3(   7, 0, 7), new THREE.Vector3(0,0,0), c_mat, 1.0));
    this.b_bcols.push(new BigColumn_Broken(new THREE.Vector3( 2.5, 0, 7), new THREE.Vector3(0,0,0), c_mat, 0.5));
    this.b_bcols.push(new BigColumn_Broken(new THREE.Vector3(  -7, 0, 7), new THREE.Vector3(0,0,0), c_mat, 0.3));

    //Add broken big columns to island
    for(var c = 0; c < this.b_bcols.length; c++)
        this.pivot.add(this.b_bcols[c].basement);

    //Create the tesselated floor
    this.floor = new TesselFloor(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), f_mat);
    this.floor.pivot.position.y = -0.75;

    //Add the floor to the island
    this.pivot.add(this.floor.pivot);

    //Create the below part of the island
    this.is_base = new IslandBasement(new THREE.Vector3(0, -0.75, 0), new THREE.Vector3(0,0,0), bp_mat);

    //Add this part to the island
    this.pivot.add(this.is_base.pivot);

    //Create a first ruined wall
    this.ruinedWall1 = new RuinedWall(new THREE.Vector3(7.25, 1.75, -3.5), new THREE.Vector3(0 , 0, 0), wall_mat, 3);

    //Add the first wall to the island
    this.pivot.add(this.ruinedWall1.pivot);

    //Create a first ruined wall
    this.ruinedWall1 = new RuinedWall(new THREE.Vector3(3.5, 1.75, -7.25), new THREE.Vector3(0, -Math.PI/2, 0), wall_mat, 7);

    //Add the first wall to the island
    this.pivot.add(this.ruinedWall1.pivot);    
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
    //this.basement.castShadow = true;
    //this.basement.receiveShadow = true;
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(lc_main, mat);
    //this.main.castShadow = true;
    //this.main.receiveShadow = true;
    this.main.position.set(0, 1.75, 0);
    this.basement.add(this.main);

    //Capitel creation
    this.capitel = new THREE.Mesh(lc_capitel, mat);
    //this.capitel.castShadow = true;
    //this.capitel.receiveShadow = true;
    this.capitel.position.set(0, 1.5, 0);
    this.main.add(this.capitel);
}

/*
@brief: Broken Little Column constructor function
@param: position of the broken column
@param: rotation of the broken column
@param: material of the broken column
@param: proportional height of the broken column (in respect to height of lc_main)
*/
function LittleColumn_Broken(position, rotation, mat, height)
{
    //Basement creation
    this.basement = new THREE.Mesh(lc_basement, mat);
    //this.basement.castShadow = true;
    //this.basement.receiveShadow = true;
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(lc_main, mat);
    //this.main.castShadow = true;
    //this.main.receiveShadow = true;
    this.main.scale.y = height;
    this.main.position.set(0, 1.5*height, 0);
    this.basement.add(this.main);
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
    //this.basement.castShadow = true;
    //this.basement.receiveShadow = true;
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(bc_main, mat);
    //this.main.castShadow = true;
    //this.main.receiveShadow = true;
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
@brief: Broken Big Column constructor function
@param: position of the broken column
@param: rotation of the broken column
@param: material of the broken column
@param: proportional height of the broken column (in respect to height of lc_main)
*/
function BigColumn_Broken(position, rotation, mat, height)
{
    //Basement creation
    this.basement = new THREE.Mesh(bc_basement, mat);
    //this.basement.castShadow = true;
    //this.basement.receiveShadow = true;
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(bc_main, mat);
    //this.main.castShadow = true;
    //this.main.receiveShadow = true;
    this.main.scale.y = height;
    this.main.position.set(0, 1.75*height, 0);
    this.basement.add(this.main);
}

/*
@brief: Tessellated floor contructor
@param: position of the floor;
@param: rotation of the floor;
@param: material of the floor;
*/
function TesselFloor(position, rotation, mat)
{
    var n_tile_side = 15 / BI_FLOOR_TILE_DIM;

    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    this.tiles = [];
    for(var j = 0; j < n_tile_side; j++)
    {
        for(var i = 0; i < n_tile_side; i++)
        {
            var random_y_scale = BI_FLOOR_TILE_VARIANCE*(Math.random()*2 -1);
            this.tiles.push(new THREE.Mesh(bi_floor_tile, mat));
            //this.tiles[j*n_tile_side + i].receiveShadow = true;
            this.tiles[j*n_tile_side + i].scale.y += random_y_scale;
            this.tiles[j*n_tile_side + i].position.x = -7.5 + (BI_FLOOR_TILE_DIM/2) + i*BI_FLOOR_TILE_DIM;
            this.tiles[j*n_tile_side + i].position.z = -7.5 + (BI_FLOOR_TILE_DIM/2) + j*BI_FLOOR_TILE_DIM;
            this.pivot.add(this.tiles[j*n_tile_side + i]);
        }
    }
}

/*
@brief: Island basement contructor
@param: position of the basement;
@param: rotation of the basement;
@param: material of the basement;
*/
function IslandBasement(position, rotation, mat)
{
    var n_tile_side = 15 / BI_BASE_TILE_DIM;

    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    this.tiles = [];
    for(var j = 0; j < n_tile_side; j++)
    {
        for(var i = 0; i < n_tile_side; i++)
        {
            var this_position = new THREE.Vector3(-7.5 + (BI_BASE_TILE_DIM/2) + i*BI_BASE_TILE_DIM, 0, -7.5 + (BI_BASE_TILE_DIM/2) + j*BI_BASE_TILE_DIM);
            var scaling = 30*Math.pow(2.71828, -(0.1*this_position.lengthSq())) + 1;
            this.tiles.push(new THREE.Mesh(bi_floor_tile, mat));
            this.tiles[j*n_tile_side + i].scale.y = scaling;
            this.tiles[j*n_tile_side + i].position.x = this_position.x;
            this.tiles[j*n_tile_side + i].position.z = this_position.z;
            this.tiles[j*n_tile_side + i].position.y = -0.25*scaling;     
            this.pivot.add(this.tiles[j*n_tile_side + i]);
        }
    }
}

/*
@brief: Ruined Wall contructor
@param: position of the wall
@param: rotation of the wall
@param: material of the wall
@param: length of te broken part
 */
function RuinedWall(position, rotation, mat, broken_len)
{
    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    //Non-ruined part of the wall
    this.part1 = new THREE.Mesh(rwall_part1, mat);
    this.pivot.add(this.part1);

    //Random disaligned bricks
    this.r_bricks = [];
    for(var i = 0; i < 10; i++)
    {
        //Generate two random indeces in the range [0, (wall_width/brick_width) -1] and [0, (wall_height/brick_height) -1]
        var rand_i = Math.floor(Math.random() * (8 / BI_WALL_BRICK_W));
        var rand_j = Math.floor(Math.random() * (5 / BI_WALL_BRICK_H));
        this.r_bricks[i] = new THREE.Mesh(rwall_bricks, mat);
        this.r_bricks[i].position.z = -4 + BI_WALL_BRICK_W/2 + rand_i*BI_WALL_BRICK_W;
        this.r_bricks[i].position.y = +2.5 - BI_WALL_BRICK_H/2 - rand_j*BI_WALL_BRICK_H;
        this.pivot.add(this.r_bricks[i]);
    }

    //Broken part of the wall
    this.part2 = [];
    for(var i = 0; i < 5 / BI_WALL_BRICK_H ; i++)
    {
        var d = 0.25;
        var c = (broken_len - d) / ((5/BI_WALL_BRICK_H -1)*(5/BI_WALL_BRICK_H -1));
        var new_len = c*i*i + d;
        var scaling = new_len / BI_WALL_BRICK_W;
        this.part2[i] = new THREE.Mesh(rwall_bricks, mat);
        this.part2[i].scale.z = scaling;
        this.part2[i].scale.x = 0.83;
        this.part2[i].position.z = 4 + new_len/2;
        this.part2[i].position.y = 2.5 - BI_WALL_BRICK_H/2 - i*BI_WALL_BRICK_H;
        this.pivot.add(this.part2[i]);
    }
}