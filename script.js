// FirestoreのインスタンスはHTML内で初期化済み
// キャラクタ頻度を記憶するオブジェクト
let characterFrequency = {};

// パスワード強度チェック関数
function checkPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('strength-indicator');
    const strengthText = document.getElementById('strength-text');
    const reasonDiv = document.getElementById('reason');
    
    const password = passwordInput.value;
    const result = calculatePasswordStrength(password);

    strengthText.textContent = result.strength + '%';
    reasonDiv.innerHTML = result.reason || '';

    analyzePassword(password);
    displayStatistics();
    updateDatabase();
}

// パスワード強度を計算する関数
function calculatePasswordStrength(password) {
    let strength = 0;
    let reason = '';

    if (password.length >= 8) {
        strength += 40;
    } else {
        reason += 'パスワードの長さが短すぎます。 ';
    }

    if (/[A-Z]/.test(password)) {
        strength += 25;
    } else {
        reason += '大文字が含まれていません。 ';
    }

    if (/\d/.test(password) && /[a-zA-Z]/.test(password)) {
        strength += 25;
    } else {
        reason += '数字とアルファベットの両方を使用してください。 ';
    }

    if (/[!@#$%^&*(),.?":{}|<>_-]/.test(password)) {
        strength += 10;
    } else {
        reason += '記号を使用してセキュリティを向上させてください。 ';
    }

    strength = Math.max(0, Math.min(100, strength));
    return { strength, reason };
}

// パスワードを解析し、各文字の頻度をカウントする関数
function analyzePassword(password) {
    characterFrequency = {}; // リセット

    for (let char of password) {
        if (characterFrequency[char]) {
            characterFrequency[char]++;
        } else {
            characterFrequency[char] = 1;
        }
    }
}

// Firestoreに頻度データを保存・更新する関数
async function updateDatabase() {
    try {
        const charFreqRef = db.collection("passwordStats").doc("characterFrequency");

        // データを保存、または既存データがあれば更新
        await charFreqRef.set(characterFrequency, { merge: true });
        console.log("データベースに保存しました");
    } catch (error) {
        console.error("データベース更新エラー:", error);
    }
}

// Firestoreからデータを取得し、characterFrequencyに読み込む
async function loadCharacterFrequency() {
    const charFreqRef = db.collection("passwordStats").doc("characterFrequency");
    const docSnap = await charFreqRef.get();

    if (docSnap.exists) {
        characterFrequency = docSnap.data();
        console.log("データベースからロードしました:", characterFrequency);
    } else {
        console.log("データが見つかりません");
    }
}

// ページ読み込み時にデータを取得
window.onload = loadCharacterFrequency;

// 統計表示
function displayStatistics() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = Object.keys(characterFrequency);
    const data = Object.values(characterFrequency);

    if (window.myChartInstance) {
        window.myChartInstance.destroy();
    }

    window.myChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Character Frequency',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
