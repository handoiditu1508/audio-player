let inputId = "audioInput";
let listElements = [];
let playOrder = [];
let playOrderIndex = null;

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

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
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

function playNext() {
	playOrder[playOrderIndex].classList.remove("playing");
	if (playOrder.length > playOrderIndex + 1)
		playOrderIndex++;
	else playOrderIndex = 0;
	play(playOrder[playOrderIndex].getAttribute("index"));
	playOrder[playOrderIndex].classList.add("playing");
}

function playPrevious() {
	playOrder[playOrderIndex].classList.remove("playing");
	if (-1 < playOrderIndex - 1)
		playOrderIndex--;
	else playOrderIndex = playOrder.length - 1;
	play(playOrder[playOrderIndex].getAttribute("index"));
	playOrder[playOrderIndex].classList.add("playing");
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
}

function unshuffleList() {
	for(i=0;i<listElements.length;i++){
		if(playOrder[playOrderIndex] == listElements[i]){
			playOrderIndex = i;
			break;
		}
	}
	playOrder = [...listElements];
}

getNextBtn().addEventListener("mouseup", () => playNext());

getPreviousBtn().addEventListener("mouseup", () => playPrevious());

getShuffleBtn().addEventListener("mouseup", () => shuffleList());

getUnshuffleBtn().addEventListener("mouseup", () => unshuffleList());

function handleListItemClickEvent(element) {
	play(element.getAttribute("index"));
	playOrder[playOrderIndex].classList.remove("playing");
	element.classList.add("playing");
	for (i = 0; i < playOrder.length; i++) {
		if (playOrder[i] == element) {
			playOrderIndex = i;
			break;
		}
	}
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
		if (i == firstPlayIndex)
			listItem.classList.add("playing");
		listItem.setAttribute("index", i);

		let name = files[i].name;
		name = name.substring(0, name.lastIndexOf("."));
		listItem.innerHTML = name;
		listItem.setAttribute("onmouseup", "handleListItemClickEvent(this)");

		listItems.appendChild(listItem);
	}
	list.innerHTML = listItems.innerHTML;

	listElements = [...list.children];
	playOrder=[...listElements];//default play order
	playOrderIndex = firstPlayIndex;
});

getPlayer().addEventListener("ended", function (event) {
	if (playOrder.length > playOrderIndex + 1) {
		playOrder[playOrderIndex].classList.remove("playing");
		play(playOrder[++playOrderIndex].getAttribute("index"));
		playOrder[playOrderIndex].classList.add("playing");
	}
});