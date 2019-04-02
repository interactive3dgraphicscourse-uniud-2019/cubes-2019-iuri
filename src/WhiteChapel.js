/********************
 File: WhiteChapel.js
 Author: Marco Iuri
 Date: 28/03/2019
 ********************/

/*CONSTANTS*/
const BI_FLOOR_TILE_DIM = 1.5;
const CH_FLOOR_TILE_DIM = 0.75;
const BI_BASE_TILE_DIM = 1;
const BI_FLOOR_TILE_VARIANCE = 0.4;
const BI_WALL_BRICK_W = 1;
const BI_WALL_BRICK_H = 0.5;

/*MATERIALS DEFINTIONS*/
var white_mat;

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
//BridgeComponent
var bridge_comp1;
var bridge_comp2
//MovingCube
var mov_cube;

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
    rwall_part1 = new THREE.BoxGeometry(0.5, 1, 1);
    rwall_bricks = new THREE.BoxGeometry(0.6, BI_WALL_BRICK_H, BI_WALL_BRICK_W);

    //Bridge component
    bridge_comp1 = new THREE.BoxGeometry(2, 2, 2);
    bridge_comp2 = new THREE.BoxGeometry(3, 0.5, 1);

    //MovingCube
    mov_cube = new THREE.BoxGeometry(1, 1, 1);
}

function InitMaterials()
{
    white_mat = new THREE.MeshPhongMaterial();
    white_mat.color.setRGB(1.0, 1.0, 1.0);
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
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    //Create little columns
    this.lcols = new Array();
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25,  3.5), new THREE.Vector3(0,0,0), white_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-3.5, -0.25, -3.5), new THREE.Vector3(0,0,0), white_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3(-1.5, -0.25, -3.5), new THREE.Vector3(0,0,0), white_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 1.5, -0.25, -3.5), new THREE.Vector3(0,0,0), white_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25, -3.5), new THREE.Vector3(0,0,0), white_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25, -1.5), new THREE.Vector3(0,0,0), white_mat));
    this.lcols.push(new LittleColumn(new THREE.Vector3( 3.5, -0.25,  1.5), new THREE.Vector3(0,0,0), white_mat));
    
    //Add little columns to the island
    for(var c = 0; c < this.lcols.length; c++)
        this.pivot.add(this.lcols[c].basement);

    //Create broken little columns
    this.b_lcols = new Array();
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3( 1.5, -0.25,  3.5), new THREE.Vector3(0,0,0), white_mat, 1.0));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-1.5, -0.25,  3.5), new THREE.Vector3(0,0,0), white_mat, 0.65));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-3.5, -0.25,  3.5), new THREE.Vector3(0,0,0), white_mat, 0.25));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-3.5, -0.25,  1.5), new THREE.Vector3(0,0,0), white_mat, 0.5));
    this.b_lcols.push(new LittleColumn_Broken(new THREE.Vector3(-3.5, -0.25, -1.5), new THREE.Vector3(0,0,0), white_mat, 0.75));

    //Add broken little columns to the island
    for(var c = 0; c < this.b_lcols.length; c++)
        this.pivot.add(this.b_lcols[c].basement);

    //Create big column
    this.bcol = new BigColumn(new THREE.Vector3(-2.5, 0, 7), new THREE.Vector3(0,0,0), white_mat);

    //Add big column to the island
    this.pivot.add(this.bcol.basement);

    //Create broken big columns
    this.b_bcols = new Array();
    this.b_bcols.push(new BigColumn_Broken(new THREE.Vector3(   7, 0, 7), new THREE.Vector3(0,0,0), white_mat, 1.0));
    this.b_bcols.push(new BigColumn_Broken(new THREE.Vector3( 2.5, 0, 7), new THREE.Vector3(0,0,0), white_mat, 0.5));
    this.b_bcols.push(new BigColumn_Broken(new THREE.Vector3(  -7, 0, 7), new THREE.Vector3(0,0,0), white_mat, 0.3));

    //Add broken big columns to island
    for(var c = 0; c < this.b_bcols.length; c++)
        this.pivot.add(this.b_bcols[c].basement);

    //Create the tesselated floor
    this.floor = new TesselFloor(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), white_mat, 15, 15, BI_FLOOR_TILE_DIM);
    this.floor.pivot.position.y = -0.75;

    //Add the floor to the island
    this.pivot.add(this.floor.pivot);

    //Create the below part of the island
    this.is_base = new IslandBasement(new THREE.Vector3(0, -0.75, 0), new THREE.Vector3(0,0,0), white_mat, 15, 15, 30);

    //Add this part to the island
    this.pivot.add(this.is_base.pivot);

    //Create a first ruined wall
    this.ruinedWall1 = new RuinedWall(new THREE.Vector3(7.25, 1.75, -3.5), new THREE.Vector3(0 , 0, 0), white_mat, 11, 5, 3);

    //Add the first wall to the island
    this.pivot.add(this.ruinedWall1.pivot);

    //Create a first ruined wall
    this.ruinedWall1 = new RuinedWall(new THREE.Vector3(3.5, 1.75, -7.25), new THREE.Vector3(0, -Math.PI/2, 0), white_mat, 15, 5, 7);

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
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(lc_main, mat);
    this.main.position.set(0, 1.75, 0);
    this.basement.add(this.main);

    //Capitel creation
    this.capitel = new THREE.Mesh(lc_capitel, mat);
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
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(lc_main, mat);
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
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(bc_main, mat);
    this.main.position.set(0, 2.125, 0);
    this.basement.add(this.main);

    //Capitel creation
    this.capitel = new THREE.Mesh(bc_capitel, mat);
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
    this.basement.position.x = position.x;
    this.basement.position.y = position.y;
    this.basement.position.z = position.z;
    this.basement.rotation.x = rotation.x;
    this.basement.rotation.y = rotation.y;
    this.basement.rotation.z = rotation.z;

    //Center part creation
    this.main = new THREE.Mesh(bc_main, mat);
    this.main.scale.y = height;
    this.main.position.set(0, 1.75*height, 0);
    this.basement.add(this.main);
}

