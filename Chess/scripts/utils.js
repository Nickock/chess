const whiteKingSrc = "./img/wKing.png";
const whiteQueenSrc = "./img/wQueen.png";
const whiteTowerSrc = "./img/wTower.png";
const whiteKnightSrc = "./img/wKnight.png";
const whiteBishopSrc = "./img/wBishop.png";
const whitePawnSrc = "./img/wPawn.png";

const blackKingSrc ="./img/bKing.png";
const blackQueenSrc ="./img/bQueen.png";
const blackTowerSrc ="./img/bTower.png";
const blackKnightSrc ="./img/bKnight.png";
const blackBishopSrc ="./img/bBishop.png";
const blackPawnSrc ="./img/bPawn.png";
const notationFrame = document.getElementById("NotationFrame");
const letters = ['a','b','c','d','e','f','g','h'];

//retorna el src correspondiente a la imagen de la pieza "piece" y el equipo "team"
function fromPieceToSrc(piece,team){

	let str = piece+"_"+team;

	switch(str){
		case"pawn_white":
			return whitePawnSrc;
		case"knight_white":
			return whiteKnightSrc;
		case"bishop_white":
			return whiteBishopSrc;
		case"tower_white":
			return whiteTowerSrc;
		case"queen_white":
			return whiteQueenSrc;
		case"king_white":
			return whiteKingSrc;

		case"pawn_black":
			return blackPawnSrc;
		case"knight_black":
			return blackKnightSrc;
		case"bishop_black":
			return blackBishopSrc;
		case"tower_black":
			return blackTowerSrc;
		case"queen_black":
			return blackQueenSrc;
		case"king_black":
			return blackKingSrc;

		default: return "";
	}
}
//POSTCONDICION: retorna '' si no es una pieza o equipo válido;


function notation(origin,destination){
	let res = origin+" x " + destination;

	let p = document.createElement("p");
	p.className = "notationLine";
	p.innerHTML = res;
	notationFrame.appendChild(p);
}


function fromPieceToNotation(piece){
	switch(piece){
		case"pawn":
			return 'P';
		case"bishop":
			return 'B';
		case"knight":
			return 'K';
		case"tower":
			return 'T';

		case"king":
			return 'K';
		
		case"queen":
			return 'Q';
		
		default:
			return '';
	}
}


function fromPCellToOrigin(pCell){

	let origin;
	let pCellId = pCell.id.split('_');
	origin = fromPieceToNotation(pCell.getAttribute("piece"));
	origin += letters[parseInt(pCellId[1])]+ (parseInt(pCellId[2])+1);

	return origin;
}


function fromPCellToDestination(pCell){

	let destination;
	let pCellId = pCell.id.split('_');
	destination = letters[parseInt(pCellId[1])]+ (parseInt(pCellId[2])+1);

	return destination;
}	


function fromPCellToCoords(pCell){

	let pCellId = pCell.id.split('_');
	let x = destination = parseInt(pCellId[1]);
	let y = destination = parseInt(pCellId[2]);

	return {x:x,y:y};
}




function rotateTable(){
	let rotation;
	if(tableRot){
		rotation = 0;
	}else{
		rotation = 180;
	}
	tableRot = !tableRot;

	Main.firstChild.style.transform = "rotate("+rotation+"deg)";

	for(let x = 0 ; x<=7 ; x++){
		for(let y = 0 ; y<=7 ; y++){
			getCell(x,y).style.transform = "rotate("+rotation+"deg)";			
		}
	}
}


function updateAutoRotation(){
	let span = document.getElementById("AutoRot_txt");
	automaticRotation = !automaticRotation;
	let txt = "Rotación automática : ";

	if(automaticRotation){
		txt +="ON";
	}else{
		txt+="OFF";
	}
	span.innerHTML = txt;
}