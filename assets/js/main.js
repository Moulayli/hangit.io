// Get URL invitation link
let r = new XMLHttpRequest(),
	url = `https://m2x.alwaysdata.net/hangit/server.php?liens=${current_url.split("?g=")[1]}`,
	link = "",
	invitationLink = "";
r.open("GET", url);
r.send();
r.addEventListener("load", () => {
	link = JSON.parse(r.response);
	if (link.liens) {
		// The player is about to join a GameTip
		Player.role = "guest";
		// Change current URL
		invitationLink = window.location.href.split("?g=");
		invitationLink = invitationLink[invitationLink.length - 1];
		toggleDisplay(Container.nickname);
		toggleDisplay(Container.joinGame)
	} else if (current_url.includes("?")) {
		// There is a link but it is invalid (not into the database)
		current_url = window.location.href.split("?")[0];
		GameTip.textContent = Return.tip.invalidLink;
		toggleDisplay(GameTip)
	} else if (!link.liens) {
		// The player is about to host a new game
		Player.role = "host";
		invitationLink = GenerateLink();
		current_url += `?g=${invitationLink}`;
		// Input.invitationLink.value = `https://matteoo34.github.io/hangit.io/?g=${invitationLink}`;
		Input.invitationLink.value = `http://localhost/hangit.io/?g=${invitationLink}`;
		// Input.invitationLink.value = `http://localhost:2021/?g=${invitationLink}`;
		toggleDisplay(Container.nickname);
		toggleDisplay(Container.openHostForm);
		GameTip.textContent = Return.tip.joinGame;
		toggleDisplay(GameTip);
		sendData("link_game", invitationLink)
	}
});
// Ajax requests
let readyPlayers = [],
	messages = [],
	oldMessages = [],
	newMessages = [],
	fetchInterval = setInterval(() => {
		// Refresh ready player list
		fetch(`https://m2x.alwaysdata.net/hangit/server.php?getallplayer=${invitationLink}`)
			.then(response => response.text())
			.then(data => {readyPlayers = JSON.parse(data)});
		ReadyPlayersList.parentNode.children[0].children[0].textContent = readyPlayers.length;
		let lastChild = ReadyPlayersList.lastElementChild,
			lastChild2 = ConnectedPlayersList.lastElementChild;
		// Remove old players in lists
		while (lastChild) {
			ReadyPlayersList.removeChild(lastChild);
			lastChild = ReadyPlayersList.lastElementChild
		}
		while (lastChild2) {
			ConnectedPlayersList.removeChild(lastChild2);
			lastChild2 = ConnectedPlayersList.lastElementChild
		}
		// Add new players to lists
		for (let i = 0; i < readyPlayers.length; i++) {
			let player = document.createElement("div"),
				player2 = document.createElement("div"),
				player2Nickname = document.createElement("span"),
				player2Score = document.createElement("span");
			player.className = "Player";
			player2.className = "Player";
			player2Nickname.className = "PlayerNickname";
			player2Score.className = "PlayerScore";
			player.textContent = readyPlayers[i].nickname;
			player2Nickname.textContent = readyPlayers[i].nickname;
			player2Score.textContent = `${readyPlayers[i].score} points`;
			player.style.color = readyPlayers[i].nicknameColor;
			player2.style.color = readyPlayers[i].nicknameColor;
			ReadyPlayersList.appendChild(player);
			player2.appendChild(player2Nickname);
			player2.appendChild(player2Score);
			ConnectedPlayersList.appendChild(player2)
		}
		// Check for current round player
		for (let i = 0; i < readyPlayers.length; i++) {
			if (readyPlayers[i].roundPlayer == "true") {
				Round.currentRoundPlayer.nickname = readyPlayers[i].nickname;
				Round.currentRoundPlayer.nicknameColor = readyPlayers[i].nicknameColor;
				if (readyPlayers[i].nickname == Player.nickname) Player.roundPlayer = true
			}
		}
		// Refresh messages
		if (Game.started) {
			newMessages = [];
			fetch(`https://m2x.alwaysdata.net/hangit/server.php?getmessage=${invitationLink}`)
				.then(response => response.text())
				.then(data => {messages = JSON.parse(data)});
			if (messages.length > 0) {
				for (let i = 0; i < messages.length; i++) {
					if (oldMessages[i] == undefined) newMessages.push(messages[i])
				}
				// Update old messages
				oldMessages = messages;
				for (let i = 0; i < newMessages.length; i++) {
					// Send & check message
					// if (!(/^!/.test(newMessages[i].text))) sendMessage(false, htmlDecode(newMessages[i].text), newMessages[i].nickname, newMessages[i].nicknameColor);
					sendMessage(false, htmlDecode(newMessages[i].text), newMessages[i].nickname, newMessages[i].nicknameColor);
					// checkMessage(newMessages[i].text)
				}
			}
		}
	}, 100);







// Launch hosted game
Button.startHostGame.addEventListener("click", () => {
	// Start game
	// Send max rounds value to server
	sendData("maxRounds", Input.maxRounds.value);
	sendData("set_round", 1);
	startGame()
});
// Join hosted game
Button.joinGame.addEventListener("click", () => {
	// Join game
	// Set player nickname
	SetNickname(Input.nickname.value);
	Input.nickname.value = "";
	Input.nickname.disabled = true;
	startGame()
});
// Copy invitation link to clipboard
Button.copyLink.addEventListener("click", () => {
	Input.invitationLink.select();
	Input.invitationLink.setSelectionRange(0, Input.invitationLink.value.length);
	document.execCommand("copy");
	Button.copyLink.textContent = "✔️ Copié !";
	setTimeout(() => {Button.copyLink.textContent = "Copier le lien"}, 2000)
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
})