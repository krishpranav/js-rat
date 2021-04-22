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

	if(detectMobile()) {
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

	for(let i = 0; i < buttonAction.length; i++) {
		buttonAction[i].addEventListener("click", function() {
			if(this.classList.contains("restart")) {
				performAction("restart");
			}
			else if(this.classList.contains("shutdown")) {
				performAction("shutdown");
			}
			else if(this.classList.contains("apps")) {
				performAction("apps");
			}
			else if(this.classList.contains("settings")) {
				divSettingsWrapper.style.display = "block";
			}
		});
	}

	buttonClose.addEventListener("click", function() {
		divSettingsWrapper.style.display = "none";
	});

	for(let i = 0; i < buttonSettings.length; i++) {
		buttonSettings[i].addEventListener("click", function() {
			let passcode = spanPasscode.getAttribute("data-passcode");

			let xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function() {
				if(xhr.readyState === XMLHttpRequest.DONE) {
					console.log(xhr.responseText);
				}
			});

			if(this.classList.contains("install")) {
				xhr.open("POST", "/install", true);
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(JSON.stringify({ "passcode":passcode }));
			}
			else if(this.classList.contains("uninstall")) {
				xhr.open("POST", "/uninstall", true);
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(JSON.stringify({ "passcode":passcode }));
			}
		});
	}

	function performAction(action, args) {
		let passcode = spanPasscode.getAttribute("data-passcode");
		let xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", function() {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				let output = xhr.responseText.toString();
				if(action === "apps") {
					output = output.replaceAll(" Services", "   Services");
					output = output.replaceAll(" Console", "   Console");
					let lines = output.split("\n");
					lines.splice(0, 3);
					let processes = [];
					for(let i = 0; i < lines.length; i++) {
						let parts = lines[i].split("  ");
						for(let j = 0; j < parts.length; j++) {
							if(parts[j].trim() !== "") {
								processes.push(parts[j].trim());
							}
						}
					}
					for(let i = 0; i < processes.length; i += 5) {
						let name = processes[i];
						let pid = processes[i + 1];
						let sessionName = processes[i + 2];
						let sessionNumber = processes[i + 3];
						let memory = processes[i + 4];

						let row = document.createElement("div");
						row.classList.add("app-row");
						row.innerHTML = '<span class="app-name">' + name + '</span><span class="app-pid">' + pid + '</span>';

						let endButton = document.createElement("button");
						endButton.classList.add("app-button");
						endButton.textContent = "End Task";

						endButton.addEventListener("click", function() {
							let pid = this.parentElement.getElementsByClassName("app-pid")[0].textContent;
							performAction("killapp", pid);
						});

						row.appendChild(endButton);

						divOutputWrapper.appendChild(row);
					}
				}
			}
		});
		xhr.open("POST", "/api", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify({ "action":action, "passcode":passcode, "args":args }));
	}
});

