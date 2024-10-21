const URL = "https://teachablemachine.withgoogle.com/models/P49Kn8GbG/";

let model, webcam, labelContainer, maxPredictions;

// モデルとカメラのセットアップ
async function init() {
    if (webcam) {
        webcam.stop(); // 既存のカメラを停止
    }

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; // カメラを反転
    webcam = new tmImage.Webcam(200, 200, flip);

    await webcam.setup();
    await webcam.play();

    const canvas = webcam.canvas;
    canvas.id = "webcam-canvas";

    // すでにcanvasが存在する場合は追加しない
    const existingCanvas = document.getElementById("webcam-canvas");
    if (!existingCanvas) {
        document.getElementById("webcam-container").appendChild(canvas);
    }

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ''; 
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    window.requestAnimationFrame(loop);
}

// カメラフレームの更新
async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// 予測結果を表示
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
