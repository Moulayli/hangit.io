Button.openHostForm.addEventListener("click", () => {
	// Set player nickname
	SetNickname(Input.nickname.value);
	// Open form modal
	Modal.open(Modal.hostForm);
	PlayerList.querySelector(".HostPlayer").children[0].textContent = Player.nickname
})

document.querySelectorAll("input[type='range']").forEach((input) => {
	input.addEventListener("input", () => {
		let value = input.value;
		input.previousElementSibling.children[0].textContent = value
	})
})
// Copy invitation link
Button.copyLink.addEventListener("click", () => {
	Button.copyLink.textContent = "✔️ Copié !";
	setTimeout(() => {Button.copyLink.textContent = "Copier le lien"}, 2000);
	link.select();
	link.setSelectionRange(0, link.value.length);
	document.execCommand("copy")
})
// Launch hosted game
Button.startHostGame.addEventListener("click", () => {
	// Close form modal
	Modal.close();
	// Close active containers
	toggleDisplay(Container.nickname, "none");
	toggleDisplay(Container.openHostForm, "none");
	toggleDisplay(joinHelp, "none");
	// Start game
	startGame(Input.maxRounds.value, Input.maxPlayers.value)
})