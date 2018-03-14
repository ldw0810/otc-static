/**
 * @description 光标设置到节点的末尾
 * @param {element} 节点 
 */
export function setCursorPosition(el)
{
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}