/*
@brief: Tessellated floor contructor
@param: position of the floor;
@param: rotation of the floor;
@param: material of the floor;
@param: size of the tiles that made the floor
*/
function TesselFloor(position, rotation, mat, width, depth, tile_size)
{
    var n_tile_side_x = Math.floor(width / tile_size);
    var n_tile_side_z = Math.floor(depth / tile_size);

    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    this.tiles = new Array();
    for(var j = 0; j < n_tile_side_z; j++)
    {
        for(var i = 0; i < n_tile_side_x; i++)
        {
            var random_y_scale = BI_FLOOR_TILE_VARIANCE*(Math.random()*2 -1);
            this.tiles.push(new THREE.Mesh(bi_floor_tile, mat));
            this.tiles[j*n_tile_side_x + i].scale.y += random_y_scale;
            this.tiles[j*n_tile_side_x + i].position.x = -width/2 + (tile_size/2) + i*tile_size;
            this.tiles[j*n_tile_side_x + i].position.z = -depth/2 + (tile_size/2) + j*tile_size;
            this.pivot.add(this.tiles[j*n_tile_side_x + i]);
        }
    }
}

/*
@brief: Island basement contructor
@param: position of the basement;
@param: rotation of the basement;
@param: material of the basement;
@param: width of the basement;
@param: depth of the basemept;
@param: height of the basement;
*/
function IslandBasement(position, rotation, mat, width, depth, height)
{
    var n_tile_side_x = width / BI_BASE_TILE_DIM;
    var n_tile_side_z = depth / BI_BASE_TILE_DIM;

    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    this.tiles = new Array();
    for(var j = 0; j < n_tile_side_z; j++)
    {
        for(var i = 0; i < n_tile_side_x; i++)
        {
            var this_position = new THREE.Vector3(-width/2 + (BI_BASE_TILE_DIM/2) + i*BI_BASE_TILE_DIM, 0, -depth/2 + (BI_BASE_TILE_DIM/2) + j*BI_BASE_TILE_DIM);
            var scaling = height*Math.pow(2.71828, -(0.1*this_position.lengthSq())) + 1;
            this.tiles.push(new THREE.Mesh(bi_floor_tile, mat));
            this.tiles[j*n_tile_side_x + i].scale.y = scaling;
            this.tiles[j*n_tile_side_x + i].position.x = this_position.x;
            this.tiles[j*n_tile_side_x + i].position.z = this_position.z;
            this.tiles[j*n_tile_side_x + i].position.y = -0.25*scaling;     
            this.pivot.add(this.tiles[j*n_tile_side_x + i]);
        }
    }
}

