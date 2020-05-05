let inputId = "audioInput";
let playerId = "player";

document.getElementById(inputId).addEventListener("change", function (evt) {
	var tgt = evt.target || window.event.srcElement,
		files = tgt.files;

	// FileReader support
	if (FileReader && files && files.length) {
		var fr = new FileReader();
		fr.onload = function () {
			getPlayer().src = fr.result;
		}
		fr.readAsDataURL(files[0]);
	}

	// Not supported
	else {
		alert("Not supported");
	}
});

function getInputAudios(){
	let input = document.getElementById(inputId);
	return input.files;
}

function getPlayer(){
	return document.getElementById(playerId);
}