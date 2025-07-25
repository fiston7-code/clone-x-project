import { utilisateurConnecter } from "./auth.js";
const tweetForm = document.getElementById("tweet-form");
const form = document.getElementById("form");
const inputTextErea = document.getElementById("tweet-text");
const conteneurTweets = document.getElementById("tweet-list");

addEventListener("DOMContentLoaded", (e) => {
  const email = localStorage.getItem("emailSoumis");
  if (email === null) {
    tweetForm.style.display = "none";
  } else {
    tweetForm.style.display = "block";
  }

  chargerTweets();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = inputTextErea.value;
  const email = localStorage.getItem("emailSoumis");

  utilisateurConnecter().then((user) => {
    const pseudoSansArobase = email.split("@")[0];
    const emailSansArobase = email.split("@")[0];

    const pseudo = "@" + pseudoSansArobase;

    // const avatar =
    //   user.avatar ||
    //   "https://t4.ftcdn.net/jpg/03/74/64/51/240_F_374645192_A1auR4EmLbz1JixGQKOSpHb2JAH3H7hH.jpg";

    // Remplacez par l'URL de l'avatar

    const tweet = {
      auteur: emailSansArobase,
      pseudo: pseudo,
      // avatar: avatar, // Remplacez par l'URL de l'avatar
      contenu: input,
      date: "à l'instant",
      likes: 0,
      retweets: 0,
      commentaires: 0,
    };

    fetch("http://localhost:3000/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tweet),
    }).then(() => {
      chargerTweets();
    });

    inputTextErea.value = "";
  });
});

function chargerTweets() {
  fetch("http://localhost:3000/tweets")
    .then((response) => response.json())
    .then((tweets) => {
      conteneurTweets.innerHTML = "";

      tweets.forEach((tweet) => {
        const tweetDiv = document.createElement("div");
        tweetDiv.classList.add("mb-6", "p-4", "border-b", "border-gray-700");

        // Ligne avec pseudo et date
        const headerDiv = document.createElement("div");
        headerDiv.classList.add(
          "flex",
          "items-center",
          "gap-2",
          "text-sm",
          "text-gray-400"
        );

        // Ligne avec avatar et pseudo
        const img = document.createElement("img");
        img.src =
          tweet.avatar ||
          "https://t4.ftcdn.net/jpg/03/74/64/51/240_F_374645192_A1auR4EmLbz1JixGQKOSpHb2JAH3H7hH.jpg"; // emplacez par l'URL de l'avatar
        img.alt = "Avatar";
        img.classList.add("w-10", "h-10", "rounded-full");
        headerDiv.appendChild(img);

        const userPhoto = document.getElementById("user-photo");
        userPhoto.src = img.src; // Mettre à jour l'image de l'utilisateur dans la barre de navigation

        const pseudo = document.createElement("span");
        pseudo.textContent = tweet.pseudo;

        const date = document.createElement("span");
        date.textContent = tweet.date;

        const nom = document.createElement("span");
        nom.textContent = tweet.auteur;
        nom.classList.add("font-bold", "text-white");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add(
          "text-red-500",
          "p-1",
          "hover:text-red-700",
          "rounded-full",
          "ml-auto"
        );
        deleteBtn.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
        // nom.innerHTML = `<span class="text-white">${tweet.auteur}</span>`;
        deleteBtn.addEventListener("click", () => {
          fetch(`http://localhost:3000/tweets/${tweet.id}`, {
            method: "DELETE",
          }).then(() => {
            chargerTweets();
          });
        });

        headerDiv.appendChild(nom);
        headerDiv.appendChild(pseudo);
        headerDiv.appendChild(date);
        headerDiv.appendChild(deleteBtn);

        // Paragraphe contenu tweet (en bloc sous le header)
        const textTweet = document.createElement("p");
        textTweet.textContent = tweet.contenu;
        textTweet.classList.add("text-white", "mt-2");

        // Ajout dans le conteneur principal
        tweetDiv.appendChild(headerDiv);
        tweetDiv.appendChild(textTweet);

        const interactionDiv = document.createElement("div");
        interactionDiv.classList.add(
          "flex",
          "items-center",
          "m-auto",
          "gap-8",
          "mb-8"
        );
        const interactionBtnLike = document.createElement("div");
        const interactionBtnRetweet = document.createElement("div");
        const likesBtn = document.createElement("button");
        const spanLikes = document.createElement("span");
        const retweetBtn = document.createElement("button");
        const spanRetweets = document.createElement("span");
        likesBtn.classList.add(
          "p-1",
          "active:text-red-500",
          "text-lg",
          "text-gray-500"
        );
        likesBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        spanLikes.textContent = tweet.likes;
        retweetBtn.classList.add(
          "text-gray-500",
          "p-1",
          "text-lg",
          "active:text-green-500"
        );
        retweetBtn.innerHTML = `<i class="fa-solid fa-retweet"></i>`;
        spanRetweets.textContent = tweet.retweets;
        likesBtn.addEventListener("click", () => {
          tweet.likes += 1; // Incrémente le nombre de likes localement
          spanLikes.textContent = tweet.likes; // Met à jour l'affichage des likes
          fetch(`http://localhost:3000/tweets/${tweet.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              likes: tweet.likes,
              retweets: tweet.retweets,
            }),
          });
        });

        retweetBtn.addEventListener("click", () => {
          tweet.retweets += 1;
          spanRetweets.textContent = tweet.retweets;
          // Incrémente le nombre de likes localement
          spanRetweets.textContent = tweet.likes;
          fetch(`http://localhost:3000/tweets/${tweet.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              retweets: tweet.retweets,
            }),
          });
        });
        interactionDiv.appendChild(interactionBtnLike);
        interactionDiv.appendChild(interactionBtnRetweet);
        interactionBtnLike.appendChild(likesBtn);
        interactionBtnLike.appendChild(spanLikes);
        interactionBtnRetweet.appendChild(retweetBtn);
        interactionBtnRetweet.appendChild(spanRetweets);
        tweetDiv.appendChild(interactionDiv);

        conteneurTweets.appendChild(tweetDiv);
      });
    });
}
