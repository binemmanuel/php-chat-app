(() => {
	const chatBox = document.querySelector("#chat-box");
	const chatForm = document.querySelector("#chat-form");
	const chatInput = document.querySelector("#chat-input");
	const typingFlag = document.querySelector(".typing-flag");

	const scrollToTop = () => {
		document.querySelector(".container").scrollTo({
			top: chatBox.scrollHeight,
			behavior: "smooth",
		});
	};

	const escapeHtml = (html) => {
		var text = document.createTextNode(html);
		var p = document.createElement("p");
		p.appendChild(text);
		return p.innerHTML;
	};

	const getTime = () => {
		let date = new Date().toLocaleTimeString("en-US", {
			timeZone: "Africa/Lagos",
		});

		date = date.split(":");

		const hour = date[0];
		const min = date[1];
		const a = date[2].split(" ")[1];

		return `${hour}:${min}${a}`.toLowerCase();
	};

	const socket = io("ws://localhost:8080");

	chatForm.addEventListener("submit", (event) => {
		event.preventDefault();

		if (chatInput.value === "") return;

		const p = document.createElement("p");
		chatBox.innerHTML += `
		<p class="me">
			<span class="message">${escapeHtml(chatInput.value)}</span>
			<span class="time">${getTime()}</span>
		</p>`;

		socket.emit("chat-message", chatInput.value);

		chatInput.value = "";

		scrollToTop();
	});

	chatInput.addEventListener("keypress", (event) => {
		if (event.key === "Enter") return;

		socket.emit("typing");
	});

	socket.on("typing", () => {
		typingFlag.style.visibility = "visible";
		setTimeout(() => {
			typingFlag.style.visibility = "hidden";
		}, 1000);
	});

	socket.on("chat-message", (data) => {
		chatBox.innerHTML += `
		<p>
			<span class="message">${
				document.createTextNode(data.message).textContent
			}</span>
			<span class="time">${data.time}</span>
		</p>`;
		scrollToTop();
	});

	socket.on("connect", (_) => {
		console.log("Connected to the server");
	});
})();
