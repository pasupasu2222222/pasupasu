function generatePassword() {
    const input = document.getElementById('passwordInput').value;
    const frequency = {};

    // 使用頻度を計算
    for (let char of input) {
        if (char.match(/[a-zA-Z0-9]/)) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
    }

    // 使用されていないアルファベットと数字を特定
    const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let leastUsedChars = [];
    for (let char of allChars) {
        if (!frequency[char]) {
            leastUsedChars.push(char);
        }
    }

    // 強力なパスワード生成
    let strongPassword = '';
    while (strongPassword.length < 12) {
        strongPassword += leastUsedChars[Math.floor(Math.random() * leastUsedChars.length)];
    }

    // 生成したパスワードを表示
    document.getElementById('generatedPassword').textContent = '生成されたパスワード: ' + strongPassword;
}
