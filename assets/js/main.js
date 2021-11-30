// Get URL invitation link
let r = new XMLHttpRequest(),
	url = `https://m2x.alwaysdata.net/hangit/server.php?liens=${current_url}`,
	link = "",
	invitationLink = "";
r.open("GET", url);
r.send();
r.addEventListener("load", () => {
	link = JSON.parse(r.response);
	if (link.liens) {
		// The player is about to join a game
		invitationLink = window.location.href.split("?g=")[1];
		toggleDisplay(Container.nickname);
		toggleDisplay(Container.joinGame)
	} else if (current_url.includes("?")) {
		// There is a link but it is invalid (not into the database)
		GameTip.textContent = Return.tip.invalidLink;
		toggleDisplay(GameTip)
	} else if (!link.liens) {
		// The player is about to host a new game
		invitationLink = GenerateLink();
		Input.invitationLink.value = `https://matteoo34.github.io/hangit.io/?g=${invitationLink}`;
		// Input.invitationLink.value = `http://localhost/hangit.io/?g=${invitationLink}`;
		// Input.invitationLink.value = `http://localhost:2021/?g=${invitationLink}`;
		toggleDisplay(Container.nickname);
		toggleDisplay(Container.openHostForm);
		GameTip.textContent = Return.tip.joinGame;
		toggleDisplay(GameTip);
		sendData("Link_game", Input.invitationLink.value)
	}
});
// Set interval Ajax
let readyPlayers = {},
	refreshReadyPlayers = setInterval(() => {
	if (current_url.includes("?")) {
		// Join game
		fetch(`https://m2x.alwaysdata.net/hangit/server.php?getmessage=${current_url}`)
			.then(response => response.text())
			.then(data => {console.warn(JSON.parse(data))})
	} else {
		// Host game
		// Get ready players
		fetch(`https://m2x.alwaysdata.net/hangit/server.php?getallplayer=${current_url}?g=${invitationLink}`)
			.then(response => response.text())
			.then(data => {readyPlayers = JSON.parse(data)});
		ReadyPlayersList.parentNode.children[0].children[0].textContent = readyPlayers.length;
		let child = ReadyPlayersList.lastElementChild;
		// Remove old players
		while (child) {
			ReadyPlayersList.removeChild(child);
			child = ReadyPlayersList.lastElementChild
		}
		// Add new players
		for (let i = 0; i < readyPlayers.length; i++) {
			let player = document.createElement("div");
			player.className = "Player";
			player.textContent = readyPlayers[i].nickname;
			player.style.color = readyPlayers[i].nicknameColor;
			ReadyPlayersList.appendChild(player)
		}
	}
}, 1000);







// Launch hosted game
Button.startHostGame.addEventListener("click", () => {
	//clearInterval(refreshReadyPlayers);
	// Close form modal
	Modal.close();
	// Close active containers
	toggleDisplay(Container.nickname, "none");
	toggleDisplay(Container.openHostForm, "none");
	GameTip.textContent = Return.tip.commandPrefix;
	// Start game
	// Send max rounds value to  server
	sendData("Max_Rounds", Input.maxRounds.value);
	startGame(Input.maxRounds.value)
})
// Copy invitation link
Button.copyLink.addEventListener("click", () => {
	Button.copyLink.textContent = "✔️ Copié !";
	setTimeout(() => {Button.copyLink.textContent = "Copier le lien"}, 2000);
	Input.invitationLink.select();
	Input.invitationLink.setSelectionRange(0, Input.invitationLink.value.length);
	document.execCommand("copy")
});

Button.openHostForm.addEventListener("click", () => {
	// Set player nickname
	SetNickname(Input.nickname.value);
	// Open form modal
	Modal.open(Modal.hostForm);
	// Input disabled when modal is open
	Input.nickname.disabled = true
});
document.querySelectorAll("input[type='range']").forEach((input) => {
	input.addEventListener("input", () => {
		let value = input.value;
		input.previousElementSibling.children[0].textContent = value
	})
});