/*
@brief: Ruined Wall contructor
@param: position of the wall
@param: rotation of the wall
@param: material of the wall
@param: length of the wall
@param: height of the wall
@param: length of te broken part
 */
function RuinedWall(position, rotation, mat, length, height, broken_len)
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
    this.part1.scale.y = height;
    this.part1.scale.z = length - broken_len;
    this.pivot.add(this.part1);

    //Random disaligned bricks
    this.r_bricks = new Array();
    for(var i = 0; i < 10; i++)
    {
        //Generate two random indeces in the range [0, (wall_width/brick_width) -1] and [0, (wall_height/brick_height) -1]
        var rand_i = Math.floor(Math.random() * ( length - broken_len/ BI_WALL_BRICK_W));
        var rand_j = Math.floor(Math.random() * (height / BI_WALL_BRICK_H));
        this.r_bricks[i] = new THREE.Mesh(rwall_bricks, mat);
        this.r_bricks[i].position.z = -(length - broken_len)/2 + BI_WALL_BRICK_W/2 + rand_i*BI_WALL_BRICK_W;
        this.r_bricks[i].position.y = +height/2 - BI_WALL_BRICK_H/2 - rand_j*BI_WALL_BRICK_H;
        this.pivot.add(this.r_bricks[i]);
    }

    //Broken part of the wall
    this.part2 = new Array();
    if(broken_len > 0)
    {
        for(var i = 0; i < height / BI_WALL_BRICK_H ; i++)
        {
            var d = 0.25;
            var c = (broken_len - d) / ((height/BI_WALL_BRICK_H -1)*(height/BI_WALL_BRICK_H -1));
            var new_len = c*i*i + d;
            var scaling = new_len / BI_WALL_BRICK_W;
            this.part2.push(new THREE.Mesh(rwall_bricks, mat));
            this.part2[i].scale.z = scaling;
            this.part2[i].scale.x = 0.83;
            this.part2[i].position.z = (length - broken_len)/2 + new_len/2;
            this.part2[i].position.y = (height)/2 - BI_WALL_BRICK_H/2 - i*BI_WALL_BRICK_H;
            this.pivot.add(this.part2[i]);
        }
    }
}

