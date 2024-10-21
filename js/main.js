let isPredicting = false; // 判定中フラグ
let cpuHand = -1; // CPUの手
let gameEnded = false; // ゲーム終了フラグ

// ゲームの初期化
async function initGame() {
    resetGame(); 
    if (!webcam) {
        await init(); // カメラを初期化
    }

    gameEnded = false; 
    cpuHand = Math.floor(Math.random() * 3); // CPUの手を事前に決定

    if (!isPredicting) {
        isPredicting = true;
        setTimeout(predictHand, 3000); // 1秒後に判定開始
    }
}

// ゲームのリセット
function resetGame() {
    document.getElementById("userImg").src = "";
    document.getElementById("cpuImg").src = "";
    document.getElementById("result").textContent = "";

    const labelContainer = document.getElementById("label-container");
    while (labelContainer.firstChild) {
        labelContainer.removeChild(labelContainer.firstChild);
    }
}

// ユーザーの手を判定する
async function predictHand() {
    if (gameEnded) return; // ゲームが終了していたら何もしない

    const prediction = await model.predict(webcam.canvas);
    const userHand = getHighestPrediction(prediction);

    if (userHand !== -1) {
        finalizeGame(userHand); // 判定ができたらゲームを確定
    } else {
        setTimeout(predictHand, 1000); // 判定できなければ再試行
    }
}

// 最も高い確率の手を取得する
function getHighestPrediction(prediction) {
    let highestProbability = 0;
    let hand = -1;
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProbability) {
            highestProbability = prediction[i].probability;
            hand = i;
        }
    }
    return hand;
}

// ゲームを確定する
function finalizeGame(userHand) {
    displayUserHand(userHand); // ユーザーの手を表示
    displayCpuHand(cpuHand);   // CPUの手を表示
    janken(userHand, cpuHand); // 勝敗を判定

    webcam.stop(); // カメラを停止
    gameEnded = true; // ゲーム終了フラグをセット
    isPredicting = false; // 判定フラグをリセット
}

// ユーザーの手を表示
function displayUserHand(hand) {
    const userJankens = ["g.png", "c.png", "p.png"];
    document.getElementById("userImg").src = "img/" + userJankens[hand];
}

// CPUの手を表示
function displayCpuHand(hand) {
    const cpuJankens = ["g.png", "c.png", "p.png"];
    document.getElementById("cpuImg").src = "img/" + cpuJankens[hand];
}

// 勝敗を判定する
function janken(user, cpu) {
    const result = [
        ["あいこ", "勝ち", "負け"],
        ["負け", "あいこ", "勝ち"],
        ["勝ち", "負け", "あいこ"],
    ];
    document.getElementById("result").textContent = result[user][cpu];
}

// スタートボタンのクリックイベントを設定
document.querySelector('.userChoice button').addEventListener('click', initGame);
document.getElementById("resetButton").addEventListener("click", () => {
  location.reload(); // ページ全体をリロードする
});
