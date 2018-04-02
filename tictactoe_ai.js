var board_config_array;
var winplayer,winit=0,tie=0;
var alerthim=0;
var totalcalls=0;
var co1,co2,co3; //winner's coordinates
const human="X"; //constant human value
const computer="O"; //constant computer value
const matrix_of_winning_states=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]//winning states
const cells = document.querySelectorAll('.table_class');
//only to access the cells of the table . The changes made in this array won't change the original stuff
startgame();
function startgame(){
    board_config_array=Array.from(Array(9).keys());
    tie=0;
    winit=0;
    winplayer="none";
    for(var i=0 ; i<cells.length ;i++){
      //change the CSS properties here and reset
        cells[i].style.backgroundColor="";
        cells[i].innerText = '';  //working
        cells[i].addEventListener("click",turnclick,false);
    }
    //setTimeout(function (){alert( "Let Us Play" );},1.5);
}

function turnclick(val){
    if(typeof (board_config_array[val.target.id]) == 'number' ){
      turn( val.target.id, human);
       if(!checkwin(board_config_array,human) && !checkfortie()){
        turn(findbestpos(),computer); //find the best spot for the computer player using minimax and take the turn;
      }
  }
}

function helper_emptycells(){
    return board_config_array.filter(s => typeof s == 'number');
}
function findbestpos(){
  return minimax(board_config_array,computer).index;
}
function checkfortie(){
  if(helper_emptycells().length==0){
    for(var i=0;i<cells.length;i++){
      cells[i].style.backgroundColor="pink";
      cells[i].removeEventListener('click',turnclick,false);
    }
    tie=1;
    setTimeout(function (){alert("TIE!");},1.5);
    return true;
  }
  return false;
}
function pop_winner_func(player){
  if(tie ==0 && player==human){
    setTimeout(function (){alert("YOU WIN!");},1.5);
  }
  else{
    setTimeout(function (){alert("YOU LOSE!");},1.5);
  //  startgame();
  }
}
function turn(cellno,player){
    board_config_array[cellno] = player;
    document.getElementById(cellno).innerText=player;
    var win=checkwin(board_config_array,player);
    // document.getElementById(cellno).innerText=player;
    if(win==true){
      tie=0;
      gameover();
    }
}
function checkwin(array,player){

    for(var i=0;i<array.length;i++){
      for(var j=1;j<array.length;j++){
        for(var k=2;k<array.length;k++){
          for(var l=0;l<matrix_of_winning_states.length;l++){
            if(array[i]==player && array[j]==player && array[k]==player && matrix_of_winning_states[l][0]==i && matrix_of_winning_states[l][1]==j && matrix_of_winning_states[l][2]==k){
              co1=i;co2=j;co3=k;
              winit=1;
              winplayer=player;
              return true;
            }
          }
        }
      }
    }
    return false;
}
function gameover(){
  document.getElementById(co1).style.backgroundColor="lightgreen";
  document.getElementById(co2).style.backgroundColor="lightgreen";
  document.getElementById(co3).style.backgroundColor="lightgreen";
  for(var i=0;i<cells.length;i++){
    cells[i].removeEventListener('click',turnclick,false);
  }
  if(winit==1){
    pop_winner_func(winplayer);
  }
}

function minimax(board,player){
  //returns a {} pair of index,score
  totalcalls++;
  var empty_places = helper_emptycells();

  //BASE CASE  / LEAF REACHED
  if(checkwin(board,player)==1){
      return {score:-10};
  }
  else if(checkwin(board,computer)){
    return  {score:10};
  }
  else if(empty_places.length==0){
      return {score:0};
  }
  //check all spots on the board available
  var moves_results=[];
  //moves_results = vector<pair<int,int>>
//  console.log(empty_places.length);
  for(var i=0;i<empty_places.length;i++){
    var tempmoves={};
    //tempmoves = pair<int,int>
    tempmoves.index = board[empty_places[i]];
    board[empty_places[i]]=player; // set it as some move and recurse with other player

    if(player == computer){
      var x = minimax(board,human);
      tempmoves.score  =x.score;
    }
    else {
      var x = minimax(board,computer);
    //  recurse_result.score=x;
      tempmoves.score  =x.score
    }


    //reset the Board to original config after recursion
    board[empty_places[i]]=tempmoves.index;
      moves_results.push(tempmoves);
    //moves_results = vector<pair<int,int>>
    }
    var optimal_pos;
    if(player == computer){
      var ans=-100;
      for(var i=0;i<moves_results.length;i++){
        if(ans<moves_results[i].score){
          ans=moves_results[i].score;
          optimal_pos=i;
          if(ans==10){
            optimal_pos=i;
            break;
          }
        }
      }
    }
    else{
      var ans=100;
      var ok=0;
      for(var i=0;i<moves_results.length;i++){
        if(ans>moves_results[i].score){
          ans=moves_results[i].score;
          optimal_pos=i;
          if(ans==-10){
            ok=1;
            optimal_pos=i;
            break;
          }
        }
      }
    }

  console.log(totalcalls);
  return moves_results[optimal_pos];

}