/*
@brief: Chapel constructor
@param: Position of the chapel
@param: rotation of the chapel
@param: material of the chapel
*/
function Chapel(position, rotation, mat)
{
    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    //Chapel floor
    this.floor = new TesselFloor(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), mat, 7, 11, CH_FLOOR_TILE_DIM);
    this.pivot.add(this.floor.pivot);

    //Chapel altar
    this.altar = new ChapelAltar(new THREE.Vector3(0, 1.125, 4.25), new THREE.Vector3(0,0,0), mat);
    this.pivot.add(this.altar.pivot);

    //Four column
    this.cols = new Array();
    this.cols[0] = new LittleColumn(new THREE.Vector3( 1.5, 0.75,  1.5), new THREE.Vector3(0,0,0), mat);
    this.cols[1] = new LittleColumn(new THREE.Vector3(-1.5, 0.75,  1.5), new THREE.Vector3(0,0,0), mat);
    this.cols[2] = new LittleColumn(new THREE.Vector3(-1.5, 0.75, -2.5), new THREE.Vector3(0,0,0), mat);
    this.cols[3] = new LittleColumn(new THREE.Vector3( 1.5, 0.75, -2.5), new THREE.Vector3(0,0,0), mat);    
    for(var i = 0; i < this.cols.length; i++)
        this.pivot.add(this.cols[i].basement);

    //Ruined right side wall
    this.wall_right = new RuinedWall(new THREE.Vector3(-3.5, 2.25, -1.25), new THREE.Vector3(0,0,0), mat, 10.25, 4, 2.25);
    this.pivot.add(this.wall_right.pivot);

    //Left side wall
    this.wall_left = new RuinedWall(new THREE.Vector3(3.5, 2.25, 0), new THREE.Vector3(0,0,0), mat, 10.5, 4, 0);
    this.pivot.add(this.wall_left.pivot);

    //Back wall
    this.wall_back = new RuinedWall(new THREE.Vector3(0, 2.25, 5.125), new THREE.Vector3(0, Math.PI/2, 0), mat, 7.5, 4, 0);
    this.pivot.add(this.wall_back.pivot);

    //Front wall right
    this.front_wall_right = new RuinedWall(new THREE.Vector3(-2.375, 2.25, -5.5), new THREE.Vector3(0, Math.PI/2, 0), mat, 2.75, 4, 0);
    this.pivot.add(this.front_wall_right.pivot);

    //Front wall left
    this.front_wall_left = new RuinedWall(new THREE.Vector3(2.375, 2.25, -5.5), new THREE.Vector3(0, Math.PI/2, 0), mat, 2.75, 4, 0);
    this.pivot.add(this.front_wall_left.pivot);

    //Front wall center
    this.front_wall_center = new RuinedWall(new THREE.Vector3(0, 5, -5.5), new THREE.Vector3(0, Math.PI/2, 0), mat, 2, 4, 0);
    this.pivot.add(this.front_wall_center.pivot);

    //Triangular parts of the structure
    this.tris = new Array();
    this.tris.push(new RightTriangle(new THREE.Vector3(-1.25, 4, -5.5), new THREE.Vector3(0, -Math.PI/2, 0), mat, 2.5, 1.5));
    this.tris.push(new RightTriangle(new THREE.Vector3(1.25, 4, -5.5), new THREE.Vector3(0, Math.PI/2, 0), mat, 2.5, 1.5));
    this.tris.push(new RightTriangle(new THREE.Vector3(0, 7, -5.5), new THREE.Vector3(0, Math.PI/2.0, 0), mat, 1, 1));
    this.tris.push(new RightTriangle(new THREE.Vector3(0, 7, -5.5), new THREE.Vector3(0, -Math.PI/2.0, 0), mat, 1, 1));
    this.tris.push(new RightTriangle(new THREE.Vector3(0, 4, 5.125), new THREE.Vector3(0, Math.PI/2.0, 0), mat, 3.5, 2));
    this.tris.push(new RightTriangle(new THREE.Vector3(0, 4, 5.125), new THREE.Vector3(0, -Math.PI/2.0, 0), mat, 3.5, 2));


    for(var i = 0; i < this.tris.length; i++)
        this.pivot.add(this.tris[i].pivot);

    //Chapel basement
    this.basement = new IslandBasement(new THREE.Vector3(0, -0.25, 0), new THREE.Vector3(0,0,0), mat, 9, 13, 50);
    this.pivot.add(this.basement.pivot);
}

/*
@brief: Chapel altar constructor
@param: position of the altar
@param: rotation of the altar
@param: material of the altar
*/
function ChapelAltar(position, rotation, mat)
{
    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    //Upper plane
    var plane_geom = new THREE.BoxGeometry(3, 0.25, 1.5);
    this.upper_plane = new THREE.Mesh(plane_geom, mat);
    this.pivot.add(this.upper_plane);

    //Basement
    var base_geom = new THREE.BoxGeometry(2, 0.75, 1);
    this.basement = new THREE.Mesh(base_geom, mat);
    this.basement.position.z = 0.25;
    this.basement.position.y = -0.5;
    this.pivot.add(this.basement);
}

