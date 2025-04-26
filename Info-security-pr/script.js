// Caesar Cipher
function caesarEncrypt() {
    const input = document.getElementById("caesarInput").value;
    const shift = parseInt(document.getElementById("caesarShift").value);
    let result = "";

    for (let char of input) {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt();
            const base = (char === char.toUpperCase()) ? 65 : 97;
            result += String.fromCharCode(((code - base + shift) % 26) + base);
        } else {
            result += char;
        }
    }
    document.getElementById("caesarResult").innerText = "Encrypted: " + result;
}

function caesarDecrypt() {
    const input = document.getElementById("caesarInput").value;
    const shift = parseInt(document.getElementById("caesarShift").value);
    let result = "";

    for (let char of input) {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt();
            const base = (char === char.toUpperCase()) ? 65 : 97;
            result += String.fromCharCode(((code - base - shift + 26) % 26) + base);
        } else {
            result += char;
        }
    }
    document.getElementById("caesarResult").innerText = "Decrypted: " + result;
}

// Playfair Cipher
function playfairEncrypt() {
    const input = document.getElementById("playfairInput").value.toUpperCase();
    const key = document.getElementById("playfairKey").value.toUpperCase();
    const result = playfair(input, key, true);
    document.getElementById("playfairResult").innerText = "Encrypted: " + result;
}

function playfairDecrypt() {
    const input = document.getElementById("playfairInput").value.toUpperCase();
    const key = document.getElementById("playfairKey").value.toUpperCase();
    const result = playfair(input, key, false);
    document.getElementById("playfairResult").innerText = "Decrypted: " + result;
}

function playfair(text, key, encrypt) {
    // Create a 5x5 matrix for the Playfair cipher
    const matrix = createPlayfairMatrix(key);
    let result = "";
    const digraphs = createDigraphs(text);

    for (const [a, b] of digraphs) {
        const [rowA, colA] = findPosition(matrix, a);
        const [rowB, colB] = findPosition(matrix, b);

        if (rowA === rowB) {
            result += encrypt ? matrix[rowA][(colA + 1) % 5] + matrix[rowB][(colB + 1) % 5] :
                matrix[rowA][(colA - 1 + 5) % 5] + matrix[rowB][(colB - 1 + 5) % 5];
        } else if (colA === colB) {
            result += encrypt ? matrix[(rowA + 1) % 5][colA] + matrix[(rowB + 1) % 5][colB] :
                matrix[(rowA - 1 + 5) % 5][colA] + matrix[(rowB - 1 + 5) % 5][colB];
        } else {
            result += matrix[rowA][colB] + matrix[rowB][colA];
        }
    }
    return result;
}

function createPlayfairMatrix(key) {
    const matrix = [];
    const seen = new Set();
    key = key.replace(/J/g, "I").replace(/[^A-Z]/g, "").split("");

    for (const char of key) {
        if (!seen.has(char)) {
            seen.add(char);
            matrix.push(char);
        }
    }

    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        if (char !== "J" && !seen.has(char)) {
            seen.add(char);
            matrix.push(char);
        }
    }

    return Array.from({ length: 5 }, (_, i) => matrix.slice(i * 5, i * 5 + 5));
}

function createDigraphs(text) {
    const digraphs = [];
    text = text.replace(/[^A-Z]/g, "").replace(/J/g, "I");
    for (let i = 0; i < text.length; i += 2) {
        let a = text[i];
        let b = (i + 1 < text.length) ? text[i + 1] : 'X'; // Add 'X' if odd length
        if (a === b) {
            b = 'X'; // If both letters are the same, replace the second with 'X'
            i--; // Decrement i to recheck the same character
        }
        digraphs.push([a, b]);
    }
    return digraphs;
}

function findPosition(matrix, char) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (matrix[i][j] === char) {
                return [i, j];
            }
        }
    }
    return [-1, -1]; // Not found
}

// Feistel Cipher

// Check if input is a valid binary string
function isBinary(str) {
    return /^[01]+$/.test(str);
}

function feistelEncrypt() {
    const input = document.getElementById("feistelInput").value.trim();
    const keyStrings = document.getElementById("feistelKeys").value.split(',').map(k => k.trim());

    if (!isBinary(input) || input.length !== 8) {
        alert("Please enter a binary string of exactly 8 bits (only 0 and 1).");
        return;
    }

    if (keyStrings.some(key => !isBinary(key) || key.length !== 4)) {
        alert("Each key must be a 4-bit binary string (e.g., 1100, 0110).");
        return;
    }

    const keys = keyStrings.map(k => parseInt(k, 2)); // Convert keys from binary to numbers

    const result = feistel(input, keys, true);
    document.getElementById("feistelResult").innerText = "Encrypted: " + result;
}

function feistelDecrypt() {
    const input = document.getElementById("feistelInput").value.trim();
    const keyStrings = document.getElementById("feistelKeys").value.split(',').map(k => k.trim());

    if (!isBinary(input) || input.length !== 8) {
        alert("Please enter a binary string of exactly 8 bits (only 0 and 1).");
        return;
    }

    if (keyStrings.some(key => !isBinary(key) || key.length !== 4)) {
        alert("Each key must be a 4-bit binary string (e.g., 1100, 0110).");
        return;
    }

    const keys = keyStrings.map(k => parseInt(k, 2)); // Convert keys from binary to numbers

    const result = feistel(input, keys, false);
    document.getElementById("feistelResult").innerText = "Decrypted: " + result;
}

function feistel(input, keys, encrypt) {
    let halfLength = input.length / 2;
    let left = parseInt(input.slice(0, halfLength), 2);
    let right = parseInt(input.slice(halfLength), 2);
    const rounds = keys.length;

    for (let i = 0; i < rounds; i++) {
        const temp = right;
        const key = encrypt ? keys[i] : keys[rounds - 1 - i];
        right = left ^ feistelFunction(right, key);
        left = temp;
    }

    // Final swap after all rounds
    const finalLeft = right;
    const finalRight = left;

    const combined = (finalLeft.toString(2).padStart(halfLength, '0') + finalRight.toString(2).padStart(halfLength, '0'));

    return combined.padStart(8, '0').slice(-8); // Ensure output is exactly 8 bits
}

function feistelFunction(rightHalf, roundKey) {
    return rightHalf ^ roundKey; // Simple XOR
}




 



