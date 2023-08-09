//constantes
const Main = document.getElementById("Main");
const Timer = document.getElementById("Timer");
const whitePromoteFrame = document.getElementById("promoteFrameWhite");
const blackPromoteFrame = document.getElementById("promoteFrameBlack");
const cellSize = 75;

//variables utilidad;
var automaticRotation = true;
var whiteTurn = true;
var table;
var blackTableScreen;
var tableRot = false;
var selectedPiece;
var lastPiece;
var whiteKing;
var blackKing;
var lastOrigin;
var promoteCoords; // = {x:x,y:y};
var whiteStopPoints = [];
var blackStopPoints = [];
var whitePieces = [];
var blackPieces = [];

function createTable(){
	table = document.createElement("div");
	table.className="table";
	table.style.width = (cellSize + 2)*8 + "px";
	table.style.height = (cellSize + 2)*8 + "px";
	
	blackTableScreen = document.createElement("div");
	blackTableScreen.id="BlackTableScreen";
	blackTableScreen.className="blackTableScreen";



	table.appendChild(blackTableScreen);
	Main.appendChild(table);

	for(let y = 7; y>=0;y--){
		for(let x = 0 ; x<=7;x++){
		//crea las celdas base del tablero;
			let cell = document.createElement("div");
			cell.className = "cell";
			cell.id = x+"_"+y;
			cell.style.width = cellSize + "px";
			cell.style.height = cellSize + "px";
			table.appendChild(cell);
			if((x%2 == 0 && y %2 == 0)||(x%2 != 0 && y %2 != 0)){
				cell.style.backgroundImage = "url('./img/bCell.png')"; 
			}else{
				cell.style.backgroundImage = "url('./img/wCell.png')"; 
			}
		//Añade elemento "dot" a cada celda
			let dot  = document.createElement("div");	
			dot.className="dot";
			dot.id="d_"+x+"_"+y;
		//Añade onclick(movePiece(x,y)) a cada dot;
			dot.addEventListener("click",function(){movePiece(x,y)},false);
			cell.appendChild(dot);

		//Añade div como modelo de pieza nula 
			let piece = document.createElement("div");
			piece.className = "pCell";
			piece.id="p_"+x+"_"+y;
			piece.setAttribute("piece","none");
			piece.setAttribute("team","none");
			cell.appendChild(piece);
		}
	}
}

//hace visible el "dot" en las coordenadas(x,y)
//PRECOND isValidCoors(x,y) == true
function showDot(x,y){
	document.getElementById("d_"+x+"_"+y).style.display ="block";
}
//hace invisible el "dot" en las coordenadas(x,y)
//PRECOND isValidCoors(x,y) == true
function hideDot(x,y){
	document.getElementById("d_"+x+"_"+y).style.display ="none";
}

function hideImposibleDots(team){
	let dotsNoHide = [];
	let kingCords;
	if(team =="white"){
		kingCords=fromPCellToCoords(whiteKing);
		dotsNoHide = whiteStopPoints; 
	}else{
		dotsNoHide = blackStopPoints;
		kingCords = fromPCellToCoords(blackKing);
	}

	if(dotsNoHide.length == 0){
		return;
	}

	for(let x = 0 ; x<=7;x++){
		for(let y = 0 ; y<=7;y++){
			let i = 0;
			let toHide;
			while(i<dotsNoHide.length){

				if((dotsNoHide[i].x == x && dotsNoHide[i].y == y)){
					//parar de buscar;
					break;
				}
				i++;
			}
			//si i == dotsNoHide.lenght => la casilla actual no esta en la lista de "no ocultar";
			// por lo tanto ocultar este porque no es un dot valido;
			if(i == dotsNoHide.length){
				hideDot(x,y);
			}
		}
	}
}


//hace invisible todos los "dot" del tablero;
function clearDots(){
	for(let y = 0 ; y<=7 ; y++){
		for(let x = 0 ; x<=7 ; x++){
				document.getElementById("d_"+x+"_"+y).style.display ="none";
		}
	}
}

//retorna string con el tipo de pieza en (x,y) (retorna 'none' si esta vacia)
////PRECOND isValidCoors(x,y) == true
function getPiece(x,y){
	if(!isValidCoords(x,y)){
		return;
	}
	return document.getElementById("p_"+x+"_"+y).getAttribute("piece");
}

//retorna string con el team de la pieza en (x,y) (retorna 'none' si es celda vacia)
//PRECOND isValidCoors(x,y) == true
function getTeam(x,y){
	return document.getElementById("p_"+x+"_"+y).getAttribute("team");
}
//retorna pCell de coordenadas (x,y)
//PRECOND isValidCoors(x,y) == true
function getPCell(x,y){
	return document.getElementById("p_"+x+"_"+y);
}
//retorna Cell de coordenadas (x,y)
//PRECOND isValidCoors(x,y) == true
function getCell(x,y){
	return document.getElementById(x+"_"+y);
}


//retorna true si son coordenadas validas(es decir si existen en el tablero);

function isValidCoords(x,y){
	return (x>=0 && x<=7)&&(y>=0 && y<=7);
}

//retorna true si la celda (x,y) no contiene una pieza
//PRECONDICION: isValidCoors(x,y) == true;
function isEmpty(x,y){
	return (document.getElementById("p_"+x+"_"+y).getAttribute("piece") == "none");
}

