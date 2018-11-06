/**
a simple two dimensional maze game. javascript/node.js 
**/

//defining global vars

"use strict";

// i dont want to loop the cells i want to loop the route, the nearest possible element that has an access way then retrieve 
//shortest path, start with nearby elements, its not an array, its a map 

var styles=["bottom","right","left"]; //you can change the level difficulty by changing the styles 
var colors=["red","green","orange", "gray", "purple", "blue", "yellow"]; 
//global functions
var rand  = function(t){
  return Math.floor((Math.random() * t));
}

class Maze {
  //1. creates a random maze given width and height of the board and displays it. we have a default value
  constructor(row=0, col=0, can_be_solved=false, head=0, tail=0) {
    this.row = row;
    this.col = col;
    this.rows = [];
    this.steps = 0;
    this.route = [];
    this.visited = [];
    this.size = this.row*this.col;
    this.cells = [];
    this.cbs = can_be_solved;
    this.solved = false;
    this.head = head; //the start point to the maze
    this.tail = tail; //the exit point from a maze
    this.html();
  //  this.drawMaze();
  }
  //3. shows the shortest route between starting point and destination 
  drawMaze(){
    for(let r=0; r < this.row; r++)
    {
      this.rows[r] = new Row(r,this);

    }
    this.pickHeadTail(); //now pick head and tail
     //work to detect success path, this can be done in different ways
//          this.routeStyle();
    if (!this.solved)
    {
      if(this.cbs){
        console.log("Drawing a maze now");
        maze = new Maze(this.row,this.col,true);
        document.getElementById("maze").innerHTML = "";
        maze.drawMaze();
      }else{
        alert("This maze can't be solved, refresh the page or set can_be_solved to true when you create a maze instance");
      }
    }

    console.log(this.solved);
  }

  pickHeadTail(){
    this.head  = this.rows[0].cells[rand(this.col)];
    this.head = this.cells.find(cell => cell.row === this.head.row && cell.col === this.head.col);
    this.head.style = "head";
    this.head.html("head");
    
    this.tail =  this.rows[this.row-1].cells[rand(this.col)];
    this.tail = this.cells.find(cell => cell.row === this.tail.row && cell.col === this.tail.col);
    this.tail.style = "tail";
    this.tail.html("tail");
    //not a good idea to try to catch range error of memory stack size exceeded, perforamnce degradation 
    //try {
    this.solved = this.drawRoute(this.head); //just to make sure head and tail were set when we call this guy
    //}catch(e){
     // console.log("I will generated another one now");
    // }
  }

