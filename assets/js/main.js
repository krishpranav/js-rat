document.addEventListener("DOMContentLoaded", function() {
	let body = document.getElementsByTagName("body")[0];
	let divPasscodeWrapper = document.getElementsByClassName("passcode-wrapper")[0];
	let spanPasscode = document.getElementsByClassName("passcode-text")[0];
	let buttonPasscode = document.getElementsByClassName("passcode-button");
	let buttonAction = document.getElementsByClassName("action-button");
	let buttonClose = document.getElementsByClassName("close-button")[0];
	let buttonSettings = document.getElementsByClassName("settings-button");
	let divSettingsWrapper = document.getElementsByClassName("settings-wrapper")[0]
    let divOutputWrapper = document.getElementsByClassName("output-wrapper")[0];

	if (detectMobile()) {
		body.id = "mobile";
	}
	else {
		body.id = "desktop";
	}

	for(let i = 0; i < buttonPasscode.length; i++) {
		buttonPasscode[i].addEventListener("click", function() {
			if(!this.classList.contains("clear") && !this.classList.contains("backspace")) {
				let current = spanPasscode.getAttribute("data-passcode");
				if(current === null) {
					current = "";
				}
				spanPasscode.setAttribute("data-passcode", current + this.textContent);
				spanPasscode.textContent += "•";
			}
			else if(this.classList.contains("clear")) {
				spanPasscode.setAttribute("data-passcode", "");
				spanPasscode.textContent = "";
			}
			else if(this.classList.contains("backspace")) {
				let current = spanPasscode.getAttribute("data-passcode");
				spanPasscode.setAttribute("data-passcode", current.substring(0, current.length - 1));
				spanPasscode.textContent = spanPasscode.textContent.substring(0, spanPasscode.textContent.length - 1);
			}
		});
	}

}