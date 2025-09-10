//tile
let tile=32;
let rows=16;
let columns=16;


// board
let boardWidth=tile*columns;
let boardHeight=tile*rows;
let context;


let eggIntervalId = null;

//ship
let shipWidth=tile;
let shipHeight=tile;
let shipX=tile*columns/2 -tile;
let shipY=tile*rows-tile*2;
let shipImg;
let shipVelocityX=tile;
let ship={
    width:shipWidth,
    height:shipHeight,
    x:shipX,
    y:shipY
}

//alien
let alienArray=[];
let alienWidth=tile*2;
let alienHeight=tile;
let alienVelocityX=1;
let alienCount;
let alienImg;
let alienX=tile;
let alienY=tile;
let alienRows=2;
let alienColumns=3;
//bullets
let bulletsArray=[];
let bulletsVelocityY=-10;//bullet moving speed
//score ad gameover
let score=0;
let gameover=false;
//Egg
let eggArray=[];
let eggVelocityY=10;
window.onload=function(){
    board=document.getElementById("board");
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext("2d")

    //draw a ship
    shipImg=new Image();
    shipImg.src='./ship.png';
     shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }
    
    //draw an alien
    alienImg=new Image();
    alienImg.src="./alien.png";
    createAlien();
    requestAnimationFrame(update);
    document.addEventListener("keydown",moveShip);
    document.addEventListener("keyup",shoot);
    
   
}
function randomEgg(length)
{
    let num= Math.floor(Math.random()*length);
    return num;

}
function update()
{
requestAnimationFrame(update);
if(gameover)
{
   
    context.fillStyle = "red";
    context.font = "32px Courier";
    context.fillText("GAME OVER", boardWidth / 2 - 100, boardHeight / 2);
if (eggIntervalId) {
    clearInterval(eggIntervalId);
    eggIntervalId = null;
}


    return;
}

context.clearRect(0,0,boardWidth,boardHeight);
//ship
context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
//alien
for(let i=0;i<alienArray.length;i++)
{
   let alien=alienArray[i];
   
   if(alien.alive)
   {
    alien.x+=alienVelocityX;
    //check for if the alien touches the boarder
    if(alien.x+alienWidth>=boardWidth || alien.x<=0)
    {
        alienVelocityX*= -1;
        alien.x+=alienVelocityX*2;
        //move all alien up by one row
        for(let j=0;j<alienArray.length;j++)
        {
            alienArray[j].y+=alienHeight;
        }
    }
     let img = new Image();
        img.src = alien.img;

context.drawImage(img, alien.x, alien.y, alien.width, alien.height);
    if(alien.y>=ship.y)
    {
        gameover=true;
    }
   }
}
    for(let i=0;i<eggArray.length;i++)
{
    let egg=eggArray[i];
    egg.y+=eggVelocityY;
   
    context.drawImage(egg.img,egg.x,egg.y,egg.width,egg.height);
     
        
        if(!egg.used  && detectCollision(egg,ship))
        {

egg.used=true;
gameover=true;

        }
    

//clear bullets
while (eggArray.length > 0 && (eggArray[0].used || eggArray[0].y < 0)) {
  eggArray.shift();
}

}
//bullets
for(let i=0;i<bulletsArray.length;i++)
{
    let bullet=bulletsArray[i];
    bullet.y+=bulletsVelocityY;
    context.fillStyle="white";
    context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);
    //bulet collission with the alien
    for(let j=0;j<alienArray.length;j++)
    {
        let alien=alienArray[j];
        if(!bullet.used && alien.alive && detectCollision(bullet,alien))
        {
alien.alive=false;
bullet.used=true;
alienCount--;
score+=100;
        }
    }
}
//clear bullets
while (bulletsArray.length > 0 && (bulletsArray[0].used || bulletsArray[0].y < 0)) {
  bulletsArray.shift();
}

//next level
if(alienCount===0)
{
    //increase number of alien in row and column by 1
    score+=alienColumns*alienRows*100;
    alienColumns=Math.min(alienColumns+1,columns/2);
    alienRows=Math.min(alienRows+1,rows-4);
    if(alienVelocityX>0)
    {
alienVelocityX+=0.2;
    }
    else{
        alienVelocityX-=0.2;
    }
    alienArray=[];
    bulletsArray=[];
    createAlien()
}
//score
context.fillStyle="white";
context.font="16px courier";
context.fillText(score,5,20);
}
function moveShip(e)
{
    if(gameover)
    {
        return;
    }
    if(e.code==="ArrowLeft" && ship.x-shipVelocityX>=0)
    {
ship.x-=shipVelocityX;
    }
    if(e.code==="ArrowRight" && ship.x+shipVelocityX+shipWidth<=boardWidth)
    {
ship.x+=shipVelocityX;
    }
}
function shoot(e)
{
     if(gameover)
    {
        return;
    }
    if(e.code==="Space")
    {
         let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tile/8,
            height : tile/2,
            used : false
        }
        bulletsArray.push(bullet)
    }
}
let colour=["./alien-cyan.png","./alien-magenta.png","./alien-yellow.png"];
function randomColour(data)
{
    return Math.floor(Math.random()*3);
}
function createAlien()
{
    for(let c=0;c<alienColumns;c++)
    {
        for(let r=0;r<alienRows;r++)
        {
            let alien={
                img:alienImg,
                width:alienWidth,
                height:alienHeight,
                x:alienX+alienWidth*c,
                y:alienY+alienHeight*r,
                alive:true

            }
             alienArray.push(alien);
        }
       
    }
    alienCount=alienArray.length;
    //let assign random colours
    for(let i=0;i<alienArray.length;i++)
    {
      let ran=alienArray[i];
     
        let num=randomColour(4);
       ran.img=colour[num];
       alienArray[i]=ran;
    }
   if (!eggIntervalId) {
    eggIntervalId = setInterval(() => {
        if (!gameover) {
            layEggs();
            // console.log(eggIntervalId)
        }
    }, 800); // Adjust speed as needed
}

   
    
}
function layEggs()
{
     let num=randomEgg(alienArray.length)
    console.log(num);
    let img=new Image();
    img.src="./egg.png";
    
     let egg = {
        img:img,
        
            x : alienArray[num].x + alienWidth*15/32,
            y : alienArray[num].y,
            width : tile/2,
            height : tile/2,
            used : false
        }
        eggArray.push(egg);

        context.drawImage(img,egg.x,egg.y,egg.width,egg.height);
 
}
function detectCollision(a,b)
{
    return a.x<b.x+b.width &&
           b.x<a.x+a.width&&
           a.y<b.y+b.height&&
           b.y<a.y+a.height;
}