/*
@brief: Right triangle contstructor
@param: position of the triangle;
@param: rotation of the triangle;
@param: material of the triangle;
@param: base of the triangle;
@param: height of the triangle;
*/
function RightTriangle(position, rotation, mat, base, height)
{
    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;


    //Generate the triangle starting of wall bricks geometry
    this.bricks = new Array();
    for(var i = 0; i < base / 0.5; i++)
    {
        var d = 0.5;
        var c = (height - 0.5) / (base/0.5 - 1);
        var new_len = c*i + d;
        var scaling_z = 0.5 / BI_WALL_BRICK_W;
        var scaling_y = new_len / BI_WALL_BRICK_H;
        this.bricks.push(new THREE.Mesh(rwall_bricks, mat));
        this.bricks[i].scale.z = scaling_z;
        this.bricks[i].scale.y = scaling_y;
        this.bricks[i].scale.x = 0.83;
        this.bricks[i].position.y = new_len/2;
        this.bricks[i].position.z = (base - 0.5) - i*0.5;
        this.pivot.add(this.bricks[i]);
    }
}

/*
@brief: Bridge constructor
@param: position of the bridge
@param: rotation of the bridge
@param: material of the bridge
*/
function Bridge(position, rotation, mat)
{
    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    //Create and add the bridge components
   this.elements = new Array();
   var c = 3/8;
   var d = -1;
   for(var i = 0; i < 9; i++)
   {
       var this_position = new THREE.Vector3(0, c*i+d, -9 + i*2);
       var this_rotation = new THREE.Vector3(0, 0, Math.PI/8 * i);
       this.elements.push(new BridgeComponent(this_position, this_rotation, mat));
       this.pivot.add(this.elements[i].pivot);
   }
}

/*
@brief: BridgeComponent constructor
@param: position of the component
@param: rotation of the component
@param: material of the component
*/
function BridgeComponent(position, rotation, mat)
{
    this.pivot = new THREE.Object3D();
    this.pivot.position.x = position.x;
    this.pivot.position.y = position.y;
    this.pivot.position.z = position.z;
    this.pivot.rotation.x = rotation.x;
    this.pivot.rotation.y = rotation.y;
    this.pivot.rotation.z = rotation.z;

    //Create the parts of the bridge component
    this.lateral_blocks = new Array();
    this.lateral_blocks.push(new THREE.Mesh(bridge_comp1, mat));
    this.lateral_blocks.push(new THREE.Mesh(bridge_comp1, mat));
    this.lateral_blocks[0].position.x = 2.5;
    this.lateral_blocks[1].position.x = -2.5;
    for(var i = 0; i < this.lateral_blocks.length; i++)
        this.pivot.add(this.lateral_blocks[i]);
    
    this.central_blocks = new Array();
    this.central_blocks.push(new THREE.Mesh(bridge_comp2, mat));
    this.central_blocks.push(new THREE.Mesh(bridge_comp2, mat));
    this.central_blocks[0].position.z = -0.5;
    this.central_blocks[1].position.z = 0.5;
    this.central_blocks[1].position.y = 0.375;
    for(var i = 0; i < this.central_blocks.length; i++)
        this.pivot.add(this.central_blocks[i]);

    this.columns = new Array();
    this.columns.push(new LittleColumn(new THREE.Vector3(2.5, 1.5, 0), new THREE.Vector3(0,0,0), mat));
    this.columns.push(new LittleColumn(new THREE.Vector3(-2.5, 1.5, 0), new THREE.Vector3(0,0,0), mat));
    for(var i = 0; i < this.columns.length; i++)
        this.pivot.add(this.columns[i].basement);
}

/*
@brief: MovingCube constructor
@param: initial position of the cube
@param: initial rotation of the cube
@param: material of the cube
@param: velocity magnitude
@param: movement direction
*/
function MovingCube(position, rotation, mat, vel_mag, vel_dir)
{
    this.mesh = new THREE.Mesh(mov_cube, mat);
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
    this.mesh.rotation.x = rotation.x;
    this.mesh.rotation.y = rotation.y;
    this.mesh.rotation.z = rotation.z;

    this.velocity_mag = vel_mag;
    this.velocity_dir = new THREE.Vector3();
    this.velocity_dir.x = vel_dir.x;
    this.velocity_dir.y = vel_dir.y;
    this.velocity_dir.z = vel_dir.z;
    this.velocity_dir.normalize();
}