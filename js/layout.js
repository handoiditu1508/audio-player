let inputId = "audioInput";
let listElements = [];
let playOrder = [];
let playOrderIndex = null;
let isShuffled = false;

function getInputAudios() {
	let input = document.getElementById(inputId);
	return input.files;
}

function getPlayer() {
	return document.getElementById("player");
}

function getList() {
	return document.getElementById("playList");
}

function getPreviousBtn() {
	return document.getElementById("previousBtn");
}

function getNextBtn() {
	return document.getElementById("nextBtn");
}

function getShuffleBtn() {
	return document.getElementById("shuffleBtn");
}

function getUnshuffleBtn() {
	return document.getElementById("unshuffleBtn");
}

function getAutoPlayCheckBox() {
	return document.getElementById("autoPlay");
}

function setFileName(name) {
	document.getElementById("fileName").innerHTML = name;
	window.document.title = name;
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
			enableBtns();
		}
		fr.readAsDataURL(files[index]);
	}
}

function playNext() {
	playOrder[playOrderIndex].classList.remove("playing");
	if (playOrder.length > playOrderIndex + 1)
		playOrderIndex++;
	else playOrderIndex = 0;
	play(playOrder[playOrderIndex].getAttribute("index"));
	playOrder[playOrderIndex].classList.add("playing");
	setFileName(playOrder[playOrderIndex].innerHTML);
}

function playPrevious() {
	playOrder[playOrderIndex].classList.remove("playing");
	if (-1 < playOrderIndex - 1)
		playOrderIndex--;
	else playOrderIndex = playOrder.length - 1;
	play(playOrder[playOrderIndex].getAttribute("index"));
	playOrder[playOrderIndex].classList.add("playing");
	setFileName(playOrder[playOrderIndex].innerHTML);
}

function shuffleList() {
	for (let i = playOrder.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[playOrder[i], playOrder[j]] = [playOrder[j], playOrder[i]];//swap i j

		if (i == playOrderIndex)
			playOrderIndex = j;
		else if (j == playOrderIndex)
			playOrderIndex = i;
	}
	[playOrder[playOrderIndex], playOrder[0]] = [playOrder[0], playOrder[playOrderIndex]];//swap playOrderIndex 0
	playOrderIndex = 0;
	isShuffled = true;
}

function unshuffleList() {
	playOrderIndex = parseInt(playOrder[playOrderIndex].getAttribute("index"));
	playOrder = [...listElements];
	isShuffled = false;
}

getNextBtn().addEventListener("mouseup", () => {
	disableBtns();
	if(listElements.length){
		playNext();
	}
});

getPreviousBtn().addEventListener("mouseup", () => {
	disableBtns();
	if(listElements.length){
		playPrevious();
	}
});

getShuffleBtn().addEventListener("mouseup", (event) => {
	disableBtns();
	if(listElements.length){
		shuffleList();
		event.target.innerHTML = "Reshuffle";
	}
	enableBtns();
});

getUnshuffleBtn().addEventListener("mouseup", () => {
	disableBtns();
	if(listElements.length){
		unshuffleList();
		getShuffleBtn().innerHTML = "Shuffle";
	}
	enableBtns();
});

function handleListItemClickEvent(element) {
	disableBtns();

	let index = parseInt(element.getAttribute("index"));
	play(index);
	playOrder[playOrderIndex].classList.remove("playing");
	element.classList.add("playing");
	setFileName(listElements[index].innerHTML);

	if (isShuffled) {
		let elementOrderIndex = playOrder.indexOf(element);
		if (elementOrderIndex < playOrderIndex)//swap elementOrderIndex playOrderIndex
			[playOrder[elementOrderIndex], playOrder[playOrderIndex]] = [playOrder[playOrderIndex], playOrder[elementOrderIndex]];
		//swap elementOrderIndex playOrderIndex+1
		else[playOrder[elementOrderIndex], playOrder[++playOrderIndex]] = [playOrder[playOrderIndex], playOrder[elementOrderIndex]];
	}
	else {
		playOrderIndex = index;
	}
}

document.getElementById(inputId).addEventListener("change", (evt) => {
	disableBtns();

	let tgt = evt.target || window.event.srcElement,
		files = tgt.files;

	let firstPlayIndex = 0;
	// FileReader support
	if (FileReader && files && files.length) {
		let fr = new FileReader();
		fr.onload = function () {
			getPlayer().src = fr.result;
			enableBtns();
		}
		fr.readAsDataURL(files[firstPlayIndex]);
	}
	// Not supported
	else {
		alert("Not supported");
		return;
	}
	
	let isShuffled = false;
	getShuffleBtn().innerHTML = "Shuffle";

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
		if (i == firstPlayIndex) {
			listItem.classList.add("playing");
			setFileName(name);
		}
		listItem.setAttribute("onmouseup", "handleListItemClickEvent(this)");

		listItems.appendChild(listItem);
	}
	list.innerHTML = listItems.innerHTML;

	listElements = [...list.children];
	playOrder = [...listElements];//default play order
	playOrderIndex = firstPlayIndex;
});

getPlayer().addEventListener("ended", function (event) {
	if (getAutoPlayCheckBox().checked && playOrder.length > playOrderIndex + 1) {
		disableBtns();
		playOrder[playOrderIndex].classList.remove("playing");
		play(playOrder[++playOrderIndex].getAttribute("index"));
		playOrder[playOrderIndex].classList.add("playing");
		setFileName(playOrder[playOrderIndex].innerHTML);
	}
});

function disableBtns(){
	getNextBtn().disabled = true;
	getPreviousBtn().disabled = true;
	getShuffleBtn().disabled = true;
	getUnshuffleBtn().disabled = true;

	for(let i=0;i<listElements.length;i++){
		listElements[i].setAttribute("onmouseup", null);
	}
}

function enableBtns(){
	getNextBtn().disabled = false;
	getPreviousBtn().disabled = false;
	getShuffleBtn().disabled = false;
	getUnshuffleBtn().disabled = false;

	for(let i=0;i<listElements.length;i++){
		listElements[i].setAttribute("onmouseup", "handleListItemClickEvent(this)");
	}
}