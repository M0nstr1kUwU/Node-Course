export function checkPalindrome(text) {
    let text_res = text.toLowerCase();
    const revers = text_res.split('').reverse().join('');
    return revers === text_res;
}
