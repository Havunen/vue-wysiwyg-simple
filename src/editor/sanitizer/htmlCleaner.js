const tagWhiteList = new Set([
  'A', 'B', 'BR', 'DIV',
  'I', 'LI', 'P', 'PRE',
  'SPAN', 'UL', 'U', 'STRONG'
])

// tags that will be converted to DIVs
const contentTagWhiteList = new Set([
  'ABBR', 'BLOCKQUOTE', 'BODY', 'CENTER', 'CODE', 'DD',
  'DL', 'DT', 'EM', 'FONT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'HR', 'LABEL', 'OL', 'SOURCE',
  'SUB', 'SUP', 'TABLE', 'TBODY', 'TR', 'TD', 'TH', 'THEAD',
  'FORM', 'GOOGLE-SHEETS-HTML-ORIGIN', 'SMALL', 'TD', 'THEAD',
])

// Generally forbidden
// 'IMG', 'SCRIPT', 'VIDEO'

const TEXT_NODE = Node.TEXT_NODE;
const ELEMENT_NODE = Node.ELEMENT_NODE;

const _parser = new DOMParser();

function makeSanitizedCopy(node, doc) {
  const tagName = node.tagName;
  let newNode;

  if (node.nodeType === TEXT_NODE) {
    newNode = node.cloneNode(true);
  } else if (node.nodeType === ELEMENT_NODE && (
    tagWhiteList.has(tagName) ||
    contentTagWhiteList.has(tagName)
  )) { //is tag allowed?

    if (contentTagWhiteList.has(tagName))
      newNode = doc.createElement('DIV'); //convert to DIV
    else
      newNode = doc.createElement(tagName);

    if (tagName === 'A') {
      const href = node.getAttribute('href');

      if (!href.includes('javascript:') && !href.includes('data:')) {
        newNode.setAttribute('href', href);
      }

      // All links should have target blank and rel noopener noreferrer
      newNode.setAttribute('target', '_blank');
      newNode.setAttribute('rel', 'noopener noreferrer');
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const subCopy = makeSanitizedCopy(node.childNodes[i], doc);
      newNode.appendChild(subCopy);
    }

    const newNodeTagName = newNode.tagName;

    //remove useless empty spans (lots of those when pasting from MS Outlook)
    if ((newNodeTagName === "SPAN" || newNodeTagName === "B" || newNodeTagName === "I" || newNodeTagName === "U")
      && newNode.innerHTML.trim() === "") {
      return doc.createDocumentFragment();
    }

  } else {
    newNode = doc.createDocumentFragment();
  }
  return newNode;
}

export function htmlCleaner(input) {
  input = input.trim();
  if (input === "") return ""; //to save performance

  // firefox "bogus node" workaround for wysiwyg's
  if (input === "<br>") return "";

  let doc = _parser.parseFromString(input, "text/html");

  //DOM clobbering check (damn you firefox)
  if (doc.body.tagName !== 'BODY')
    doc.body.remove();
  if (typeof doc.createElement !== 'function')
    doc.createElement.remove();

  let resultElement = makeSanitizedCopy(doc.body, doc);

  return resultElement.innerHTML
    .replace(/<br[^>]*>(\S)/g, "<br>\n$1")
    .replace(/div><div/g, "div>\n<div"); //replace is just for cleaner code
}
