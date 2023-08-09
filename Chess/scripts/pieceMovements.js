//PRECOND : valid direcction(dirx,diry): (dirx == -1,0,1 && diry==-1,0,1 && dirx!=diry!=0)
//Ambas muestran 'dots' en todas las casillas pertenecientes a la direccion.
//si hideDots == true, se muestran los 'dots', pero si se añaden las posiciones al array al que siempre retornan;
//si IgnorePieces == true, ignora la pieza de su propio equipo y calcula mas hallá, de lo contrario para antes
//y no añade la casilla de su team al array; 
function showDirectionMovements(x,y,dirx,diry,team,hideDots,IgnorePieces, pinnedPoints){
	var positions = [];

		for(let i = 1 ; i<=7;i++){
			//si es una coordenada valida;
			if(isValidCoords(x+(dirx*i),y+(diry*i))){
				//si esta vacia agregala;
				if(isEmpty(x+(dirx*i),y+(diry*i))){
					if(!hideDots){
						showDot(x+(dirx*i),y+(diry*i));
					}
					positions.push({x:x+(dirx*i),y:y+(diry*i)});
				}//si es del mismo equipo para;
				else if(getTeam(x+(dirx*i),y+(diry*i)) == team){
					if(!IgnorePieces){
						break;
					}
				}else{
					if(!hideDots){
						showDot(x+(dirx*i),y+(diry*i));
					}
					positions.push({x:x+(dirx*i),y:y+(diry*i)});
					break;
				}
			}else{
				break;
			}
		}




	return positions;
}

function showMovementTo(x,y,xOffset,yOffset,team,hideDots){
	let positions = [];
	if(isValidCoords(x+xOffset,y+yOffset)){
		if(isEmpty(x+xOffset,y+yOffset) || (getTeam(x+xOffset,y+yOffset)!= team)){
			if(!hideDots){
				showDot(x+xOffset,y+yOffset);
			}
			positions.push({x:x+xOffset,y:y+yOffset});
		}
	}
	return positions;
}

//show 'piece'Movements(x,y,team, .....) 
//Todas hacen visible los 'dots' en las celdas a las cuales es valido mover 'piece'.
//a su vez manejan mecanicas como: coronacion, enroque,y jaques. 
//OBS : (no evita mover una pieza si el rey esta en jaque)
function showPawnMovements(x,y,team,pinnedPoints,returnArray){

	let canEat= true;
	let positions = [];

	if(pinnedPoints!=null && pinnedPoints.length>0){
		canEat = false;
	}
	let dir = (team == "white")?1:-1;

	if(isValidCoords(x,y+dir) && isEmpty(x,y+dir)){
		showDot(x,y+dir);
		positions.push({x:x,y:y+dir});
			if(getPCell(x,y).getAttribute("firstmove") == "true" && isEmpty(x,y+(2*dir))){
			//primer movimiento del peon;
			showDot(x,y+(2*dir));
			positions.push({x:x,y:y+(2*dir)});
		}
	}

	if(isValidCoords(x+1,y+dir) && !isEmpty(x+1,y+dir) && getTeam(x+1,y+dir)!= team && canEat){
		//puede comer;
		showDot(x+1,y+dir);
		positions.push({x:x+1,y:y+dir});
	}

	if(isValidCoords(x-1,y+dir) && !isEmpty(x-1,y+dir) && getTeam(x-1,y+dir)!= team && canEat){
		//puede comer;
		showDot(x-1,y+dir);
		positions.push({x:x-1,y:y+dir});
	}
	

	if(	canEat &&
		isValidCoords(x+1,y) && 
		getPiece(x+1,y)=="pawn" &&
		getTeam(x+1,y)!= team &&
		getPCell(x+1,y).getAttribute("specialMove")=="true"&&
		getPCell(x+1,y).getAttribute("firstmove")!="false"

	){
		//Puede comer al paso a la derecha;
		showDot(x+1,y+dir);
		positions.push({x:x+1,y:y+dir});
	}

	if(	canEat &&
		isValidCoords(x-1,y) && 
		getPiece(x-1,y)=="pawn" &&
		getTeam(x-1,y)!= team &&
		getPCell(x-1,y).getAttribute("specialMove")=="true"&&
		getPCell(x-1,y).getAttribute("firstmove")!="false"

	){
		//Puede comer al paso a la izquierda;
		showDot(x-1,y+dir);
		positions.push({x:x-1,y:y+dir});
	}

	if(returnArray){
		return positions;
	}

}