  drawRoute(cell){

    console.log(this.steps++);
//      console.log("cell in call", cell);
    if(this.steps > this.row*this.col)
    { //this to minimize an overstack error possiblity 
      console.log("exceeded our intentions");
      return false;
    }

    if(cell.style === "tail") {
      return true; 
    }

    let visited = this.visited.find(cell_ => cell_ === cell);

    if ((visited))
    {
      return false;
    } 

    this.visited.push(cell);

    let bottom_cell = this.cells.find(cell_=> cell_.row === (cell.row+1) 
                                      && cell_.col === (cell.col)); //indicates an available bottom route
    let visited_bottom_cell = this.visited.find(cell_ => cell_ === bottom_cell); //indicates a visited bottom route

    let left_cell = this.cells.find(cell_=> cell_.row === cell.row && cell_.col === (cell.col-1));
    let visited_left_cell = this.visited.find(cell_ => cell_ === left_cell);
    let right_cell = this.cells.find(cell_=> cell_.row === cell.row && cell_.col === (cell.col+1));
    let visited_right_cell = this.visited.find(cell_ => cell_ === right_cell);
    let top_cell = this.cells.find(cell_=> cell_.row === (cell.row-1) && cell_.col === (cell.col));
    let visited_top_cell = this.visited.find(cell_ => cell_ === top_cell);

    
    if (cell.style !== "bottom" &&  bottom_cell && bottom_cell.col === cell.col 
        && visited_bottom_cell === undefined && this.drawRoute(bottom_cell)) 
    { 
      this.route.push(cell);
//        console.log("cell is not bottom:", cell);
//       console.log("and we checked on ", bottom_cell);
      return true;
    }    

    if(cell.col >= this.tail.col )
    { //this check here helps in finding a shorter path to tail. Smarter vs Faster, your call :)
      if (left_cell && left_cell.style !== "right" && cell.style !== "left" )
      { 
        if (visited_left_cell === undefined && this.drawRoute(left_cell) ) 
        { 
          this.route.push(cell); 
//          console.log("cell is not left:", cell);
//          console.log("and we checked on ", left_cell);
          return true;
        }
      }
      if ( right_cell && right_cell.style !== "left" && cell.style !== "right")
      { 
        if (visited_right_cell === undefined && this.drawRoute(right_cell)) 
        {
          this.route.push(cell);
//          console.log("cell is not right:", cell);
//          console.log("and we checked on ", right_cell);
          return true;
        }
      }
     }
     else
     {
      if (right_cell && right_cell.style !== "left" && cell.style !== "right")
      { 
        if (visited_right_cell === undefined && this.drawRoute(right_cell)) 
        {
          this.route.push(cell);
//          console.log("cell is not right:", cell);
//          console.log("and we checked on ", right_cell);
          return true;
        }
      }
      if (left_cell && left_cell.style !== "right" && cell.style !== "left")
      { 
        if (visited_left_cell === undefined && this.drawRoute( left_cell)) 
        { 
          this.route.push(cell); 
//          console.log("cell is not left:", cell);
//          console.log("and we checked on ", left_cell);
          return true;
        }
      }
     }

    if (top_cell && top_cell.style !== "bottom" && visited_top_cell === undefined 
        && this.drawRoute(top_cell)) 
    { 
      this.route.push(cell);
//      console.log("cell is not bottom:", cell);
//      console.log("and we checked on ", top_cell );
      return true;
    }
    return false;
  }

  routeStyle()
  {
    for(let i=0; i<this.route.length; i++)
    {
      this.route[i].html("route "+i.toString());
    }
  }
  html(name) {
    let table = document.getElementById("maze");
    if(!table)
    {
      table = document.createElement("table");
      table.id = "maze";
      if(document && document.body)
      {
       document.body.appendChild(table); 
      }
      else
      {
       alert("Make sure to run maze.js inside an html page, with a present body tag");
      }
    }
    return table;
  }

};

class Row {
  constructor(row=0, maze) {
    this.row = row;
    this.maze = maze;
    this.cells = [];
    this.route = [];
    this.html();
    this.createCells();
  //  this.headAndTail();
  }

  html() {
    let row = document.getElementById("row_"+this.row.toString());
    if(!row)
    {
      row = document.createElement("tr");
      row.id = "row_"+this.row.toString();
      this.maze.html().appendChild(row);
    }
    return row;
  }

  createCells(){
    //we want our head/start cell to be in 0 row, but a random cell
    for(let c=0; c < this.maze.col; c++)
    {
      let cell = new Cell(this.row, c);
      this.cells.push({col:cell.col,row:cell.row});
      this.maze.cells.push(cell);
      this.html().appendChild(cell.html());
    }

  }
};

class Cell {
  constructor(row=0,col=0) {
    this.row = row;
    this.col = col;
  //  this.head = false;
   // this.tail = false;
    this.blocked = false;
   // this.position = {row,col};
    this.style = styles[rand(styles.length)];
  }

  html(style) {
    let cell = document.getElementById("cell_"+this.row+"."+this.col );
    if(!cell)
    {
      cell = document.createElement("td");
      cell.id = "cell_"+this.row+"."+this.col;
      if(!style)
      {
        cell.className =  this.style;
      }
      else 
      {
        cell.className = cell.className + " " + style;
      }
    }
    if(style)
    {
      cell.className =  cell.className + " " + style;
    }
    return cell;
  }
};

let maze = new Maze(36,36, true);// you can use redraw maze is not solvable by using new Maze(6,6,true);
maze.drawMaze();