//modifica la pCell (agrega una figure>img con la pieza y equipo correspondiente)
//Ademas cada pieza tendra un onclick que llamará a : showMoves(x,y,piece,team);
//Actualiza variable global 'team'King
//PRECONDICIÓN: isValidCoors(x,y) == true

function createPiece(x,y,piece,team){

	let pCell = document.getElementById("p_"+x+"_"+y);
	let figure = document.createElement("FIGURE");
	let img = document.createElement("IMG");
	img.src = fromPieceToSrc(piece,team);
	img.addEventListener("click",function(){
		//CODIGO PARA CUANDO SE CLICKEE UNA PIEZA;
		showMoves(x,y,piece,team);
	},false);

	figure.appendChild(img);
	pCell.appendChild(figure);

	pCell.setAttribute("piece",piece);
	pCell.setAttribute("team",team);
	
}

//PRECOND isValidCoors(x,y) == true
function showMoves(x,y,piece,team){
	//CONTROL DE TURNO;
	
	if(team == "black" && whiteTurn || team == "white" && !whiteTurn){
		
		return;
	}


	clearDots();
	lastPiece = selectedPiece;
	selectedPiece = getPCell(x,y);
	
	selectedPiece.style.background="rgba(49,181,5,.5)";
	if(lastPiece!=null){
		lastPiece.style.background="transparent";
	}

	lastOrigin = fromPCellToOrigin(selectedPiece);
	let pinnedPoints;

	if(controlCheckByCords(x,y,team).length > 0){
		pinnedPoints = isPinnedPiece(x,y,piece,team);
	}

	switch(piece){
		case"bishop":
			showBishopMovements(x,y,team,false,false,false,pinnedPoints);	
			break;
		case"pawn":
			showPawnMovements(x,y,team,pinnedPoints);	
			break;
		case"knight":
			showKnightMovements(x,y,team,false,false,pinnedPoints);
			break;
		case"tower":
			showTowerMovements(x,y,team,false,false,false,pinnedPoints);
			break;
		case"queen":
			showQueenMovements(x,y,team,false,false,false,pinnedPoints);
			break;
		case "king":
			showKingMovements(x,y,team);
			break;


		default:
			console.log("ShowMoves : default");
			break;
	}

	if(!canShowMoves(x,y,team)){
		if(team == "white"){
			whiteStopPoints = findStopCheckPoints(fromPCellToCoords(whiteKing).x,fromPCellToCoords(whiteKing).y,team);
			hideImposibleDots("white");
		}else{
			//blackStopPoints = findStopCheckPoints(x,y,team);
			blackStopPoints = findStopCheckPoints(fromPCellToCoords(blackKing).x,fromPCellToCoords(blackKing).y,team);
			hideImposibleDots("black");
		}
		if(selectedPiece.getAttribute("piece")=="king"){
			showKingMovements(x,y,team);
		}
	}

}



//coloca las piezas (peones, torres, etc)
function setPieces(){
	//set pawns;

	for(let x = 0; x<=7;x++){
		createPiece(x,1,"pawn","white");
		
		getPCell(x,1).setAttribute("firstmove","true");

		createPiece(x,6,"pawn","black");
		getPCell(x,6).setAttribute("firstmove","true");

		if(x==0|| x==7){
			createPiece(x,0,"tower","white");
			getPCell(x,0).setAttribute("firstmove","true");
			createPiece(x,7,"tower","black");
			getPCell(x,7).setAttribute("firstmove","true");

		}else
		if(x==1|| x==6){
			createPiece(x,0,"bishop","white");
			createPiece(x,7,"bishop","black");
		}else
		if(x==2|| x==5){
			createPiece(x,0,"knight","white");
			createPiece(x,7,"knight","black");
		}else
		if(x==3){
			createPiece(x,0,"queen","white");
			createPiece(x,7,"queen","black");
		}else{
			createPiece(x,0,"king","white");
			getPCell(x,0).setAttribute("firstmove","true");
			createPiece(x,7,"king","black");
			getPCell(x,7).setAttribute("firstmove","true");

		}

	}

}

//establece el tamaño de los interfaces al coronar un peon, en funcion de cellSize;
function setPromoteFrames(){
	//whitePromoteFrame.style.width = cellSize+"px";
	//whitePromoteFrame.style.height= 4*cellSize+"px";
	whitePromoteFrame.style.width = cellSize+"px";
	whitePromoteFrame.style.height= 4*cellSize+"px";
	blackPromoteFrame.style.width = cellSize+"px";
	blackPromoteFrame.style.height= 4*cellSize+"px";
}


createTable();
Main.appendChild(Timer);
Main.style.width = ((cellSize + 2)*8)+350 + "px";



setPieces();


//DEVELOPEMENT;
/*createPiece(4,0,"king","white");
createPiece(4,7,"king","black");
createPiece(0,6,"pawn","white");

createPiece(3,0,"tower","white");
createPiece(5,0,"tower","white");
createPiece(2,1,"queen","white");
*/
setPromoteFrames();

//whiteKing = getPCell(2,1);//modificar luego
whiteKing = getPCell(4,0);
//blackKing = getPCell(7,7);//modificar luego
blackKing = getPCell(4,7);

