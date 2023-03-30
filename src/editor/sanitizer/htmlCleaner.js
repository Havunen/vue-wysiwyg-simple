import {cleanControlFlowCharacters} from './cleanControlFlowCharacters';

const tagWhiteList = new Set([
  'A', 'B', 'BR', 'DIV',
  'I', 'LI', 'P', 'PRE',
  'SPAN', 'UL', 'U', 'STRONG'
]);

// tags that will be converted to DIVs
const contentTagWhiteList = new Set([
  'ABBR', 'BLOCKQUOTE', 'BODY', 'CENTER', 'CODE', 'DD',
  'DL', 'DT', 'EM', 'FONT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'HR', 'LABEL', 'OL', 'SOURCE', 'ASIDE', 'MAIN', 'FOOTER',
  'BUTTON', 'NAV', 'ARTICLE', 'COLGROUP', 'CAPTION', 'COL',
  'HEADER',
  'SUB', 'SUP', 'TABLE', 'TBODY', 'TR', 'TD', 'TH', 'THEAD',
  'FORM', 'GOOGLE-SHEETS-HTML-ORIGIN', 'SMALL', 'TD', 'THEAD',
]);

// Generally forbidden
// 'IMG', 'SCRIPT', 'VIDEO'

const TEXT_NODE = Node.TEXT_NODE;
const ELEMENT_NODE = Node.ELEMENT_NODE;

function handleAnchor(tagName, node, newNode) {
  if (tagName === 'A') {
    const href = node.getAttribute('href');

    if (href && (!href.includes('javascript:') && !href.includes('data:'))) {
      newNode.setAttribute('href', href);
    }

    // All links should have target blank and rel noopener noreferrer
    newNode.setAttribute('target', '_blank');
    newNode.setAttribute('rel', 'noopener noreferrer');
  }
}

function makeSanitizedCopy(node, doc) {
  const tagName = node.tagName;
  let newNode;

  if (node.nodeType === TEXT_NODE) {
    newNode = node.cloneNode(true);
  } else if (node.nodeType === ELEMENT_NODE) {
    if (tagWhiteList.has(tagName)) {
      // keep the tag and its content
      newNode = doc.createElement(tagName);
    } else if (contentTagWhiteList.has(tagName)) {
      // keep only the content
      newNode = doc.createDocumentFragment();
    } else {
      // unsafe tag, ignore it
      return doc.createDocumentFragment();
    }

    handleAnchor(tagName, node, newNode);

    for (let i = 0; i < node.childNodes.length; i++) {
      const subCopy = makeSanitizedCopy(node.childNodes[i], doc, false);
      newNode.appendChild(subCopy);
    }

    if (newNode.nodeType === ELEMENT_NODE && tagName !== 'BR' && newNode.innerHTML.trim() === "") {
      return doc.createDocumentFragment();
    }
  } else {
    // not supported node type, Comment etc.
    newNode = doc.createDocumentFragment();
  }

  return newNode;
}

export function htmlCleaner(input) {
  input = input.trim();
  if (input === "") {
    return "";
  }

  // firefox "bogus node" workaround
  if (input === "<br>") {
    return "";
  }

  const div = document.createElement('div');
  div.innerHTML = input;

  let resultElement = makeSanitizedCopy(div, document);

  return cleanControlFlowCharacters((resultElement.innerHTML || '').replace(/&nbsp;/g, ' '));
}
