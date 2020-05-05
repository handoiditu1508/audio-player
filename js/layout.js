let inputId = "audioInput";
let playerId = "player";
let listId = "playList";
let playingElement = null;
let playOrder = [];
let playOrderIndex = null;

function getInputAudios() {
	let input = document.getElementById(inputId);
	return input.files;
}

function getPlayer() {
	return document.getElementById(playerId);
}

function getList() {
	return document.getElementById(listId);
}

function play(index) {
	let files = getInputAudios();

	// FileReader support
	if (FileReader && files && files.length > index) {
		let fr = new FileReader();
		let player = getPlayer();
		fr.onload = function () {
			player.src = fr.result;
			player.play();
		}
		fr.readAsDataURL(files[index]);
	}
}

function handleListItemClickEvent(element){
	let index = element.getAttribute("index");
	play(index);
	element.classList.add("playing");
	if(playingElement)
		playingElement.classList.remove("playing");
	playingElement = element;
	playOrderIndex = playOrder.indexOf(parseInt(index));
}

document.getElementById(inputId).addEventListener("change", function (evt) {
	let tgt = evt.target || window.event.srcElement,
		files = tgt.files;

	let firstPlayIndex = 0;
	// FileReader support
	if (FileReader && files && files.length) {
		let fr = new FileReader();
		fr.onload = function () {
			getPlayer().src = fr.result;
		}
		fr.readAsDataURL(files[firstPlayIndex]);

		playOrder = Array.from(Array(files.length).keys());//[0,1,2,3,n]
		playOrderIndex = playOrder.indexOf(firstPlayIndex);
	}
	// Not supported
	else {
		alert("Not supported");
		return;
	}

	let list = getList();
	//clear list
	list.innerHTML = "";
	//load list
	let listItems = document.createElement("DIV");

	for (i = 0; i < files.length; i++) {
		let listItem = document.createElement("LI");
		listItem.classList.add("media-list-item");
		listItem.setAttribute("index", i);

		let name = files[i].name;
		name = name.substring(0, name.lastIndexOf("."));
		listItem.innerHTML = name;
		listItem.setAttribute("onmouseup", "handleListItemClickEvent(this)");

		listItems.appendChild(listItem);
	}
	list.innerHTML = listItems.innerHTML;
});

getPlayer().addEventListener("ended", function(event){
	if(playOrder.length > playOrderIndex + 1){
		play(playOrder[++playOrderIndex]);
		//let element = document.getE
	}
});