function showBishopMovements(x,y,team,returnArray,hideDots,ignoreEnemyTeam,pinnedPoints){
	
	var positions,dirTR,dirBR,dirBL,dirTL;
	
	dirTR = showDirectionMovements(x,y,1,1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirBR = showDirectionMovements(x,y,1,-1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirBL = showDirectionMovements(x,y,-1,-1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirTL = showDirectionMovements(x,y,-1,1,team,hideDots,ignoreEnemyTeam,pinnedPoints);

	positions = dirTR.concat(dirBR);
	positions = positions.concat(dirBL);
	positions = positions.concat(dirTL);
	
	validPosWhenPinned(x,y,team,pinnedPoints,positions);
	
	if(returnArray){
		return positions;
	}
}

function showKnightMovements(x,y,team,returnArray,hideDots,pinnedPoints){

	let positions = [];


	positions = positions.concat(showMovementTo(x,y,1,2,team,hideDots));
	positions = positions.concat(showMovementTo(x,y,1,-2,team,hideDots));
	positions = positions.concat(showMovementTo(x,y,2,1,team,hideDots));
	positions = positions.concat(showMovementTo(x,y,2,-1,team,hideDots));
	positions = positions.concat(showMovementTo(x,y,-1,2,team,hideDots));
	positions = positions.concat(showMovementTo(x,y,-1,-2,team,hideDots));
	positions = positions.concat(showMovementTo(x,y,-2,1,team,hideDots));
	positions = positions.concat(showMovementTo(x,y,-2,-1,team,hideDots));

	validPosWhenPinned(x,y,team,pinnedPoints,positions);


	if(returnArray){
		return positions;
	}
}

function showTowerMovements(x,y,team,returnArray,hideDots,ignoreEnemyTeam,pinnedPoints){
	var positions,dirT,dirB,dirL,dirR;

	dirT = showDirectionMovements(x,y,0,1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirR = showDirectionMovements(x,y,1,0,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirL = showDirectionMovements(x,y,0,-1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirB = showDirectionMovements(x,y,-1,0,team,hideDots,ignoreEnemyTeam,pinnedPoints);

	positions = dirT.concat(dirR);
	positions = positions.concat(dirB);
	positions = positions.concat(dirL);
	

	validPosWhenPinned(x,y,team,pinnedPoints,positions);

	if(returnArray){
		return positions;
	}
}

function showQueenMovements(x,y,team,returnArray,hideDots,ignoreEnemyTeam,pinnedPoints){
	var positions,dirT,dirB,dirR,dirL,dirTR,dirBR,dirBL,dirTL;

	//diagonales
	dirTR = showDirectionMovements(x,y,1,1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirBR = showDirectionMovements(x,y,1,-1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirBL = showDirectionMovements(x,y,-1,-1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirTL = showDirectionMovements(x,y,-1,1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	//rectas;
	dirT = showDirectionMovements(x,y,0,1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirR = showDirectionMovements(x,y,1,0,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirB = showDirectionMovements(x,y,0,-1,team,hideDots,ignoreEnemyTeam,pinnedPoints);
	dirL = showDirectionMovements(x,y,-1,0,team,hideDots,ignoreEnemyTeam,pinnedPoints);

	positions = dirTR.concat(dirBR);
	positions = positions.concat(dirBL);
	positions = positions.concat(dirTL);
	positions = positions.concat(dirT);
	positions = positions.concat(dirR);
	positions = positions.concat(dirB);
	positions = positions.concat(dirL);
	

	validPosWhenPinned(x,y,team,pinnedPoints,positions);


	if(returnArray){
		return positions;
	}
}

function validPosWhenPinned(x,y,team,pinnedPoints,positions){
	if(pinnedPoints!= null && pinnedPoints.length>0){
		clearDots();
		positions.forEach(pos=>{
			if((pos.x == pinnedPoints[0].x && pos.y == pinnedPoints[0].y)){
				let pinDir = getDirection(x,y,pinnedPoints[0].x,pinnedPoints[0].y);
				let i = 1;
				while(isValidCoords(x+(pinDir.x*i),y+(pinDir.y*i))){
					showDot(x+(pinDir.x*i),y+(pinDir.y*i));
					if(getPiece(x+(pinDir.x*i),y+(pinDir.y*i))!="none"){
						break;
					}
					i++;
				}
				i=-1;
				while(isValidCoords(x+(pinDir.x*i),y+(pinDir.y*i)) && getTeam(x+(pinDir.x*i),y+(pinDir.y*i))!= team){
					showDot(x+(pinDir.x*i),y+(pinDir.y*i));
					if(getPiece(x+(pinDir.x*i),y+(pinDir.y*i))!="none"){
						break;
					}
					i--;
				}
			}
		});
	}
}


function showKingMovements(x,y,team){

	let pos = [];
	let TR,R,BR,B,BL,L,LT,T;	
	let aux;

	TR = showMovementTo(x,y,1,1,team,true);
	aux = controlCheckByCords(x+1,y+1,team);
	if(aux.length == 0){
		pos = pos.concat(TR);
	}
	R = showMovementTo(x,y,1,0,team,true);
	aux = controlCheckByCords(x+1,y,team);
	if(aux.length == 0){
		pos = pos.concat(R);
	}
	BR = showMovementTo(x,y,1,-1,team,true);
	aux = controlCheckByCords(x+1,y-1,team);
	if(aux.length == 0){
		pos = pos.concat(BR);
	}
	B = showMovementTo(x,y,0,-1,team,true);
	aux = controlCheckByCords(x,y-1,team);
	if(aux.length == 0){
		pos = pos.concat(B);
	}
	BL = showMovementTo(x,y,-1,-1,team,true);
	aux = controlCheckByCords(x-1,y-1,team);
	if(aux.length == 0){
		pos = pos.concat(BL);
	}
	L = showMovementTo(x,y,-1,0,team,true);
	aux = controlCheckByCords(x-1,y,team);
	if(aux.length == 0){
		pos = pos.concat(L);
	}
	TL = showMovementTo(x,y,-1,1,team,true);
	aux = controlCheckByCords(x-1,y+1,team);
	if(aux.length == 0){
		pos = pos.concat(TL);
	}
	T = showMovementTo(x,y,0,1,team,true);
	aux = controlCheckByCords(x,y+1,team);
	if(aux.length == 0){
		pos = pos.concat(T);
	}

	pos.forEach(elem =>{
		showDot(elem.x,elem.y);
	});


	if(isLargeCastle(team)){
		showDot(2,y);
	}
	if(isShortCastle(team)){
		showDot(6,y);
	}


	return pos;
}
//crea una copia de la pieza seleccionada en (x,y) y borra la original;
//maneja varias mecanicas
//PRECOND : isValidCoords(x,y);
function movePiece(x,y){

	for(let i = 0 ;i<=7 ; i++){
		if(selectedPiece.getAttribute("team") == "white"){
			getPCell(i,4).setAttribute("specialMove","false");
		}else{
			getPCell(i,3).setAttribute("specialMove","false");
		}
	}

	//coronar peon
	if(y == 0 || y== 7){
		if(selectedPiece.getAttribute("piece")=="pawn"){
			selectedPiece.setAttribute("firstmove","false");
			if(selectedPiece.getAttribute("team")=="white"){
				//guardar coordenadas para coronar peon blanco;
				promoteCoords = {x:x,y:7};
				showPromoteFrame(x,7,"white");				
			}else{
				//guardar coordenadas para coronar peon negro;				
				promoteCoords = {x:x,y:0};				
				showPromoteFrame(x,0,"black");				
			}
		}
	}
	//movimiento doble peon negro;
	if(	y == 4 && 
		selectedPiece.getAttribute("piece")=="pawn" &&
		selectedPiece.getAttribute("team")=="black" &&
		selectedPiece.getAttribute("firstmove")=="true" 
	 ){
		getPCell(x,y).setAttribute("specialMove","true");
	}else
	//movimiento doble peon negro;
	if(
		y == 3 && 
		selectedPiece.getAttribute("piece")=="pawn" &&
		selectedPiece.getAttribute("team")=="white" &&
		selectedPiece.getAttribute("firstmove")=="true" 
	 ){
		getPCell(x,y).setAttribute("specialMove","true");
	}

	//comer Peon Al Paso whiteTeam
	if(y==5 && selectedPiece.getAttribute("piece")=="pawn" && getPiece(x,y-1)=="pawn" && getTeam(x,y-1)!="white"){
		let deletepawn = getPCell(x,y-1);
		deletepawn.setAttribute("piece","none");
		deletepawn.setAttribute("team","none");
		deletepawn.firstChild.remove();
	}

	//comer Peon Al Paso blackTeam
	if(y==2 && selectedPiece.getAttribute("piece")=="pawn" && getPiece(x,y+1)=="pawn" && getTeam(x,y+1)!="black"){
		let deletepawn = getPCell(x,y+1);
		deletepawn.setAttribute("piece","none");
		deletepawn.setAttribute("team","none");
		deletepawn.firstChild.remove();
	}

	
	//enroque largo;
	if(x==2 && (y==0 || y==7) && selectedPiece.getAttribute("piece") == "king" && 
		isLargeCastle(selectedPiece.getAttribute("team")) )
	{
		//crea la nueva torre
		createPiece(3,y,"tower",selectedPiece.getAttribute("team"));
		//elimina la vieja torre
		let oldTower = getPCell(0,y);
		oldTower.setAttribute("team","none");
		oldTower.setAttribute("piece","none");
		oldTower.setAttribute("firstmove","false");
		oldTower.firstChild.remove();
		selectedPiece.setAttribute("firstmove","false");

	}else //enroque corto;
	if(x==6 && (y==0 || y==7) && selectedPiece.getAttribute("piece") == "king" 
		&& isShortCastle(selectedPiece.getAttribute("team")))
	{
		//crea la nueva torre:
		createPiece(5,y,"tower",selectedPiece.getAttribute("team"));
		//elimina la vieja torre
		let oldTower = getPCell(7,y);
		oldTower.setAttribute("team","none");
		oldTower.setAttribute("piece","none");
		oldTower.setAttribute("firstmove","false");
		oldTower.firstChild.remove();
		selectedPiece.setAttribute("firstmove","false");

	}
	let selectedPieceAtt =selectedPiece.getAttribute("piece"); 
	if(selectedPieceAtt == "pawn" ||selectedPieceAtt == "king" || selectedPieceAtt == "tower"){
		selectedPiece.setAttribute("firstmove","false");
	}

	//elimina la pieza en la casilla destino (x,y)
	let cell = getPCell(x,y);

	// escribir notacion notacion
	notation(lastOrigin,fromPCellToDestination(cell));

	if(cell.childElementCount>0){
		//Esta cell ya tiene una pieza => eliminarla;
		cell.childNodes[0].remove();
	}
	
	let piece = selectedPiece.getAttribute("piece");
	let team = selectedPiece.getAttribute("team");

	//crear la nueva pieza en (x,y)
	createPiece(x,y,piece,team);

	//borra la pieza original;
	selectedPiece.firstChild.remove();
	selectedPiece.setAttribute("piece","none");
	selectedPiece.setAttribute("team","none");
	

	//Actualizar variable que guarda al rey	

	if(piece =="king"){
		if(team == "white"){
			whiteKing = getPCell(x,y);
		}else{
			blackKing = getPCell(x,y);
		}
	}


	//controlar jaques al rey;
	let blackKingCoords = fromPCellToCoords(blackKing);
	controlCheckByCords(blackKingCoords.x,blackKingCoords.y,"black",true,false,false,true);
	let whiteKingCoords = fromPCellToCoords(whiteKing);
	controlCheckByCords(whiteKingCoords.x,whiteKingCoords.y,"white",true,false,false,true);

	clearDots();

	if(automaticRotation){
		rotateTable();
	}
	
	//control mate o ahogado;
	if(whiteTurn){
		isMateOrDrown(blackKingCoords.x,blackKingCoords.y,"black");
	}else{
		isMateOrDrown(whiteKingCoords.x,whiteKingCoords.y,"white");
	}
	
	//cambiar de turno
	whiteTurn = !whiteTurn;
	//actualizar timer;
	countWhite = whiteTurn;
	countBlack = !whiteTurn;
}


//hace un control de jaques del team enemigo a la casilla de coordenadas (x,y)
//retorna array con dichos ataques;
//PRECOND x,y,team validos , showCheck,noIgnorePieces,paintCell boleanos;
function controlCheckByCords(x,y,team,showCheck,noIgnorePieces,paintCell,calcMate){

	let attacks = [];
	let enemyTeam = (team)=="white"?"black":"white";
	if(paintCell){
		getPCell(x,y).style.background="lime";
	}

	showBishopMovements(x,y,team,true,true,noIgnorePieces,[]).forEach(elem=>{
		if(paintCell){getPCell(elem.x,elem.y).style.background="yellow";}
		if(getTeam(elem.x,elem.y)!= team &&
		  (getPiece(elem.x,elem.y)=="bishop" || getPiece(elem.x,elem.y)=="queen")){
			
			//elem es un alfil o dama atacando al rey;
			attacks.push(elem);
		}
	});

	showTowerMovements(x,y,team,true,true,noIgnorePieces,[]).forEach(elem=>{
		if(paintCell)getPCell(elem.x,elem.y).style.background="darkred";
		if(getTeam(elem.x,elem.y)!= team &&
		  (getPiece(elem.x,elem.y)=="tower" || getPiece(elem.x,elem.y)=="queen")){
			
			//elem es una torre o dama atacando al rey;
			attacks.push(elem);
		}
	});


	showKnightMovements(x,y,team,true,true,noIgnorePieces,[]).forEach(elem=>{
		if(paintCell)getPCell(elem.x,elem.y).style.background="purple";

		if(getTeam(elem.x,elem.y)!= team && getPiece(elem.x,elem.y)=="knight"){
			
			//elem es caballo atacando al rey;
			attacks.push(elem);
		}
	});


	//jaques de peones?
	let dir = -1;
	if(team == "black"){
		dir = 1;
	}


	if(getPiece(x+1,y-dir) =="pawn" && getTeam(x+1,y-dir) != team){
		attacks.push({x:(x+1),y:(y-dir)});
	}
	if(getPiece(x-1,y-dir) =="pawn" && getTeam(x-1,y-dir) != team){
		attacks.push({x:(x-1),y:(y-dir)});
	}

	if(showCheck){
		let King = getPCell(x,y);
		King.firstChild.firstChild.style.boxShadow = "";
		if(attacks.length>0){
			King.firstChild.firstChild.style.boxShadow = "inset 0 0 "+15*attacks.length+"px 5px #B50000";
		}
	}

	return attacks;

}

//PRECOND isValidCoords(x,y);
function isFirstMove(x,y){
	if(getPiece(x,y)=="king"||getPiece(x,y)=="tower"||getPiece(x,y)=="pawn"){
		return getPCell(x,y).getAttribute("firstmove") == "true";
	}
	return false;
}
//precond team=="white" || team == "black"
function isLargeCastle(team){
	let y = 0;
	let castle = (whiteKing.getAttribute("firstmove")=="true");
	let kingCords;
	kingCords = fromPCellToCoords(whiteKing);

	if(team =="black"){
		y = 7;
		castle = (blackKing.getAttribute("firstmove")=="true");
		kingCords = fromPCellToCoords(blackKing);
	}
	

	//si estas en jaque, no podes enrocar;
	if(controlCheckByCords(kingCords.x,kingCords.y,team,true).length>0){
		return false;
	}

	//si la torre izquierda fue movida;
	if(!isFirstMove(0,y)){
		return false;
	}else //si alguna casilla en el camino no esta vacia
	 if(!(isEmpty(1,y)&&isEmpty(2,y)&&isEmpty(3,y))){

		return false;
	}

	//controla si en el camino hay jaques
	let attacks = [];
	attacks = attacks.concat(controlCheckByCords(1,y,team,false,false,false));
	attacks = attacks.concat(controlCheckByCords(2,y,team,false,false,false));
	attacks = attacks.concat(controlCheckByCords(3,y,team,false,false,false));

	if(attacks.length>0){
		return false;
	}

	//falta colocar que no este en jaque;

	return castle;
}
//precond team=="white" || team == "black"
function isShortCastle(team){
	let y = 0;
	let castle = (whiteKing.getAttribute("firstmove")=="true");
	let kingCords;
	kingCords = fromPCellToCoords(whiteKing);

	if(team =="black"){
		y = 7;
		castle = (blackKing.getAttribute("firstmove")=="true");
		kingCords = fromPCellToCoords(blackKing);
	}
	

	//si estas en jaque, no podes enrocar;
	if(controlCheckByCords(kingCords.x,kingCords.y,team,true).length>0){
		return false;
	}

	//si la torre izquierda fue movida;
	if(!isFirstMove(7,y)){
		return false;
	}else //si alguna casilla en el camino no esta vacia
	 if(!(isEmpty(5,y)&&isEmpty(6,y))){
		return false;
	}


	//controla si en el camino hay jaques
	let attacks = [];
	attacks = attacks.concat(controlCheckByCords(6,y,team,false,false,false));
	attacks = attacks.concat(controlCheckByCords(5,y,team,false,false,false));

	if(attacks.length>0){
		return false;
	}

	return castle;

}

//muestra el cuadro de coronación del equipo 'team' en la posición x,y
function showPromoteFrame(x,y,team){

	let pCellPos = getPCell(x,y).getBoundingClientRect();
	let topPosition = pCellPos.top-3*(cellSize+4);
	let leftPosition = pCellPos.left;

	blackTableScreen.style.display="block";

	if(team=="white"){
		whitePromoteFrame.style.display ="block";
		whitePromoteFrame.style.top = 10 + "px";
		whitePromoteFrame.style.left = leftPosition + "px";
	}else{
		blackPromoteFrame.style.display ="block";
		blackPromoteFrame.style.top = topPosition + "px";
		blackPromoteFrame.style.left = leftPosition + "px";
		
	}

}

//oculta los cuadros de coronación
function hidePromoteFrames(){
	whitePromoteFrame.style.display ="none";
	blackPromoteFrame.style.display ="none";
	
	blackTableScreen.style.display ="none";
}

//elimina la pieza en el lugar de coronación
//crea una pieza nueva de tipo 'piece' y equipo 'team'
function promotePawn(piece,team){
	let x = promoteCoords.x;
	let y = promoteCoords.y;

	let pCell = getPCell(x,y);

	pCell.firstChild.remove();

	createPiece(x,y,piece,team);

	hidePromoteFrames();
	
	//controlar jaque luego de coronar;
	let blackKingCoords = fromPCellToCoords(blackKing);
	controlCheckByCords(blackKingCoords.x,blackKingCoords.y,"black",true);
	let whiteKingCoords = fromPCellToCoords(whiteKing);
	controlCheckByCords(whiteKingCoords.x,whiteKingCoords.y,"white",true);
}


function getDirection(x1,y1,x2,y2){
	let x;
	let y;
	if(x2-x1 == 0){
		x=0;
	}else{
		x = (x2-x1)/Math.abs(x2-x1);
	}
	if(y2-y1 == 0 ){
		y=0;
	}else{
		y = (y2-y1)/Math.abs(y2-y1);
	}

	if((Math.abs(x2-x1) == 1 && Math.abs(y2-y1) == 2) || (Math.abs(x2-x1) == 2 && Math.abs(y2-y1) == 1)){
		return {x:(x2-x1),y:(y2-y1)};
	}

	return {x:x,y:y};
}


function canShowMoves(x,y,team){

	let kingCoords;
	let kingChecks;

	if(team=="white"){
		kingCoords = fromPCellToCoords(whiteKing);
	}else{
		kingCoords = fromPCellToCoords(blackKing);
	}
	kingChecks = controlCheckByCords(kingCoords.x,kingCoords.y,team,true);


	return kingChecks.length == 0;

}



//retorna array con todas las casillas en la direccion (xdir,ydir) que esten vacias o sean del equipo enemigo;
//para de buscar al encontrar una pieza enemiga (esta va incluida en el array)
function findWayByDir(x,y,dirx,diry,team){
	let i = 1;
	let way=[];
	while(i<7 && isValidCoords(x+(i*dirx),y+(i*diry)) && getTeam(x+(i*dirx),y+(i*diry))!= team){
		way.push({x:x+(i*dirx),y:y+(i*diry)});
		i++;
		if(getPiece(x+((i-1)*dirx),y+((i-1)*diry))!= "none"){
			break;
		}
	}

	return way;
}


//Busca todas las casillas posibles para parar el jaque;

function findStopCheckPoints(x,y,team){
	let kingCoords;
	let kingChecks;
	let stopPoints = [];
	
	if(team=="white"){
		kingCoords = fromPCellToCoords(whiteKing);
	}else{
		kingCoords = fromPCellToCoords(blackKing);
	}


	kingChecks = controlCheckByCords(kingCoords.x,kingCoords.y,team);


	//calcula para diagonales y rectas;
	kingChecks.forEach(check=>{
		let dir = getDirection(x,y,check.x,check.y);
		if(( Math.abs(dir.x) == 2 || Math.abs(dir.y)==2)){
			stopPoints.push({x:x+dir.x,y:y+dir.y});
		}else{
			stopPoints = stopPoints.concat(findWayByDir(x,y,dir.x,dir.y,team));
		}
	});




	return stopPoints;
}


//retorna las coordenadas de las piezas enemigas que estan clavando a la piece-team de (x,y)
function isPinnedPiece(x,y,piece,team){
	
	let isPinnedBy = [];
	let pCell;
	let kingCords;

	if(team == "white"){
		kingCords = fromPCellToCoords(whiteKing);
	}else{
		kingCords = fromPCellToCoords(blackKing);
	}

	if(piece == "king"){
		return isPinnedBy;
	}

	pCell = getPCell(x,y);
	pCell.setAttribute("piece","none");
	pCell.setAttribute("team","none");

	let checks = controlCheckByCords(kingCords.x,kingCords.y,team);

	checks.forEach(check=>{
		let dir = getDirection(check.x,check.y,kingCords.x,kingCords.y);
		let i = 1 ;
		while(isValidCoords(check.x+(dir.x*i),check.y+(dir.y*i))){

			if(check.x+(dir.x*i) == x && check.y+(dir.y*i)== y){
				isPinnedBy.push({x:check.x,y:check.y});
				break;
			}
			i++;
		}

	});


	pCell.setAttribute("piece",piece);
	pCell.setAttribute("team",team);


	return isPinnedBy;
}


//(x,y) == coordenadas del rey;
function isMateOrDrown(x,y,team){
	let coordsToStopMate = findStopCheckPoints(x,y,team);

	let validMovements = 0;

	for(let i = 0 ; i<= 7;i++){
		for(let j = 0 ; j<= 7;j++){
			if(!isEmpty(i,j)&& getTeam(i,j)== team){
				let piece = getPiece(i,j);
				let n = 0;
				if(coordsToStopMate.length>0){
					while(n<coordsToStopMate.length){
						if(isMovementOf(i,j,piece,team,coordsToStopMate[n].x,coordsToStopMate[n].y) && piece!= "king"){
							return false;
						}
						n++;
					}				
				}else{
					
					//no hay jaque;
					switch(piece){
						case"king":
						break;
						case "tower":
							validMovements+=showTowerMovements(i,j,team,true).length;
							break;
						case "bishop":
							validMovements+=showBishopMovements(i,j,team,true).length;
							break;
						case "knight":
							validMovements+=showKnightMovements(i,j,team,true).length;
							break;
						case "queen":
							validMovements+=showQueenMovements(i,j,team,true).length;
							break;
							
						default:
							validMovements+=showPawnMovements(i,j,team,false,true).length;
							break;
					}
				}

			}
		}

	}


	//"borro" el rey, calculo si hay movimientos para el mismo, y lo vuelvo a "recolocar";
	getPCell(x,y).setAttribute("piece","none");
	getPCell(x,y).setAttribute("team","none");

	let kingMovs = showKingMovements(x,y,team).length;

	getPCell(x,y).setAttribute("piece","king");
	getPCell(x,y).setAttribute("team",team);

	clearDots();


	validMovements+=kingMovs;


	if(validMovements == 0){
		if(controlCheckByCords(x,y,team).length>0){
			//JAQUE MATE;
			let msg = (team != "white")?"blancas":"negras";
			gameOver("Las "+msg+" ganan : jaque mate");
			return true;
		}else{
			//AHOGADO;

			let msg = (team == "white")?"blancas":"negras";
			gameOver("Empate, las "+msg+" no tienen movimientos válidos");
			return true;
		}
	}

	return false;
}


//retorna true sii (xf,yf) es una casilla valida para mover la piece-team de la casilla (x,y)
function isMovementOf(x,y,piece,team,xf,yf){

	let isMov = false;


	if(isPinnedPiece(x,y,piece,team).length >0){
		return false;
	}


	if(piece =="tower"){
		//calc para torre;
		let T =  isMovementOfByDir(x,y,team,xf,yf,0,1);
		let R =  isMovementOfByDir(x,y,team,xf,yf,1,0);
		let B =  isMovementOfByDir(x,y,team,xf,yf,0,-1);
		let L =  isMovementOfByDir(x,y,team,xf,yf,-1,0);

	isMov = T||R||B||L;

	}else if(piece =="bishop"){
		//calc para bishop

		let TR =  isMovementOfByDir(x,y,team,xf,yf,1,1);
		let BR =  isMovementOfByDir(x,y,team,xf,yf,1,-1);
		let BL =  isMovementOfByDir(x,y,team,xf,yf,-1,-1);
		let TL =  isMovementOfByDir(x,y,team,xf,yf,-1,1);

	isMov = TR||BR||BL||TL;

	}else if(piece == "queen"){
		let T =  isMovementOfByDir(x,y,team,xf,yf,0,1);
		let R =  isMovementOfByDir(x,y,team,xf,yf,1,0);
		let B =  isMovementOfByDir(x,y,team,xf,yf,0,-1);
		let L =  isMovementOfByDir(x,y,team,xf,yf,-1,0);
		let TR =  isMovementOfByDir(x,y,team,xf,yf,1,1);
		let BR =  isMovementOfByDir(x,y,team,xf,yf,1,-1);
		let BL =  isMovementOfByDir(x,y,team,xf,yf,-1,-1);
		let TL =  isMovementOfByDir(x,y,team,xf,yf,-1,1);

		isMov = T||R||B||L||TR||BR||BL||TL;

	}else if(piece =="knight"){

		//calc para knight
		if(isValidCoords(x+1,y+2) && xf == (x+1) && yf == (y+2)){
			if(getTeam(x+1,y+2)!=team){
				isMov = true;
			}
		}
		if(isValidCoords(x+1,y-2) && xf == (x+1) && yf == (y-2)){
			if(getTeam(x+1,y-2)!=team){
				isMov = true;
			}
		}
		if(isValidCoords(x-1,y+2) && xf == (x-1) && yf == (y+2)){
			if(getTeam(x-1,y+2)!=team){
				isMov = true;
			}
		}
		if(isValidCoords(x-1,y-2) && xf == (x-1) && yf == (y-2)){
			if(getTeam(x-1,y-2)!=team){
				isMov = true;
			}
		}

		if(isValidCoords(x+2,y+1) && xf == (x+2) && yf == (y+1)){
			if(getTeam(x+2,y+1)!=team){
				isMov = true;
			}
		}
		if(isValidCoords(x+2,y-1) && xf == (x+2) && yf == (y-1)){
			if(getTeam(x+2,y-1)!=team){
				isMov = true;
			}
		}
		if(isValidCoords(x-2,y+1) && xf == (x-2) && yf == (y+1)){
			if(getTeam(x-2,y+1)!=team){
				isMov = true;
			}
		}
		if(isValidCoords(x-2,y-1) && xf == (x-2) && yf == (y-1)){
			if(getTeam(x-2,y-1)!=team){
				isMov = true;
			}
		}

	}else if(piece =="pawn"){
		//calc para pawn
		let dir = (team=="white")? 1:-1;
		if(isEmpty(xf,yf)){
			if(xf==x && yf == (y+dir)){
				isMov = true;
			}
		}else if(xf == x+1 && yf == (y+dir)){
			if(getTeam(x+1,y+dir)!=team){
				isMov = true;
			}
		}else if(xf == x-1 && yf == (y+dir)){
			if(getTeam(x-1,y+dir)!=team){
				isMov = true;
			}
		}

	}else{
		//calc para king
		let availableCells = 0;
		for(let i = -1 ; i<=1 ;i++){
			for(let j = -1 ; j<=1 ;j++){
				if(!(i==0 && j==0) && isValidCoords(x+i,y+j)){
					let checksOnCell = controlCheckByCords(x+i,y+j,team);
					if(checksOnCell.length==0){
						if(isEmpty(x+i,y+j)||getTeam(x+i,y+j)!= team){
							if(!controlCheckByCords(x+i,y+j,team,false,true).length>0){
								availableCells++;
							}
						}
					}
				}				
			}
		}
		isMov = (availableCells!=0);
	}

	return isMov;
}


function isMovementOfByDir(x,y,team,xf,yf,dirx,diry){
	//(x,y) pos inicial;
	//(xf,yf) pos final;
	//(dirx,diry) vector dirección;
	let i = 1;
	while(isValidCoords(x+(dirx*i),y+(diry*i)) && getTeam(x+(dirx*i),y+(diry*i)) != team){
		if(x+(dirx*i) == xf && y+(diry*i) == yf && (getPiece(x+(dirx*i),y+(diry*i))=="none" || getTeam(x+(dirx*i),y+(diry*i))!=team) ){
			return true;
		}
		i++;
	}
	return false;

}




