class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });

        var myHeaders = new Headers();
        myHeaders.append("apikey", "mVzJ4Pl55BRKBAe8d9MirlhYplsYYSmn");

        var raw = text1;

        var requestOptions = {
          method: 'POST',
          redirect: 'follow',
          headers: myHeaders,
          body: raw
        };

        fetch("https://api.apilayer.com/text_to_emotion", requestOptions)
          .then(response => response.json())
          .then(result => {
                console.log(result)

                let emotion = ""
                let mood = document.getElementById('mood')
                if(result.Happy == 1) {
                    emotion = "Happy"
                    mood.innerHTML = 'Happy 😊'
                } else if(result.Angry == 1) {
                    emotion = "Angry"
                    mood.innerHTML = 'Angry 😡'
                } else if(result.Surprise == 1) {
                    emotion = "Surprise"
                    mood.innerHTML = 'Surprise 😮'
                } else if(result.Sad == 1) {
                    emotion = "Sad"
                    mood.innerHTML = 'Sad 😢'
                } else if(result.Fear == 1) {
                    emotion = "Fear"
                    mood.innerHTML = 'Fearful 😱'
                }

                this.getSongs(emotion)
            })
          .catch(error => console.log('error', error));


    }

    getSongs(emotion) {
        let APP_NAME = "loqua"
        let API_KEY = "9eddf0b798b7349a36154bb5e0e404e5"
        let SHARED_SECRET = "88a113397435a6343aaded1bdb5b3e7b"
        let REGISTERED_TO = "webster7t2"
        let API_ROOT_URL = "http://ws.audioscrobbler.com/2.0"

        let tag = emotion

        fetch(`${API_ROOT_URL}/?method=tag.gettoptracks&tag=${tag}&api_key=${API_KEY}&format=json`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let container = document.createElement('div')
            container.className = 'container'
            for(let i in data.tracks.track){
                // let songName = document.createElement('h1')
                // songName.innerHTML = `${data.tracks.track[i].name}`
                // document.body.appendChild(songName)

                // let songdiv = document.createElement('div')
                // let songname = document.createElement('h1')
                // songname.innerHTML = `${data.tracks.track[i].name}`
                // let songimage = document.createElement('img')
                // songimage.src = `${data.tracks.track[0].image[1]["#text"]}`
                // let songurl = document.createElement('a')
                // songurl.innerHTML = `${data.tracks.track[i].url}`
                // songurl.href = `${data.tracks.track[i].url}`

                // songdiv.appendChild(songimage)
                // songdiv.appendChild(songname)
                // songdiv.appendChild(songurl)

                let songdiv = document.createElement('div')
                songdiv.className = 'songdiv'
                let songname = document.createElement('h1')
                songname.innerHTML = `${data.tracks.track[i].name}`
                let songimage = document.createElement('img')
                songimage.src = `${data.tracks.track[0].image[1]["#text"]}`
                let songurl = document.createElement('a')
                songurl.innerHTML = `Link to the track`
                songurl.href = `${data.tracks.track[i].url}`

                songdiv.appendChild(songimage)
                songdiv.appendChild(songname)
                songdiv.appendChild(songurl)

                container.appendChild(songdiv)

            }
            document.body.appendChild(container)
        })

    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

// text to emotion API
// var myHeaders = new Headers();
// myHeaders.append("apikey", "mVzJ4Pl55BRKBAe8d9MirlhYplsYYSmn");

// var raw = text1;

// var requestOptions = {
//   method: 'POST',
//   redirect: 'follow',
//   headers: myHeaders,
//   body: raw
// };

// fetch("https://api.apilayer.com/text_to_emotion", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));


const chatbox = new Chatbox();
chatbox.display();